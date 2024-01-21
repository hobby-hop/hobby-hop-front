document.addEventListener("DOMContentLoaded", function () {
  getClubs();
});

async function getClubs() {
  let url = "http://localhost:8080/api/clubs";
  const response = await axios.get(url, {
    headers: {
      "authorization" : localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      console.log(response.data.data.dtoList);
      let data = response.data.data.dtoList;
      let targetHtml = document.querySelector(".content-box");
      makeTemplate(data, targetHtml);
    }
  });
  
  return response;
}

function makeTemplate(data, targetHtml) {
  console.log(data, targetHtml);
  let template = document.getElementById("club-list").innerText;
  let bindTemplate = Handlebars.compile(template);  
  
  let innerHtml = data.reduce(function(prve, next) {
    return prve + bindTemplate(next);
  }, "");
  console.log(targetHtml);
  targetHtml.innerHTML = innerHtml;
}
document.querySelector(".content-box").addEventListener("click", function(evt) {
  console.log(evt.target.closest(".content").dataset.clubId);
  let clubId = evt.target.closest(".content").dataset.clubId
  let url = `/clubRead.html?id=${clubId}`;
  console.log(url);
  window.location.href = url;
});