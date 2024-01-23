document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPost();
  getComment();
});


let heartEl = document.getElementById("heart");
heartEl.addEventListener("click", function () {
  // let likeUrl = `http://localhost:8080/api/posts/${postId}/likes`;
  // if(heartEl.classList.contains("active")) {
  //     axios.delete(likeUrl);
  // } else {
  //     axios.post(likeUrl);
  // }
  heartEl.classList.toggle("active");
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
    document.querySelector(".board-title").innerText = response.data.data.postTitle;
    document.querySelector(".board-content").innerText = response.data.data.postContent;
  })
}


async function getComment() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}/comments?page=1&size=10&sort=id&sortStandard=1&desc=true`;

  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      let template = document.getElementById("comment-template").innerText;
      let targetHtml = document.querySelector(".comment-each-container");
      makeTemplate(response.data.data.data, template, targetHtml);
    }
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
    console.log(response);
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
