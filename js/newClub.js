document.addEventListener("DOMContentLoaded", function() {
  checkLogin();
});

document.querySelector(".submit-btn").addEventListener("click", function () {
  if (!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const category = document.getElementById("category-select");

  let data = {
    title: title.value,
    content: content.value,
    categoryId: category.value
  }

  if (!validator(data.title, data.content, data.categoryId)) {
    alert("정보를 정확히 입력해주세요!");
  } else {
    sendMakeClub(data);
  }
});

async function sendMakeClub(data) {
  const url = "https://hobbyback.store/api/clubs";
  const response = await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      window.location.href = '/clubList.html';
    }
  });
  return response;
}

function validator(title, content, category) {

  if (title === "") {
    return false;
  }
  if (content === "") {
    return false;
  }
  if (category === "") {
    return false;
  }
  return true;
}

document.querySelector(".my-info").addEventListener("click", function() {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})


document.querySelector(".my-profile").addEventListener("click", function() {
  let clubId = parseUrl("clubId");
  window.location.href = `/profile.html?clubId=${clubId}`;
});


document.querySelector(".logout").addEventListener("click", function() {
  logout().then(response => {
    if(response.status == 200) {
      alert("정상적으로 로그아웃 되었습니다.");
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