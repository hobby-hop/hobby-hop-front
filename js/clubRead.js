document.addEventListener("DOMContentLoaded", function () {
  sendRequest();
});

async function sendRequest() {
  let clubId = parseUrl("clubId");
  let url = `http://13.124.255.30/api/clubs/${clubId}`;
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
  let clubId = parseUrl("clubId");
  window.location.href = `/postList.html?clubId=${clubId}`;
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
  let clubId = parseUrl("clubId");
  let url = `http://13.124.255.30/api/clubs/${clubId}/requests`;
  axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      alert("가입신청이 완료되었습니다!");
      window.location.href = "/index.html";
    }
  });
}

document.querySelector(".my-info").addEventListener("click", function() {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})





