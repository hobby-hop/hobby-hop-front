document.addEventListener("DOMContentLoaded", function() {
  getMyInfo();
});


async function getMyInfo() {
  let url = `https://hobbyback.store/api/users/profile`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }
  ).then(response => {
    if(response.status == 200) {
      document.querySelector(".content-box").innerText = response.data.data.username;
      document.querySelector(".container").innerText = response.data.data.email;
    }
  });

  return response;
}