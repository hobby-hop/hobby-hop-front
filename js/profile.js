getMyInfo();

async function getMyInfo() {
  let clubId = parseUrl();
  let url = `http://13.124.255.30/api/clubs/${clubId}/requests`;
  let response = await axios.get(url, {
    headers: {
      "authorization": localStorage.getItem("authorization")
    }
  }).then(response => {
    document.querySelector(".send-user").innerText = response.data.data[0].sendUserId;
    document.querySelector(".recived-club").innerText = response.data.data[0].recvClubId;
  });
}

function parseUrl() {
  let params = new URLSearchParams(window.location.search);
  let id = params.get('clubId');
  return id;
}