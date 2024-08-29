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
    return false;
  } 
  let data = {
    title: title.value,
    content: content.value,
    categoryId: category.value
  }

  sendMakeClub(data);
});


async function sendMakeClub(data) {
  const url = "http://localhost:8080/api/clubs";
  const response = await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      window.location.href = '/index.html';
    }
  }).catch(e => {
    // validateToken(e);
  });
  return response;
}

function validateClub(title, content, category) {
  if (title.value === "" ) {
    title.style.border = "2px solid red";
    title.focus();
    alert("모임명을 입력해주세요.");
    return false;
  } else {
    title.style.border = "none";
  }
  if(title.value.length < 3 || title.value.length > 30) {
    title.style.border = "2px solid red";
    title.focus();
    alert("모임명은 최소 3자에서 최대 30자 까지입니다.");
    return false;
  } else {
    title.style.border = "none";
  }
  if (content.value === "") {
    content.style.border = "2px solid red";
    content.focus();
    alert("모임 소개를 입력해주세요.")
    return false;
  } else {
    content.style.border = "none";
  }
  if(content.value.length < 3 || content.value.length > 255) {
    content.style.border = "2px solid red";
    content.focus();
    alert("모임 소개는 최소 3자에서 255자까지입니다.");
    return false;
  } else {
    content.style.border = "none";
  }
  
  if (category.value === "") {
    category.style.border = "2px solid red";
    alert("카테고리를 선택해주세요.");
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

