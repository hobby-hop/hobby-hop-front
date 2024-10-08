document.addEventListener("DOMContentLoaded", function () {
  checkMember();
  checkAdmin();
  sendRequest();
});

async function sendRequest() {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      document.getElementById("club-title").innerText = response.data.data.title;
      document.getElementById("description").innerText = response.data.data.content;
      const formattedDate = customDateFormat(response.data.data.createdAt);
      document.getElementById("created-date").innerText = `모임 시작 날짜 : ${formattedDate}`;
      document.getElementById("category-name").innerText = response.data.data.categoryName;
    }
  }).catch(e => {
    console.log(e.response.data.errorMessages[0]);
  })
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
  let url = `https://hobbyback.store/api/clubs/${clubId}/requests`;
  axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      alert("가입신청이 완료되었습니다!");
      window.history.back();
    }
  }).catch(e => {
    validateToken(e.response.data.errorMessages[0]);
    document.getElementById("modal").style.display = 'none';
    document.getElementById("overlay").style.display = 'none';
  })
}

document.querySelector(".my-info").addEventListener("click", function() {
  const accordion = document.querySelector(".my-info-element .accordion");
  accordion.classList.toggle("close");
})


document.querySelector(".my-profile").addEventListener("click", function() {
  let clubId = parseUrl("clubId");
  window.location.href = `/profile.html?clubId=${clubId}`;
});


document.querySelector(".logout").addEventListener("click", function() {
  logout().then(response => {
    if(response.status == 200) {
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {
      
  });
});

async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}

document.querySelector(".modify-club").addEventListener("click", function() {
  let clubId = parseUrl("clubId");
  window.location.href = `/clubModify.html?clubId=${clubId}`;
});

document.getElementById("overlay").addEventListener("click", function() {
  document.getElementById("modal").style.display = 'none';
  document.getElementById("overlay").style.display = 'none';
});

document.querySelector(".manage-club").addEventListener("click", function() {
  document.querySelector(".club-manage > .accordion").classList.toggle("close");
});

async function checkMember() {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}/clubmembers/memberstatus`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      if(!response.data.data) {
        document.querySelector(".badge").style.display = "block";
      }
    }
  }).catch(e => {
    if(e.response.status === 400) {
      document.querySelector(".badge").style.display = "block";
    }
  });
}

async function checkAdmin() {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}/clubmembers/adminstatus`;

  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.data.data) {
      document.querySelector(".manage-club").style.display = "block";
    }
  }).catch(e => {
    console.log(e);
    
  });
}

document.addEventListener("click", function(evt) {
  const menu = document.querySelector(".my-info");
  const manageClub = document.querySelector(".manage-club");
  const userAccordion = document.querySelector(".my-info-element .accordion");
  const manageAccordion = document.querySelector(".club-manage .accordion");
  if(evt.target !== menu) {
    userAccordion.classList.add("close");
  }
  if(evt.target !== manageClub) {
    manageAccordion.classList.add("close");
  }
});