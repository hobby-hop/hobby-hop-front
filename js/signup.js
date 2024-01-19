
document.querySelector(".submit-btn").addEventListener("click", function () {
  let email = document.getElementById("email");
  let id = document.getElementById("id");
  let password = document.getElementById("pw");
  let confirmPassword = document.getElementById("confirm-pw");

  let data = {
    username: id.value,
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
  let url = "http://localhost:8080/api/users/signup";
  const response = await axios.post(url, data);
  console.log(response);
  return response;

}