document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  let response = getMyInfo();
  response.then(response => {
    let currentUser = response.data.data.username;
    localStorage.setItem('currentUser', currentUser);
    getPost(currentUser);
    getComment(currentUser, 1);
  });
});

let postChange = {};
async function getPost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;

  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    postChange.title = response.data.data.title;
    postChange.content = response.data.data.content;
    templatePost(response.data.data);
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
  await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      getComment(localStorage.getItem("currentUser"), 1);
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

async function getMyInfo() {
  let url = `http://localhost:8080/api/users/profiles/my`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
};
let commentChange = {};

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
      commentChange[commentId] = currentComment;
    } else if (evt.target.classList.contains("comment-modify") && evt.target.classList.contains("edit")) {
      evt.target.classList.remove("edit");
      let commentContent = comment.querySelector(".comment-content");
      let content = commentContent.textContent;
      commentContent.contentEditable = false;

      if (content !== commentChange[commentId]) {
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
  if (data.liked) {
    document.getElementById('heart').classList.add('active');
  }
  document.querySelector('.post-like-cnt').innerText = data.likeCnt;
  postContainer.innerHTML = makeTemplate(data, postTemplate);
  registerEvents();
}

function registerEvents() {
  document.querySelector(".modify-btn").addEventListener("click", function () {
    let title = document.querySelector('.title');
    let content = document.querySelector('.content');
    let modifyBtn = document.querySelector('.modify-btn');

    if (!title.classList.contains('editing')) {
      modifyBtn.innerText = "완료";
      title.classList.add('editing');
      title.contentEditable = true;
      content.contentEditable = true;
      title.focus();
    } else {
      modifyBtn.innerText = "수정";
      title.classList.remove('editing');
      title.contentEditable = false;
      content.contentEditable = false;
      if(validatePost(title, content)) {
        let data = {};
        
        if(postChange.title !== title.innerText) {
          data.title = title.innerText;
        }
        if(postChange.content !== content.innerText) {
          data.content = content.innerText;
        }
  
        if (Object.keys(data).length === 0) {
          return;
        }
      
        modifyPost(data);
      }
    }
  })
  document.querySelector(".delete-btn").addEventListener("click", function () {
    console.log("!!!");
    let userResponse = confirm("게시글을 삭제하시겠습니까?");
    if (userResponse) {
      let response = deleteRequests();
      response.then(response => {
        if (response.status == 200) {
          alert("삭제가 완료되었습니다.")
          window.history.go(-1);
        }
      }).catch(e => {
        alert("권한이 없습니다.")
        window.history.go(-1);
      });
  
    }
  });
  document.querySelector('.pagination').addEventListener('click', function (evt) {
    if (evt.target.tagName == 'A') {
      let requestPage = evt.target.dataset.page;
      let currentUser = localStorage.getItem('currentUser');
      getComment(currentUser, requestPage);
    }
  });
}

document.getElementById('heart').addEventListener('click', function () {
  likePost().then(response => {
    document.querySelector('.post-like-cnt').innerText = response.data.data;
    document.getElementById('heart').classList.toggle('active');
  })
});


async function likePost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}/likes`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  })
  return response;
}
async function modifyPost(data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;
  
  await axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    templatePost(response.data.data);
  });
}
function validatePost(title, content) {
  if (title.innerText !== undefined && typeof title.innerText === 'string') {
    if (title.innerText.length < 3 || title.innerText.length > 50) {
      alert("제목은 3자에서 50자 사이로 작성해주세요.");
      title.innerText = postChange.title;
      return false;
    }
  }
  if (content.innerText !== undefined && typeof content.innerText === 'string') {
    if (content.innerText.length > 500) {
      alert("본문은 500자 이내로 작성해주세요.");
      content.innerText = postChange.content;
      return false;
    }
  }

  return true;
}

async function deleteRequests() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.delete(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}