document.addEventListener("DOMContentLoaded", function () {
  getClub();
});

const changes = {};

async function getClub() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      const title = document.getElementById("club-title").value = response.data.data.title;
      const content = document.querySelector(".description").value = response.data.data.content;
      const categoryId = document.getElementById("category-select").value = response.data.data.categoryId;
      changes.title = title;
      changes.content = content;
      changes.categoryId = categoryId;
    }
  }).catch(e => {
    validateToken(e);
  })
}

document.querySelector(".my-info").addEventListener("click", function () {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})


// document.querySelector(".my-profile").addEventListener("click", function () {
//   let clubId = parseUrl("clubId");
//   window.location.href = `/profile.html?clubId=${clubId}`;
// });


document.querySelector(".logout").addEventListener("click", function () {
  logout().then(response => {
    if (response.status == 200) {
      alert("정상적으로 로그아웃 되었습니다.");
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {
    validateToken(e);
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

document.querySelector(".modify-btn").addEventListener("click", function () {
  let data = {};
  let title = document.getElementById("club-title").value;
  let content = document.querySelector(".description").value;
  let categoryId = document.getElementById("category-select").value;
  if (changes["title"] !== title) {
    data.title = title;
  }
  if (changes["content"] !== content) {
    data.content = content;
  }
  if (changes["categoryId"] !== Number(categoryId)) {
    data.categoryId = Number(categoryId);
  }
  if (Object.keys(data).length === 0) {
    alert("변경된 내용이 없습니다");
  } else {
    let response = modifyRequest(data);
    response.then(res => {
      if (res.status == 200) {
        alert("수정이 완료되었습니다.");
        let clubId = parseUrl("clubId");
        let redirectUrl = `/clubRead.html?clubId=${clubId}`;
        window.location.href = redirectUrl;
    }}).catch(e => {
      alert(e.response.data.errorMessages[0]);
      let clubId = parseUrl("clubId");
        let redirectUrl = `/clubRead.html?clubId=${clubId}`;
        window.location.href = redirectUrl;
    });
  }

});


async function modifyRequest(data) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}`;
  let response = axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}

document.querySelector(".delete-btn").addEventListener("click", function () {
  let userResponse = confirm("정말 모임을 삭제하시겠습니까?");
  if (userResponse) {
    deleteRequest().then(response => {
      if (response.status == 200) {
        alert("모임이 삭제되었습니다.")
        window.location.href = "/index.html";
      }
    }).catch(e => {
      validateToken(e);
      if (e.response.status === 403) {
        alert("삭제할 권한이 없습니다.");
        window.history.back();
      } else if (e.response.status === 404) {
        alert("모임에 가입되어있지 않습니다.!");
        window.history.back();
      }
    });
  } else {
    return;
  }
});

async function deleteRequest() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}`;
  let response = await axios.delete(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  })

  return response;
}

async function checkAdmin() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/checkPermission`;

  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(!response.data.data) {
      alert("모임장만 접근 가능한 페이지입니다");
      Window.history.back();
    }
  });
}
