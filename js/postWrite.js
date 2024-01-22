document.querySelector(".submit-btn").addEventListener("click", function () {
  let title = document.querySelector(".title");
  let content = document.querySelector(".content");
  let data = {
    postTitle: title.value,
    postContent: content.value
  }
  if (validator(data)) {
    sendPost(data);
  }
});

async function sendPost(data) {
  let clubId = parseUrl("clubId");
  let url = `http://13.124.255.30/api/clubs/${clubId}/posts`;
  let response = axios.post(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      alert("게시글이 작성되었습니다.");
      window.location.href = `/postList.html?clubId=${clubId}`;
    }
  }).catch(e => {
    alert("오류가 발생했습니다.");
    window.location.href = `/postList.html?clubId=${clubId}`;
  })
}


function validator(data) {

  if (data.title === "") {
    return false;
  }
  if (data.content === "") {
    return false;
  }

  return true;
}