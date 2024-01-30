document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getMyInfo();
});


async function getMyInfo() {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/requests`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    let data = response.data.data;

    let targetHtml = document.querySelector(".container");
    makeTemplate(data, targetHtml);
  }).catch((e) => {
    if (e.response.status === 403) {
      alert("모임장만 접근 가능한 페이지입니다.")
    } else if (e.response.status === 404) {
      alert("모임의 멤버가 아닙니다.");
    }
    window.history.back();
  });
}


function makeTemplate(data, targetHtml) {
  let template = document.getElementById("club-list").innerText;
  let bindTemplate = Handlebars.compile(template);

  let innerHtml = data.reduce(function (prve, next) {
    return prve + bindTemplate(next);
  }, "");
  targetHtml.innerHTML = innerHtml;
}

document.querySelector(".container").addEventListener("click", function (evt) {
  if (evt.target.tagName === "INPUT") {
    let requestId = evt.target.closest(".content").dataset.id;
    let content = evt.target.closest(".content");

    let requestStatus = content.querySelector(".request-status");
    validator(requestStatus.value);

    let data = {
      status: requestStatus.value
    }

    processRequst(requestId, data);
  }
});

async function processRequst(requestId, data) {
  let clubId = parseUrl("clubId");
  let url = `https://hobbyback.store/api/clubs/${clubId}/requests/${requestId}`;

  let response = await axios.put(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      alert("처리가 완료되었습니다.");
      window.history.back();
    }
  }).catch(e => {
    alert(e.response.data.errorMessages[0]);
    window.history.back();
  });
}

function validator(status) {
  if (status === "") {
    return false;
  }
  return true;
}