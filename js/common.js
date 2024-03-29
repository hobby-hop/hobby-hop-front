function checkLogin() {
  localStorage.getItem("authorization")
  if (!localStorage.getItem("authorization")) {
    window.location.href = "/login.html";
  }
}

function customDateFormat(timeStamp) {
  const date = new Date(timeStamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function validateToken(errorMessage) {
  if (errorMessage === "유효한 토큰이 아닙니다. 혹은 url을 다시 확인하세요.") {
    alert("로그인이 필요합니다.");
    localStorage.removeItem("authorization");
    window.location.href = "/login.html";
  }
  if(errorMessage === "JWT 토큰이 잘못되었습니다") {
    alert("로그인이 필요합니다.");
    localStorage.removeItem("authorization");
    window.location.href = "/login.html";
  }
}

function parseUrl(param) {
  let params = new URLSearchParams(window.location.search);
  let id = params.get(param);
  return id;
}
document.addEventListener("click", function(evt) {
  const menu = document.querySelector(".my-info");
  const userAccordion = document.querySelector(".my-info-element .accordion");
  if(evt.target !== menu) {
    userAccordion.classList.add("close");
  }
});


