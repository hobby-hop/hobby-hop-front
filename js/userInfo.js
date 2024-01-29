document.addEventListener("DOMContentLoaded", function() {
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
    if(response.status == 200) {
      document.querySelector(".username").innerText = response.data.data.username;
      document.querySelector(".email").innerText = response.data.data.email;
      document.querySelector("content");
      changes.username = response.data.data.username;
      changes.email = response.data.data.email;
      changes.content = response.data.data.content;
    }
  }).catch(e => {
    console.log(e);
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
  
  let data = {

  }
  let response = sendModifyRequest(data);
  response.then(response => {
    console.log(response);
  });
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

function validateInfo() {

}