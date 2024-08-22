document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPost();
});

const changes = {};

async function getPost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");

  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    console.log(response)
    const title = document.querySelector(".title-input").value = response.data.data.postTitle;
    const content = document.querySelector(".content-input").value = response.data.data.postContent;
    changes.postTitle = title;
    changes.postContent = content;
  }).catch(e => {
    validateToken(e);
  });
}

function validatePost(title, content) {
  if (title !== undefined && typeof title === 'string') {
    if (title.length < 3 || title.length > 50) {
      alert("제목은 3자에서 50자 사이로 작성해주세요.");
      return false;
    }
  }
  if (content !== undefined && typeof content === 'string') {
    if (content.length > 500) {
      alert("본문은 500자 이내로 작성해주세요.");
      return false;
    }
  }

  return true;
}

document.querySelector(".modify-btn").addEventListener("click", function () {
  let currentTitle = document.querySelector(".title-input").value;
  let currentContent = document.querySelector(".content-input").value;
  let data = {};
  if (changes['postTitle'] !== currentTitle) {
    data['postTitle'] = currentTitle;
  }
  if (changes['postContent'] !== currentContent) {
    data['postContent'] = currentContent;
  }


  if (Object.keys(data).length === 0) {
    alert("변경된 내용이 없습니다");
    return;
  }

  if(!validatePost(data.postTitle, data.postContent)) {
    return false;
  }
  
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `/postRead.html?clubId=${clubId}&postId=${postId}`;
  modifyRequest(data).then(response => {
    if (response.status == 200) {
      alert("수정이 완료되었습니다!");
      window.location.href = url;
    }
  }).catch(e => {
    alert(e.response.data.errorMessages);
    window.location.href = url;
  })
}
);

async function modifyRequest(data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  })
  return response;
}
document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});

document.querySelector(".delete-btn").addEventListener("click", function () {
  let userResponse = confirm("게시글을 삭제하시겠습니까?");
  if (userResponse) {
    let response = deleteRequests();
    response.then(response => {
      if (response.status == 200) {
        alert("삭제가 완료되었습니다.")
        window.history.go(-2);
      }
    }).catch(e => {
      alert("권한이 없습니다.")
      window.history.go(-2);
    });

  }
});

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
async function logout() {
  let url = `http://localhost:8080/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}

document.querySelector(".logout").addEventListener("click", function () {
  logout().then(response => {
    if (response.status == 200) {
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {

  });
});
