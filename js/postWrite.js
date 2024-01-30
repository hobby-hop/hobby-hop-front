document.querySelector(".submit-btn").addEventListener("click", function () {
  let title = document.querySelector(".title");
  let content = document.querySelector(".content");

  if (!validatePost(title, content)) {
    return;
  }

  let data = {
    postTitle: title.value,
    postContent: content.value
  }
  const files = document.getElementById("file-upload").files;

  const formData = new FormData();
  formData.append("file", files[0]);

  sendPost(data).then(response => {
    if (response.status == 200) {
      const postId = response.data.data.postId;
      alert("게시글 작성이 완료되었습니다.");
      if (files.length !== 0) {
        sendFile(formData, postId).then(response => {
          if (response.status == 200) {
            alert("게시글 작성이 완료되었습니다.");
          }
        })
      }
      window.history.back();
    }
  }).catch(e => {
    if (e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
      alert("자신이 가입된 모임에만 게시글을 작성할 수 있습니다.");
      window.history.back();
    }
  });
});

async function sendPost(data) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts`;
  let response = axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}

async function sendFile(formData, postId) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.post(url, formData, {
    headers: {
      "authorization": localStorage.getItem("authorization"),
      "Content-Type": "multipart/form-data"
    }
  });

  return response;

}

function validatePost(title, content) {

  if (title === "") {
    return false;
  }
  if (content === "") {
    return false;
  }

  return true;
}
document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});

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