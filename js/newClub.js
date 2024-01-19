document.querySelector(".submit-btn").addEventListener("click", function () {
  console.log("clicked");
});

const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
let url = "http://localhost:8080/api/clubs";

document.querySelector(".submit-btn").addEventListener("click", function () {
  let data = {
    title: title.value,
    description: description.value,
    categoryId: category.value
  }
  let response = makeClub(data);
  if (response.status == 200) {
    console.log("성공!!")
  }
});

async function makeClub(data) {
  const response = await axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      window.location.href = '/clubList.html';
    }
  });
  return response;
}