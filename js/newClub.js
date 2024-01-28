document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
});

document.querySelector(".submit-btn").addEventListener("click", function () {
  if (!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const category = document.getElementById("category-select");


  if (!validateClub(title, content, category)) {
    alert("정보를 정확히 입력해주세요!");
  } else {
    let data = {
      title: title.value,
      content: content.value,
      categoryId: category.value
    }

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
      window.location.href = '/index.html';
    }
  }).catch(e => {
    validateToken(e);
  });
  return response;
}

function validateClub(title, content, category) {

  if (title.value === "") {
    title.style.border = "2px solid red";
    title.focus();
    return false;
  } else {
    title.style.border = "none";
  }
  if (content.value === "") {
    content.style.border = "2px solid red";
    content.focus();
    return false;
  } else {
    content.style.border = "none";
  }
  if (category.value === "") {
    category.style.border = "2px solid red";
    return false;
  } else {
    category.style.border = "none";
  }
  return true;
}

document.querySelector(".my-info").addEventListener("click", function () {
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