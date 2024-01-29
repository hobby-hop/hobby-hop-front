let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPosts(1, 10, "");
});

//?page=${page}&size=10&keyword=${keyword}&desc=true

async function getPosts(page, size, keyword) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    },
    params : {
      page : page,
      size : size,
      keyword : keyword
    }
  }).then(response => {
    let data = response.data.data.dtoList;
    let targetHtml = document.querySelector(".content-box");
    targetHtml.innerHTML = "";
    let template = document.getElementById("post-list").innerText;
    // if(response.data.data.dtoList === null) {
    //   return false;
    // }
    let resultHtml = makeTemplate(data, template);
    targetHtml.innerHTML = resultHtml;
    printPages(response.data.data);
  }).catch(e => {
    console.log(e);
    validateToken(e.response.data.errorMessages[0]);
  });
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
  getPosts(evt.target.dataset.page, 10);
});

document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});
document.querySelector(".search").addEventListener("click", function() {
  let keyword = document.querySelector(".keyword").value;
  getPosts(1, 10, keyword);
});
document.querySelector('.keyword').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    let keyword = document.querySelector(".keyword").value;
    getPosts(1, 10, keyword);
  }
});