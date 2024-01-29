function checkLogin() {
  localStorage.getItem("authorization")
  if (!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
}

function customDateFormat(timeStamp) {
  const date = new Date(timeStamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1을 해주고, 두 자리로 맞춰줍니다.
  const day = String(date.getDate()).padStart(2, '0'); // 두 자리로 맞춰줍니다.

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function validateToken(errorMessage) {
  if (errorMessage === "유효한 토큰이 아닙니다. 혹은 url을 다시 확인하세요.") {
    // localStorage.removeItem("authorization");
    // window.location.href = "/index.html";
  }
}

function parseUrl(param) {
  let params = new URLSearchParams(window.location.search);
  let id = params.get(param);
  return id;
}



