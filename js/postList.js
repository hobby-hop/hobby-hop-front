let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getPosts(1);
});


async function getPosts(page) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts?page=${page}&size=10`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    let data = response.data.data.dtoList;
    let targetHtml = document.querySelector(".content-box");
    makeTemplate(data, targetHtml);
    printPages(response.data.data);
  });
}


function makeTemplate(data, targetHtml) {
  let template = document.getElementById("post-list").innerText;
  let bindTemplate = Handlebars.compile(template);
  let innerHtml = data.reduce(function (prve, next) {
    return prve + bindTemplate(next);
  }, "");
  targetHtml.innerHTML = innerHtml;
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