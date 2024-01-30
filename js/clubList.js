document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getClubs(1);
});

let clickCount = 1;
let size = 9;
let page = 1;

async function getClubs(page, keyword) {
  let url = "https://hobbyback.store/api/clubs";
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    },
    params: {
      page: page,
      size: size,
      keyword: keyword
    }
  }).then(response => {
    if (response.status == 200) {
      let total = response.data.data.total
      let data = response.data.data.dtoList;
      let targetHtml = document.querySelector(".content-box");
      let template = document.getElementById("club-list").innerText;
      let resultHtml = makeTemplate(data, template);
      targetHtml.insertAdjacentHTML("beforeend", resultHtml);
      if (!(size >= total)) {
        document.querySelector(".more-btn").style.display = "block";
      }
    }
  }).catch(e => {
    console.log(e.response.data.errorMessages[0]);
    validateToken(e.response.data.errorMessages[0]);
  })

  return response;
}

function makeMoreBtn() {
  document.querySelector(".btn-wrap").innerHTML = `<a href="javascript:void(0)" class="more-btn">더보기</a>`;
}

document.querySelector(".content-box").addEventListener("click", function (evt) {
  if (evt.target.closest(".content") === null || evt.target.closest(".content") === undefined) {
    return false;
  }
  let clubId = evt.target.closest(".content").dataset.clubId;
  let url = `/clubRead.html?clubId=${clubId}`;
  window.location.href = url;
});

document.querySelector(".my-info").addEventListener("click", function (evt) {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});

// document.querySelector(".logout").addEventListener("click", function () {
//   logout().then(response => {
//     if (response.status == 200) {
//       alert("정상적으로 로그아웃 되었습니다.");
//       localStorage.removeItem("authorization");
//       window.location.href = "/index.html";
//     }
//   }).catch(e => {
//     validateToken(e.response.data.errorMessages[0]);
//   });
// });

async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}
document.querySelector(".more-btn").addEventListener("click", function () {
  getClubs(++clickCount);
});

document.querySelector(".search").addEventListener("click", function () {
  document.querySelector(".content-box").innerHTML = "";
  clickCount = 0;
  search();
});

function search() {
  let keyword = document.querySelector(".keyword").value;
  document.querySelector(".content-box").innerHTML = "";
  clickCount = 0;
  getClubs(++clickCount, keyword);
}

document.querySelector('.keyword').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    search();
  }
});