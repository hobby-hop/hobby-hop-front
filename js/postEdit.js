document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPost();
});

const changes = {};

async function getPost() {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");

  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    const title = document.querySelector(".title-input").value = response.data.data.postTitle;
    const content = document.querySelector(".content-input").value = response.data.data.postContent;
    changes.postTitle = title;
    changes.postContent = content;
  }).catch(e => {
    validateToken(e);
  });
}

function validator(data) {
  if (data.content === "") {
    return false;
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
  if(changes['postContent'] !== currentContent ){
    data['postContent'] = currentContent;
  }
  
  if(Object.keys(data).length === 0) {
    alert("변경된 내용이 없습니다");
  } else {
    modifyRequest(data).then(response => {
      if(response.status == 200) {
        alert("수정이 완료되었습니다!");
        window.history.back();
      }
    }).catch(e => {
      validateToken(e.response.data.errorMessages[0]);
      alert("요청을 처리하지 못했습니다.");
      window.history.back();
    })
  }
});

async function modifyRequest(data) {
  let clubId = parseUrl("clubId");
  let postId = parseUrl("postId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}`;
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

document.querySelector(".delete-btn").addEventListener("click", function() {
  let userResponse = confirm("게시글을 삭제하시겠습니까?");
  if(userResponse) {
    let response = deleteRequests();
    response.then(response => {
      if(response.status == 200) {
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
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts/${postId}`;
  let response = await axios.delete(url, {
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

async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}