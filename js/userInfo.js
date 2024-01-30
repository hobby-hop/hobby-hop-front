document.addEventListener("DOMContentLoaded", function () {
  getMyInfo();
});

const changes = {};

async function getMyInfo() {
  let url = `https://hobbyback.store/api/users/profile`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }
  ).then(response => {
    if (response.status == 200) {
      document.querySelector(".username").innerText = response.data.data.username;
      document.querySelector(".email").innerText = response.data.data.email;
      document.querySelector(".content").innerText = response.data.data.info;
      changes.username = response.data.data.username;
      changes.email = response.data.data.email;
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
  const content = document.querySelector('.content');
  content.contentEditable = 'true';
  content.focus();
  document.querySelector(".modify-password").style.display = 'block';
  document.querySelector(".modify-btn").style.display = 'none';
  document.querySelector('.save-btn').style.display = 'block';

}

function saveUserInfo() {
  document.querySelector('.content').contentEditable = 'false';
  document.querySelector('.save-btn').style.display = 'none';
  document.querySelector(".modify-btn").style.display = 'block';
  document.querySelector(".modify-password").style.display = "none";

  let currentUsername = document.querySelector(".username").value;
  let currentEmail = document.querySelector(".email").value;
  let currentInfo = document.querySelector("content").value;
  let currentPassword = document.querySelector(".currnet-password").value;
  let newPassword = document.querySelector(".new-password").value;
  let confirmPassword = document.querySelector(".confirm-password").value;

  let data = validateInfo(currentInfo, currentPassword, newPassword, confirmPassword);

  let response = sendModifyRequest(data);

  response.then(response => {
    if(response.status == 200) {
      alert("정보가 성공적으로 변경되었습니다.");
      getMyInfo();
    }
  }).catch(e => {
    validateToken(e.response.data.errorMessages[0]);
    alert(e.response.data.errorMessages[0]);
  })
}

async function sendModifyRequest(data) {
  let url = `https://hobbyback.store/api/users/update`
  let response = await axios.patch(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}

function validateInfo(currentInfo, currentPassword, newPassword, confirmPassword) {
  if(data.info !== currentInfo) {
    data.info = currentInfo;
  }
  if(currentPassword !== "") {
    return false;
  }
  data.oldPassword = currentPassword;
  data.newPassword = newPassword;
  data.confirmPassword = confirmPassword;
  return data;
}


async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
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
    validateToken(e.response.data.errorMessages[0]);
  });
});