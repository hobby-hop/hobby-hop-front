document.addEventListener("DOMContentLoaded", function () {
  getClubs(1);
});

let clickCount = 1;
let size = 9;
let page = 1;

async function getClubs(page, keyword, categoryId) {
  let url = "http://localhost:8080/api/clubs";
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    },
    params: {
      page: page,
      size: size,
      keyword: keyword,
      categoryId
    }
  }).then(response => {
    if (response.status == 200) {
      let total = response.data.data.total;
      let data = response.data.data.dtoList;
      let targetHtml = document.querySelector(".content-box");
      let template = document.getElementById("club-list").innerText;
      let clubElements = document.getElementsByClassName("content");

      if(data) {
        let resultHtml = makeTemplate(data, template);
        targetHtml.insertAdjacentHTML("beforeend", resultHtml);
      }

      if(total > clubElements.length) {
        document.querySelector(".more-btn").style.display = "block";
      } else {
        document.querySelector(".more-btn").style.display = "none";
      }
      
    }
  }).catch(e => {
    console.log(e.response.data.errorMessages[0]);
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

async function logout() {
  let url = `https://hobbyback.store/api/users/logout`;
  let response = await axios.post(url, null, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });

  return response;
}

document.querySelector(".logout").addEventListener("click", function () {
  logout().then(response => {
    if (response.status == 200) {
      localStorage.removeItem("authorization");
      window.location.href = "/index.html";
    }
  }).catch(e => {
    console.log(e.response.data.errorMessages[0]);
    validateToken(e.response.data.errorMessages[0]);
  });
});
document.querySelector(".more-btn").addEventListener("click", function () {
  let keyword = document.getElementById("keyword").value;
  let categoryId = document.getElementById("category").value;
  getClubs(++clickCount, keyword, categoryId);
});

document.querySelector(".search").addEventListener("click", function () {
  document.querySelector(".content-box").innerHTML = "";
  clickCount = 0;
  search();
});

function search() {
  let keyword = document.getElementById("keyword").value;
  let categoryId = document.getElementById('category').value;
  document.querySelector(".content-box").innerHTML = "";
  clickCount = 0;
  getClubs(++clickCount, keyword, categoryId);
}

document.getElementById('keyword').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    search();
  }
});

const toTopEl = document.querySelector('#to-top')

window.addEventListener('scroll', _.throttle(function () {
  if (window.scrollY > 300) {
    gsap.to(toTopEl, .2, {
      x: 0
    })

  } else {
    // 상단으로 스크롤 버튼 숨기기!
    gsap.to(toTopEl, .2, {
      x: 100
    })
  }
}, 300))
// 상단으로 스크롤 버튼을 클릭하면,
toTopEl.addEventListener('click', function () {
  // 페이지 위치를 최상단으로 부드럽게(0.7초 동안) 이동.
  gsap.to(window, .4, {
    scrollTo: 0
  })
})