let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPosts(1,"");
});




async function getPosts(page, keyword) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts?page=${page}&size=10&keyword=${keyword}&desc=true`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    let data = response.data.data.dtoList;
    let targetHtml = document.querySelector(".content-box");
    let template = document.getElementById("post-list").innerText;
    let resultHtml = makeTemplate(data, template);
    targetHtml.innerHTML = resultHtml;
    printPages(response.data.data);
  }).catch(e => {
    validateToken(e.response.data.errorMessages[0]);
  });
}
function validateToken(errorMessage) {
  if (errorMessage === "유효한 토큰이 아닙니다. 혹은 url을 다시 확인하세요.") {
    localStorage.removeItem("authorization");
  }
}

document.querySelector(".write-btn-a").addEventListener("click", function () {
  let clubId = parseUrl("clubId");
  let url = `/postWrite.html?clubId=${clubId}`;
  window.location.href = url;
});

function printPages(data) {
  const postPaging = document.querySelector(".number");
  let pageStr = '';
  
  for(let i = data.start; i<= data.end; i++) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${i}>${i}</a></li>`
  }
  postPaging.innerHTML = pageStr;
}

document.querySelector(".number").addEventListener("click", function(evt) {
  getPosts(evt.target.dataset.page);
});

document.querySelector(".search").addEventListener("click", function() {
  let keyword = document.querySelector('input[type="search"]').value;
  getPosts(1, keyword);
});
document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})