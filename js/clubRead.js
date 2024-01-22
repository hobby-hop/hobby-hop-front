document.addEventListener("DOMContentLoaded", function () {
  sendRequest();
});

async function sendRequest() {
  let id = parseUrl();
  let url = `http://localhost:8080/api/clubs/${id}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      document.getElementById("club-title").innerText = response.data.data.title;
      document.querySelector(".description").innerText = response.data.data.content;
      const formattedDate = parseDate(response.data.data.createdAt);
      document.getElementById("created-date").innerText = formattedDate;
      document.getElementById("category-name").innerText = response.data.data.categoryName;
    }
  });
}

document.querySelector(".post-list").addEventListener("click", moveToPostList);

function moveToPostList() {
  let id = parseUrl();
  window.location.href = `/postList.html?id=${id}`;
}

function parseUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get('id');
  return id;
}

document.querySelector(".badge").addEventListener("click", onClickModal);

function onClickModal() {
  document.getElementById('modal').style.display = 'block';
  document.getElementById("overlay").style.display = 'block';
}

document.querySelector(".close-btn").addEventListener("click", function () {
  document.getElementById('modal').style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});

document.querySelector(".join-btn").addEventListener("click", function () {
  sendJoinReqeust();
});

async function sendJoinReqeust() {
  let clubId = parseUrl();
  let url = `http://localhost:8080/api/clubs/${clubId}/requests`;
  axios.post(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      window.location.href = "/index.html";
    }
  });
}


