document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getClubs();
});

async function getClubs() {
  let url = "https://hobbyback.store/api/clubs";
  const response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      let data = response.data.data.dtoList;
      let targetHtml = document.querySelector(".content-box");
      let template = document.getElementById("club-list").innerText;
      makeTemplate(data, template, targetHtml);
    }
  }).catch(e => {
    validateToken(e);
  })

  return response;
}

document.querySelector(".content-box").addEventListener("click", function (evt) {
  if (evt.target.closest(".content") === null || evt.target.closest(".content") === undefined) {
      return false;
  } 
  let clubId = evt.target.closest(".content").dataset.clubId;
  let url = `/clubRead.html?clubId=${clubId}`;
  window.location.href = url;

});

document.querySelector(".my-info").addEventListener("click", function(evt) {
  
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
})



document.querySelector(".logout").addEventListener("click", function() {
  logout().then(response => {
    if(response.status == 200) {
      alert("정상적으로 로그아웃 되었습니다.");
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {
    validateToken(e);
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

