document.addEventListener("DOMContentLoaded", function () {
  checkLogin();
  getClubs();
});

async function getClubs() {
  let url = "http://13.124.255.30/api/clubs";
  const response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if (response.status == 200) {
      let data = response.data.data.dtoList;
      let targetHtml = document.querySelector(".content-box");
      makeTemplate(data, targetHtml);
    }
  });

  return response;
}

function makeTemplate(data, targetHtml) {
  let template = document.getElementById("club-list").innerText;
  let bindTemplate = Handlebars.compile(template);

  let innerHtml = data.reduce(function (prve, next) {
    return prve + bindTemplate(next);
  }, "");
  targetHtml.innerHTML = innerHtml;
}
document.querySelector(".content-box").addEventListener("click", function (evt) {
  if (evt.target.closest(".content") === null || evt.target.closest(".content") === undefined) {
      return false;
  } 
  let clubId = evt.target.closest(".content").dataset.clubId;
  let url = `/clubRead.html?clubId=${clubId}`;
  window.location.href = url;

});