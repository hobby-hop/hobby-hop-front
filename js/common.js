function checkLogin () {
  localStorage.getItem("authorization")
  if(!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
}