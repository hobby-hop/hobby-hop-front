let accessToken = localStorage.getItem("Authorization");
let container = document.querySelector(".container");
let title = document.querySelector(".title");
let categoryId = document.querySelector(".category-id");

document.addEventListener("DOMContentLoaded", function () {
  disableMoveToPost();
  let params = {
    page : 1,
    size: 10,
  }
  getPosts(params);
});

async function getPosts(params) {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}/posts`;
  await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    },
    params
  }).then(response => {
    let data = response.data.data;
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
    console.log(e.response.data.errorMessages[0]);
  });
}

document.querySelector(".write-btn").addEventListener("click", function () {
  checkMember().then(response => {
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
    if(e.response.status === 400) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login.html";
    }
  });
});

async function checkMember() {
  let clubId = parseUrl("clubId");
  let url = `http://localhost:8080/api/clubs/${clubId}/clubmembers/memberstatus`;
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
  if(data.prev) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${data.start-1}>PREV</a></li>`
  }

  for (let i = data.start; i <= data.end; i++) {
    if(data.page  === i) {
      pageStr += `<li><a href="javascript:void(0)" class="page-number active" data-page=${i}>${i}</a></li>`
    } else {
      pageStr += `<li><a href="javascript:void(0)" class="page-number" data-page=${i}>${i}</a></li>`
    }
  }

  if(data.next) {
    pageStr += `<li><a href="javascript:void(0)" data-page=${data.end+1}>NEXT</a></li>`
  }
  postPaging.innerHTML = pageStr;
}

document.querySelector(".number").addEventListener("click", function (evt) {
  let params = {};
  let keyword = document.querySelector(".keyword").value;
  if(keyword !== "") {
    params.keyword = keyword;
  }
  params.page = evt.target.dataset.page;
  params.size = 10;
  getPosts(params);
});

document.querySelector(".my-info").addEventListener("click", function () {
  const accordion = document.querySelector(".accordion");
  accordion.classList.toggle("close");
});
document.querySelector(".search").addEventListener("click", function () {
  let params = {}
  let keyword = document.querySelector(".keyword").value;
  params.page = 1;
  params.size = 10;
  if(keyword !== "") {
    params.keyword = keyword;
  }
  getPosts(params);
});
document.querySelector('.keyword').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    let params = {}
    let keyword = document.querySelector(".keyword").value;
    params.page = 1;
    params.size = 10;
    if(keyword !== "") {
      params.keyword = keyword;
    }
    getPosts(params);
  }
});

function disableMoveToPost(){
  if(accessToken == ""){ 
    return;
  }
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
