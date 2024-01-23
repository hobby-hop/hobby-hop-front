
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

async function signup(data) {
  let url = "https://hobbyback.store/api/users/signup";
  const response = await axios.post(url, data).then(response => {
      if(response.status == 200) {
        window.location.href = "/login.html";
      }
  }).catch(e => {
    alert("오류가 발생했습니다");
    window.location.href = "/login.html";
  });
  return response;

}