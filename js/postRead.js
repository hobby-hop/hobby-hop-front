document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPost();
  let response = getMyInfo();
  response.then(response => {
    let currentUser = response.data.data.username;
    getComment(currentUser);
  });
});

async function getPost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");

  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    document.querySelector(".title").innerText = response.data.data.postTitle;
    document.querySelector(".writer-text").innerText = response.data.data.writer;
    document.querySelector(".content").innerText = response.data.data.postContent;
    if (response.data.data.originImageUrl != null) {
      let imgTag = `<img id="post-image" src="${response.data.data.originImageUrl}" alt="">`;
      document.querySelector(".img-container").innerHTML = imgTag;
    }
  }).catch(e => {
    // validateToken(e.response.data.errorMessages[0]);
    if (e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
      alert("모임의 멤버만 읽을 수 있습니다.");
      window.history.back();
    }
  });
}

async function getComment(currentUser) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}/comments?page=1&size=10&keyword=&desc=true`;

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
    }
  }).catch(e => {
    // validateToken(e);
  });
}

async function sendComment(data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}/comments`;
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

document.querySelector(".modify-btn").addEventListener("click", function () {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  window.location.href = `/postEdit.html?clubId=${clubId}&postId=${postId}`;
});

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

async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}
async function getMyInfo() {
  let url = `https://hobbyback.store/api/users/profile`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }
  )
  return response;
};

document.querySelector(".comment-each-container").addEventListener("click", function(evt) {
  if(evt.target.classList.contains("comment-modify") || evt.target.classList.contains("comment-delete")){
    let comment = evt.target.closest(".comment-box");

    if(evt.target.classList.contains("comment-modify")) {
      comment.querySelector(".comment-content").contentEditable = true;
      comment.querySelector(".comment-content").focus();
    } else {
      
    }
  }
  
});

async function modifyComment(commentId) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}/comments/${commentId}`
  let response = await axios.patch(url, );
}
function makeCommentTemplate(data, template, currentUser) {
  let bindTemplate = Handlebars.compile(template);
  
  let resultHtml = data.reduce(function (prve, next) {
    next.currentUser = currentUser;
    return prve + bindTemplate(next);
  }, "");
  return resultHtml;
}