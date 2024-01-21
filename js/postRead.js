checkLogin();
getPost();

let heartEl = document.getElementById("heart");
heartEl.addEventListener("click", function () {
  console.log("!!!")
  // let likeUrl = `http://localhost:8080/api/clubs/{posts/${postId}/likes`;
  if (heartEl.classList.contains("active")) {
    // axios.delete(likeUrl);
  } else {
    // axios.post(likeUrl);
  }
  heartEl.classList.toggle("active");
});


async function getPost() {
  let postId = parseUrl();
  let url = `http://localhost:8080/api/clubs/1/posts/${postId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization" : localStorage.getItem("authorization")
    }
  }).then(response => {
    console.log(response.data.data.postTitle);
    document.querySelector(".post-title").innerText = response.data.data.postTitle;
    document.querySelector(".post-content").innerText = response.data.data.postContent;
  })
}

function checkLogin () {
  localStorage.getItem("authorization")
  if(!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
}

function parseUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get('postId');
  console.log(id);
  return id;
}