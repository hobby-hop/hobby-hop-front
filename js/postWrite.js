document.querySelector(".submit-btn").addEventListener("click", function () {
  let title = document.querySelector(".title");
  let content = document.querySelector(".content");

  let data = {
    postTitle: title.value,
    postContent: content.value
  }
  const files = document.getElementById("file-upload").files;

  const formData = new FormData();
  formData.append("file", files[0]);

  if (validator(data)) {
    sendPost(data).then(response => {
      if (response.status == 200) {
        const postId = response.data.data.postId;
        alert("게시글 작성이 완료되었습니다.");
        window.location.href = "/index.html";
        if (files.length !== 0) {
          sendFile(formData, postId).then(response => {
            if (response.status == 200) {
              alert("게시글 작성이 완료되었습니다.");
              window.location.href = "index.html";
            }
          })
        }
      }
    }).catch(() => {
    });
  }
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


function validator(data) {

  if (data.title === "") {
    return false;
  }
  if (data.content === "") {
    return false;
  }

  return true;
}