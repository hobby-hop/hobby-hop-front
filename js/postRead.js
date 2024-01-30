document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPost();
  getComment();
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
    document.querySelector(".content").innerText = response.data.data.postContent;
    if(response.data.data.originImageUrl != null) {
      let imgTag = `<img id="post-image" src="${response.data.data.originImageUrl}" alt="">`;
      document.querySelector(".img-container").innerHTML = imgTag;
    }
  }).catch(e => {
    // validateToken(e.response.data.errorMessages[0]);
    if(e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
      alert("모임의 멤버만 읽을 수 있습니다.");
      window.history.back();
    }
  });
}

async function getComment() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}/comments?page=1&size=10&keyword=&desc=true`;

  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      let template = document.getElementById("comment-template").innerText;
      let targetHtml = document.querySelector(".comment-each-container");
      let resultHtml = makeTemplate(response.data.data.dtoList, template);
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
    if(response.status == 200) {
      alert("댓글이 작성되었습니다");
      getComment();
    }
  }).catch(e => {
    if(e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
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
  if (content === "") {
    return false;
  }
  return true;
}

document.querySelector(".modify-btn").addEventListener("click", function() {
 let clubId = parseUrl("clubId");
 let postId = parseUrl("postId");
 window.location.href = `/postEdit.html?clubId=${clubId}&postId=${postId}`;
});

document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})