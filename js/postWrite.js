document.querySelector(".submit-btn").addEventListener("click", function () {
  let title = document.querySelector(".title");
  let content = document.querySelector(".content");

  if (!validatePost(title, content)) {
    return;
  }

  let data = {
    title: title.value,
    content: content.value
  }
  
  const files = document.getElementById("file-upload").files;
  if(files.length !== 0) {
    if(!validateFile(files[0])) {
      document.getElementById("file-upload").value = "";
      return false;
    }
  }
  const formData = new FormData();
  formData.append("file", files[0]);
  let clubId = parseUrl("clubId");
  let url = `/postList.html?clubId=${clubId}`;

  sendPost(data).then(response => {
    if (response.status == 200) {
      const postId = response.data.data.postId;
      if (files.length !== 0) {
        sendFile(formData, postId).then(response => {
          console.log("이미지 업로드 성공");
        }).catch(e => {
          alert(e);
        });
      }
    }
  }).catch(e => {
    if (e.response.data.errorMessages[0] === "해당 멤버를 찾을 수 없습니다.") {
      alert("자신이 가입된 모임에만 게시글을 작성할 수 있습니다.");
    }
    alert(e);
  });
  alert("게시글 작성이 완료되었습니다.");
  window.location.href = url;
});

async function sendPost(data) {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts`;
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

function validateFile(file) {
  const MAX_SIZE = 2 * 1024 * 1024;
  if(file.size > MAX_SIZE) {
    alert("이미지는 최대 2MB까지 업로드가 가능합니다.");
    return false;
  }
  return true;
}

function validatePost(title, content) {
  if (title.value === "") {
    alert("제목을 입력해주세요.");
    return false;
  }
  if(title.value.length > 50 || title.value.length < 3) {
    alert("제목을 3~50자로 입력해주세요.");
    return false;
  }
  if (content.value === "") {
    alert("내용을 입력해주세요.");
    return false;
  }
  if(content.value.length > 500) {
    alert("내용은 500자까지 입력이 가능합니다.");
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