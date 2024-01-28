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
    validateToken(e);
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
      makeTemplate(response.data.data.dtoList, template, targetHtml);
    }
  }).catch(e => {
    validateToken(e);
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
      window.location.href = `/postRead.html?clubId=${clubId}&postId=${postId}`;
    }
  }).catch(e => {
    validateToken(e);
    alert("요청을 처리하는데 문제가 있습니다.");
    window.location.href = `/clubRead.html?clubId=${clubId}`;
  });
}

document.querySelector(".comment-btn").addEventListener("click", function () {
  let content = document.querySelector(".input-content");
  let data = {
    content: content.value
  }
  if (validator) {
    sendComment(data);
  }
});


function validator(data) {
  if (data.content === "") {
    return false;
  }
  return true;
}


document.querySelector(".modify-btn").addEventListener("click", function() {
 let clubId = parseUrl("clubId");
 let postId = parseUrl("postId");
 window.location.href = `/postEdit.html?clubId=${clubId}&postId=${postId}`;
});