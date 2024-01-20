document.querySelector(".submit-btn").addEventListener("click", function () {
  const title = document.getElementById("title");
  const content = document.getElementById("content");
  const category = document.getElementById("category");
  let url = "http://localhost:8080/api/clubs";

  let data = {
    title: title.value,
    content: content.value,
    categoryId: category.value
  }
  sendMakeClub(data);
});

async function sendMakeClub(data) {
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

function validator(title, content, categoryId) {

  if(title.value === "") {
    alert("모임 명을 입력해주세요");
  }
  if(content.value === "") {
    alert("모임 소개를 입력해주세요")
  }  
  if(categoryId.value === "") {
    alert("카테고리를 선택해주세요");
  }
}

