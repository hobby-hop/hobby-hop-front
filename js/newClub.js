checkLogin();

document.querySelector(".submit-btn").addEventListener("click", function () {
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const category = document.getElementById("category-select");

  let data = {
    title: title.value,
    content: content.value,
    categoryId: category.value
  }
  console.log(data);
  validator(data.title, data.content, data.categoryId)
  sendMakeClub(data);
});

async function sendMakeClub(data) {
  const url = "http://localhost:8080/api/clubs";
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

function validator(title, content, category) {

  if(title === "") {
    alert("모임 명을 입력해주세요");
  }
  if(content === "") {
    alert("모임 소개를 입력해주세요")
  }  
  if(category === "") {
    alert("카테고리를 선택해주세요");
  }
}

