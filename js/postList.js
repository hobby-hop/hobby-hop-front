let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  disableMoveToPost();
  getPosts(1, 10, "");
});

async function getPosts(page, size, keyword) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/posts`;
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
    let data = response.data.data.dtoList;
    let targetHtml = document.querySelector(".content-box");
    targetHtml.innerHTML = "";
    let template = document.getElementById("post-list").innerText;
    if (response.data.data.dtoList === null) {
      return false;
    }
    let resultHtml = makeTemplate(data, template);
    targetHtml.innerHTML = resultHtml;
    printPages(response.data.data);
  }).catch(e => {
    validateToken(e.response.data.errorMessages[0]);
  });
}

document.querySelector(".write-btn").addEventListener("click", function () {
  let response = checkMember().then(response => {
    if (response.status == 200) {
      if (response.data.data) {
        let clubId = parseUrl("clubId");
        let url = `/postWrite.html?clubId=${clubId}`;
        window.location.href = url;
      } else {
        alert("모임에 가입하신 뒤 게시글 작성이 가능합니다.");
      }
    }
  }).catch(e => {

  });
});

async function checkMember() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/checkClubMember`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  });
  return response;
}

function printPages(data) {
  const postPaging = document.querySelector(".number");
  let pageStr = '';

  for (let i = data.start; i <= data.end; i++) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${i}>${i}</a></li>`
  }
  postPaging.innerHTML = pageStr;
}

document.querySelector(".number").addEventListener("click", function (evt) {
  getPosts(evt.target.dataset.page, 10);
});

document.querySelector(".my-info").addEventListener("click", function () {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});
document.querySelector(".search").addEventListener("click", function () {
  let keyword = document.querySelector(".keyword").value;
  getPosts(1, 10, keyword);
});
document.querySelector('.keyword').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    let keyword = document.querySelector(".keyword").value;
    getPosts(1, 10, keyword);
  }
});

document.querySelector(".logout").addEventListener("click", function () {
  logout().then(response => {
    if (response.status == 200) {
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


function disableMoveToPost(){
  checkMember().then(response => {
    if(!response.data.data) {
      document.querySelector(".content-box").addEventListener("click", function(evt) {
        if(evt.target.tagName !== "A") {
          return;
        }
        evt.preventDefault();
        alert("게시글은 모임의 멤버만 읽을 수 있습니다.");
      });
    }
  });
}
