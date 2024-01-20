let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");
document.addEventListener("DOMContentLoaded", function() {
  getPosts();
});


async function getPosts() {
  let id = parseUrl();
  let url = `http://localhost:8080/api/clubs/${id}/posts`;
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

function parseUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get('id');
  console.log(id);
  return id;
}

function makeTemplate(data, targetHtml) {
  let template = document.getElementById("post-list").innerText;
  let bindTemplate = Handlebars.compile(template);  
  let innerHtml = data.reduce(function(prve, next) {
    return prve + bindTemplate(next);
  }, "");
  targetHtml.innerHTML = innerHtml;
}
