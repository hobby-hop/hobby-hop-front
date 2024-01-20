let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");


axios.get("http://localhost:8080/api/clubs/1/posts", {
  headers: {
    "authorization" : localStorage.getItem("authorization")
  }
}).then(response => {
  let data = response.data.data.data;
  let targetHtml = document.querySelector(".content-box");
  makeTemplate(data, targetHtml);
});


function makeTemplate(data, targetHtml) {
  console.log(data);
  let template = document.getElementById("post-list").innerText;
  let bindTemplate = Handlebars.compile(template);  
  
  let innerHtml = data.reduce(function(prve, next) {
    return prve + bindTemplate(next);
  }, "");
  console.log(innerHtml);
  targetHtml.innerHTML = innerHtml;

}