let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function() {
  checkLogin();
  getPosts();
});


async function getPosts() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts`;
  let response = await axios.get(url, {
  headers: {
    "authorization" : localStorage.getItem("authorization")
  }
}).then(response => {
  let data = response.data.data.data;
  let targetHtml = document.querySelector(".content-box");
  makeTemplate(data, targetHtml);
});
}


function makeTemplate(data, targetHtml) {
  let template = document.getElementById("post-list").innerText;
  let bindTemplate = Handlebars.compile(template);  
  let innerHtml = data.reduce(function(prve, next) {
    return prve + bindTemplate(next);
  }, "");
  targetHtml.innerHTML = innerHtml;
}

document.querySelector(".write-btn-a").addEventListener("click", function() {
  let clubId = parseUrl("clubId");
  let url = `/postWrite.html?clubId=${clubId}`;
  window.location.href = url;
});