document.addEventListener("DOMContentLoaded", function () {
  sendRequest();
});


async function sendRequest() {
  let id = parseUrl();
  let url = `http://localhost:8080/api/clubs/${id}`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    if(response.status == 200) {
      document.getElementById("club-title").innerText = response.data.data.title;
      document.getElementById("club-content").innerText = response.data.data.content;
      document.getElementById("created-date").innerText = response.data.data.createdAt;
      document.getElementById("category-name").innerText = response.data.data.categoryName;
      console.log(response.data.data.categoryName);
    }
  });
}

function parseUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get('id');
  return id;
}
