
document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  let email = document.getElementById("email");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirm-password");

  let data = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  }

  const response = signup(data);

});
// TODO 회원가입에 실패했을 경우 예외처리 구현 필요.
// 일단 회원가입 처리는 잘 됨.

/*
  username": "T",
  "email": "string",
  "password": "534IDT53",
  "confirmPassword": "string"
*/

async function signup(data) {
  let url = "https://hobbyback.store/api/users/signup";
  const response = await axios.post(url, data).then(response => {
      if(response.status == 200) {
        window.location.href = "/iogin.html";
      }
  })
  return response;

}