document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getMyInfo();
});

let changes = {};

async function getMyInfo() {
  let url = `http://localhost:8080/api/users/profiles/my`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }
  ).then(response => {
    if (response.status == 200) {
      document.querySelector(".username").innerText = response.data.data.username;
      document.querySelector(".email").innerText = response.data.data.email;
      document.querySelector(".info").innerText = response.data.data.info;
      changes.info = response.data.data.info;
    }
  }).catch(e => {
    validateToken(e.response.data.errorMessages[0]);
  });

  return response;
}
document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})

const modifyBtn = document.querySelector(".modify-btn");
modifyBtn.addEventListener("click", enableEditMode);

const saveBtn = document.querySelector('.save-btn');
saveBtn.addEventListener('click', saveUserInfo);

function enableEditMode() {
  const content = document.querySelector('.info');
  content.contentEditable = 'true';
  content.style.border = "1px solid #333";
  content.focus();
  document.querySelector(".modify-password").style.display = 'block';
  document.querySelector(".modify-btn").style.display = 'none';
  document.querySelector('.save-btn').style.display = 'block';

}

function saveUserInfo() {
  document.querySelector('.info').contentEditable = 'false';
  document.querySelector('.save-btn').style.display = 'none';
  document.querySelector(".modify-btn").style.display = 'block';
  document.querySelector(".modify-password").style.display = "none";
  document.querySelector('.info').style.border = "none";


  let currentInfo = document.querySelector(".info").innerText;
  let currentPassword = document.querySelector(".current-password").value;

  let data = validateInfo(currentInfo, currentPassword);

  if (Object.keys(data).length === 0) {
    alert("변경된 내용이 없습니다");
    getMyInfo();
    return;
  }

  let response = sendModifyRequest(data);

  response.then(response => {
    if (response.status == 200) {
      alert("정보가 성공적으로 변경되었습니다.");
      localStorage.setItem("authorization", response.headers['authorization']);
      getMyInfo();
    }
  }).catch(e => {
    alert(e.response.data.errorMessages[0]);
    document.querySelector(".info").innerText  = changes.info;
    document.querySelector(".current-password").value = "";
  })
}

async function sendModifyRequest(data) {
  let url = `http://localhost:8080/api/users/profiles`
  let response = await axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}

function validateInfo(currentInfo, currentPassword) {
  let data = {};
  if (changes.info !== currentInfo) {
    data.info = currentInfo;
  }
  if (currentPassword === "") {
    alert("정보를 수정하시려면 현재 비밀번호를 입력해주세요.");
    return false;
  } else {
    data.oldPassword = currentPassword;
  }

  return data;
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
    alert(e.response.data.errorMessages[0]);
  });
});

document.querySelector(".withdraw").addEventListener("click", onClickWithdrawModal);

function onClickWithdrawModal() {
  document.getElementById('withdraw-modal').style.display = 'block';
  document.getElementById("overlay").style.display = 'block';
}

document.querySelector(".close-btn").addEventListener("click", function () {
  document.getElementById('withdraw-modal').style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});
document.querySelector(".withdraw-modal .close-btn").addEventListener("click", function () {
  document.getElementById('withdraw-modal').style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});



async function withdraw(currentPassword) {
  let data = {password : currentPassword};
  let url = `http://localhost:8080/api/users/withdrawal`;
  let response = await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
};

document.querySelector(".change-password").addEventListener("click", onClickModal);

function onClickModal() {
  document.getElementById('modal').style.display = 'block';
  document.getElementById("overlay").style.display = 'block';
}

document.querySelector(".close-btn").addEventListener("click", function () {
  document.getElementById('modal').style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});


document.getElementById("overlay").addEventListener("click", function() {
  document.getElementById("modal").style.display = 'none';
  document.getElementById("withdraw-modal").style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});

document.querySelector(".agree-btn").addEventListener("click", function() {
  let currentPassword = document.querySelector(".current-password-w");
  if(currentPassword.value === "" ){
    alert("패스워드를 입력해주세요");
    currentPassword.focus();
    return false;
  }
  
  
  let response = withdraw(currentPassword.value);
  response.then(response => {
    if(response.status === 200) {
      console.log(response);
      alert("탈퇴가 성공적으로 완료되었습니다.");

      localStorage.removeItem("authorization");
      window.location.href = "/login.html";
    }
  }).catch(e => {
    alert(e.response.data.errorMessages[0]);
  });
});


document.querySelector(".change-btn").addEventListener("click", function() {
  let currentPassword = document.querySelector(".current-password-c");
  let newPassword = document.querySelector(".new-password");
  let confirmPassword = document.querySelector(".confirm-password");

  if(!validatePassword(currentPassword, newPassword, confirmPassword)) {
    return false;
  }
  let data = {
    oldPassword : currentPassword.value,
    newPassword : newPassword.value,
    confirmPassword : confirmPassword.value
  };

  let response = sendModifyRequest(data);
  response.then(response => {
    if (response.status == 200) {
      alert("정보가 성공적으로 변경되었습니다.");
      localStorage.removeItem("authorization", response.headers['authorization']);
      window.location.href = "/login.html";
    }
  }).catch(e => {
    alert(e.response.data.errorMessages[0]);
  });
});


function validatePassword(currentPassword, newPassword, confirmPassword) {
  const PASSWORD_REGEX = /^[a-z0-9]{8,15}$/;
  if(currentPassword.value === "") {
    alert("현재 패스워드를 입력해주세요.");
    currentPassword.focus();
    return false;
  }
  if(newPassword.value === "") {
    alert("변경할 패스워드를 입력해주세요.");
    newPassword.focus();
    return false;
  }
  if(confirmPassword.value === "") {
    confirmPassword.focus();
    return false;
  }
  if(!PASSWORD_REGEX.test(newPassword.value)) {
    alert("패스워드를 형식에 맞게 입력해주세요.");
    newPassword.focus();
    return false;
  }
  if(currentPassword.value === newPassword.value) {
    alert("전과 같은 패스워드는 사용하실 수 없습니다.");
    return false;
  }
  if(newPassword.value !== confirmPassword.value) {
    alert("새로 사용할 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
    confirmPassword.value = "";
    return false;
  }

  return true;
}

