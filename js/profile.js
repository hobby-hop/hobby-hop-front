document.addEventListener("DOMContentLoaded", function() {
  getMyInfo();
});


async function getMyInfo() {
  let clubId = parseUrl("clubId");
  let url = `http://13.124.255.30/api/clubs/${clubId}/requests`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    let data = response.data.data;
    
    let targetHtml = document.querySelector(".container");
    makeTemplate(data, targetHtml);
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

document.querySelector(".container").addEventListener("click", function(evt) {
  if(evt.target.tagName === "INPUT") {
    let requestId = evt.target.closest(".content").dataset.id;
    let content = evt.target.closest(".content");
    
    let requestStatus = content.querySelector(".request-status");
    validator(requestStatus.value);

    let data = {
      status : requestStatus.value
    }

    sendRequst(requestId, data);
  }
});

async function sendRequst(requestId, data) {
  let clubId = parseUrl("clubId");
  let url = `http://13.124.255.30/api/clubs/${clubId}/requests/${requestId}`;

  let response = await axios.put(url, data, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      alert("처리가 완료되었습니다!");
    }
  });
}

function validator(status) {
  if(status === "") {
    return false;
  }
  return true;
}