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
  });

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