document.addEventListener("DOMContentLoaded", function () {
  const response = getClubs();
});

async function getClubs() {
  let url = "http://localhost:8080/api/clubs/1";
  const response = await axios.get(url, {
    headers: {
      "authorization" : localStorage.getItem("authorization")
    }
  });
  console.log(response);

  return response;
}