let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

axios.get("http://localhost:8080/api/clubs", {
  headers: {
    "authorization" : localStorage.getItem("authorization")
  }
}).then(response => {
  
  console.log(response);
});

