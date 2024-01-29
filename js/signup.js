
document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  let email = document.getElementById("email");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirm-password");

  let isValid = signupValidator(email, username, password, confirmPassword);
  if (isValid) {
    // const response = signup(data);
  }
});

async function signup(data) {
  let url = "https://hobbyback.store/api/users/signup";
  const response = await axios.post(url, data).then(response => {
    if (response.status == 200) {
      window.location.href = "/login.html";
    }
  }).catch(e => {
    //여기서 오류 메세지 받아와서 출력하기
    alert("오류가 발생했습니다");
    // window.location.href = "/login.html";
  });
  return response;
}

function signupValidator(email, username, password, confirmPassword) {
  let validationMsg = document.querySelector(".validation-msg");
  const BASE_MSG = "유효하지 않습니다.";
  const EMAIL_REGEX = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const USERNAME_REGEX = /^[a-z0-9]{1,12}$/;
  const PASSWORD_REGEX = /^[a-z0-9]{8,15}$/;

  if (!EMAIL_REGEX.test(email.value)) {
    email.style.border = "2px solid red";
    email.focus();
    validationMsg.innerHTML = `<span class="msg">이메일이</span> ${BASE_MSG}`;
    validationMsg.style.display = "block";
    return false;
  } else {
    email.style.border = "1px solid #ddd";
  }

  if (!USERNAME_REGEX.test(username.value)) {
    username.style.border = "2px solid red";
    username.focus();
    validationMsg.innerHTML = `<span class="msg">닉네임은 최소 1자 최대 12자입니다.</span>`;
    validationMsg.style.display = "block";
    return false;
  } else {
    username.style.border = "1px solid #ddd";
  }

  if (!PASSWORD_REGEX.test(password.value)) {
    password.style.border = "2px solid red";
    password.focus();
    validationMsg.innerHTML = `<span class="msg">비밀번호가</span> ${BASE_MSG}`;
    validationMsg.style.display = "block";
    return false;
  } else {
    password.style.border = "1px solid #ddd";
  }

  if (password !== confirmPassword) {
    confirmPassword.style.border = "2px solid red";
    confirmPassword.focus();
    validationMsg.innerHTML = `<span class="msg">비밀번호가 일치하지 않습니다</span>`;
    validationMsg.style.display = "block";
    return false;
  } else {
    confirmPassword.style.border = "1px solid #ddd";
  }
  validationMsg.innerHTML = "";
  validationMsg.style.display = "block";
  return true;
}