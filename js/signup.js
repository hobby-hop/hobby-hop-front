
document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  let email = document.getElementById("email");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirm-password");

  let isValid = signupValidator(email, username, password, confirmPassword);
  if (isValid) {
    let data  = {
      email : email.value,
      username : username.value,
      password : password.value,
      confirmPassword : confirmPassword.value
    }
    signup(data);
  }
});

async function signup(data) {
  let url = "https://hobbyback.store/api/users/signup";
  const response = await axios.post(url, data).then(response => {
    if (response.status == 200) {
      window.location.href = "/login.html";
    }
  }).catch(e => {
    alert(e.response.data.errorMessages);
  });
  return response;
}

function signupValidator(email, username, password, confirmPassword, info) {
  let validationMsg = document.querySelector(".validation-msg");
  const BASE_MSG = "유효하지 않습니다.";
  const EMAIL_REGEX = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const USERNAME_REGEX = /^[a-zA-Z0-9가-힣]{1,12}$/;
  const PASSWORD_REGEX = /^[a-z0-9]{8,15}$/;
  const INFO_REGEX = /^[a-zA-Z0-9가-힣]{3,50}$/;

  if (!EMAIL_REGEX.test(email.value)) {
    email.style.border = "2px solid red";
    email.focus();
    validationMsg.innerHTML = `<span class="msg">이메일</span>이 ${BASE_MSG}`;
    validationMsg.style.display = "block";
    return false;
  } else {
    email.style.border = "1px solid #ddd";
  }

  if (!USERNAME_REGEX.test(username.value)) {
    username.style.border = "2px solid red";
    username.focus();
    validationMsg.innerHTML = `<span class="msg">이름(닉네임)은 영어,숫자, 한글로 구성된 최소 1자 최대 12자입니다.</span>`;
    validationMsg.style.display = "block";
    return false;
  } else {
    username.style.border = "1px solid #ddd";
  }

  if (!PASSWORD_REGEX.test(password.value)) {
    password.style.border = "2px solid red";
    password.focus();
    validationMsg.innerHTML = `<span class="msg">비밀번호</span>가 ${BASE_MSG}`;
    validationMsg.style.display = "block";
    return false;
  } else {
    password.style.border = "1px solid #ddd";
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.style.border = "2px solid red";
    confirmPassword.focus();
    validationMsg.innerHTML = `<span class="msg">비밀번호가 일치하지 않습니다</span>`;
    validationMsg.style.display = "block";
    return false;
  } else {
    confirmPassword.style.border = "1px solid #ddd";
  }

  // if(!(info.value.length >= 3 && info.value.length <= 50)) {
  //   info.style.border = "2px solid red";
  //   info.focus();
  //   validationMsg.innerHTML = `<span class="msg">자기소개를 3~50자로 입력해주세요</span>`;
  //   validationMsg.style.display = "block";
  //   return false;
  // } else {
  //   info.style.border = "1px solid #ddd";
  // }

  validationMsg.innerHTML = "";
  validationMsg.style.display = "block";
  return true;
}