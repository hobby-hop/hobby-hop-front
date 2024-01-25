document.querySelector("#submit-btn").addEventListener("click", function (e) {
    e.preventDefault()
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let loginUrl = "https://hobbyback.store/api/users/login";
    let data = { email: email.value, password: password.value };
    
    axios.post(loginUrl, data, null).then(response => {
        if(response.status == 200) {
            localStorage.setItem("authorization", response.headers["authorization"]);
            window.location.href = "/index.html";
        }
    
    }).catch(function () {
        alert("일치하는 유저가 없습니다. 다시 시도해주세요 ");
        password.value = "";
    });

}, false);
