document.addEventListener("DOMContentLoaded", function () {
  const response = getClubs();
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

Handlebars.registerHelper("likes", function (like) {
  if (like > 4) {
      return "<span>축하해요 좋아요가 " + like + "개 이상입니다!</span>";
  } else if (like < 1) {
      return "아직 아무도 좋아하지 않아요..";
  } else {
      return like + "개의 좋아요가 있네요";
  }
});

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