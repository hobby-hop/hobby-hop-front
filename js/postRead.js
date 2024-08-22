document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  let response = getMyInfo();
  response.then(response => {
    let currentUser = response.data.data.username;
    localStorage.setItem('currentUser', currentUser);
    getComment(currentUser, 1);
    getPost(currentUser);
  });
});

async function getPost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");

  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;
  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    templatePost(response.data.data);
    registerEvents();
  }).catch(e => {
  });
}

async function getComment(currentUser, page) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}/comments?page=${page}&size=10&desc=false`;

  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      let template = document.getElementById("comment-template").innerText;
      let targetHtml = document.querySelector(".comment-each-container");
      let resultHtml = makeCommentTemplate(response.data.data.dtoList, template, currentUser);
      targetHtml.innerHTML = resultHtml;
      printPages(response.data.data);
    }
  }).catch(e => {
  });
}

async function sendComment(data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}/comments`;
  let response = await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      alert("댓글이 작성되었습니다");
      window.location.reload();
    }
  }).catch(e => {
    if (e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
      alert("자신이 가입된 모임에만 댓글을 남길 수 있습니다.");
    }
    window.history.back();
  });
}

document.querySelector(".comment-btn").addEventListener("click", function () {
  let content = document.querySelector(".input-content");
  let data = {
    content: content.value
  }
  if (validateComment(content)) {
    sendComment(data);
  }
});

function validateComment(content) {
  if (content.value === "") {
    alert("댓글을 입력해주세요.");
    return false;
  }
  if (content.value.length > 200) {
    alert("댓글은 최대 200자까지 입력할 수 있습니다.");
    return false;
  }
  return true;
}


document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})

document.querySelector(".logout").addEventListener("click", function () {
  logout().then(response => {
    if (response.status == 200) {
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {

  });
});

async function getMyInfo() {
  let url = `http://localhost:8080/api/users/profiles/my`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }
  )
  return response;
};
let change = {};
document.querySelector(".comment-each-container").addEventListener("click", function (evt) {
  if (evt.target.classList.contains("comment-modify") || evt.target.classList.contains("comment-delete")) {
    let comment = evt.target.closest(".comment-box");
    let commentId = comment.dataset.commentId;

    if (evt.target.classList.contains("comment-modify") && !(evt.target.classList.contains("edit"))) {
      evt.target.classList.add("edit");
      let commentContent = comment.querySelector(".comment-content");
      commentContent.contentEditable = true;
      commentContent.focus();
      currentComment = commentContent.textContent;
      change[commentId] = currentComment;
    } else if (evt.target.classList.contains("comment-modify") && evt.target.classList.contains("edit")) {
      evt.target.classList.remove("edit");
      let commentContent = comment.querySelector(".comment-content");
      let content = commentContent.textContent;
      commentContent.contentEditable = false;

      if (content !== change[commentId]) {
        let data = {
          content: content
        };

        let response = modifyComment(commentId, data);
        response.then(response => {
          if (response.status == 200) {
            alert("댓글이 수정되었습니다.");
          }
        }).catch(e => {
          alert(e.response.data.errorMessages[0]);
        });
      } else {
        alert("변경된 내용이 없습니다.");
      }
    }
    if (evt.target.classList.contains("comment-delete")) {
      let response = deleteComment(commentId);
      response.then(response => {
        if (response.status == 200) {
          alert("댓글이 삭제되었습니다.");
          let response = getMyInfo();
          response.then(response => {
            currentUser = response.data.data.username;
            getComment(currentUser, 1);
          });
        }
      }).catch(e => {
        alert(e);
      });
    }
  }


});

async function modifyComment(commentId, data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}/comments/${commentId}`
  let response = await axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}

async function deleteComment(commentId) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}/comments/${commentId}`
  let response = await axios.delete(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}


function makeCommentTemplate(data, template, currentUser) {
  let bindTemplate = Handlebars.compile(template);

  let resultHtml = data.reduce(function (prve, next) {
    next.currentUser = currentUser;
    return prve + bindTemplate(next);
  }, "");
  return resultHtml;
}

function printPages(data) {
  const postPaging = document.querySelector(".pagination");
  let pageStr = '';
  if (data.prev) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${data.start - 1}>PREV</a></li>`
  }

  for (let i = data.start; i <= data.end; i++) {
    if (data.page === i) {
      pageStr += `<li><a href="#comment-container" class="page-number active" data-page=${i}>${i}</a></li>`
    } else {
      pageStr += `<li><a href="#comment-container" class="page-number" data-page=${i}>${i}</a></li>`
    }
  }

  if (data.next) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${data.end + 1}>NEXT</a></li>`
  }
  postPaging.innerHTML = pageStr;
}

document.querySelector('.pagination').addEventListener('click', function (evt) {
  if (evt.target.tagName == 'A') {
    let requestPage = evt.target.dataset.page;
    let currentUser = localStorage.getItem('currentUser');
    getComment(currentUser, requestPage);
  }
});

function templatePost(data) {
  let postTemplate = document.getElementById("post-template").innerText;
  let postContainer = document.querySelector(".post-container");
  postContainer.innerHTML = makeTemplate(data, postTemplate);
}

function registerEvents() {
  document.querySelector(".modify-btn").addEventListener("click", function () {
    let clubId = parseUrl("clubId");
    let postId = parseUrl("postId");
    window.location.href = `/postEdit.html?clubId=${clubId}&postId=${postId}`;
  });
  document.querySelector('.pagination').addEventListener('click', function (evt) {
    if (evt.target.tagName == 'A') {
      let requestPage = evt.target.dataset.page;
      let currentUser = localStorage.getItem('currentUser');
      getComment(currentUser, requestPage);
    }
  });
}