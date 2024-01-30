document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getClubs();
});

async function getClubs() {
  let url = "https://hobbyback.store/api/clubs/my";
  const response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      let data = response.data.data;
      let targetHtml = document.querySelector(".content-box");
      let template = document.getElementById("club-list").innerText;
      let resultHtml = makeTemplate(data, template);
      
      targetHtml.innerHTML = resultHtml;

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
