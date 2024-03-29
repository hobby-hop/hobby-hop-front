document.querySelector("#submit-btn").addEventListener("click", function (e) {
    e.preventDefault()
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let loginUrl = "https://hobbyback.store/api/users/login";
    let data = { email: email.value, password: password.value };

    if (validateLogin(email, password)) {
        loginRequest(data).then(response => {
            localStorage.setItem("authorization", response.headers['authorization']);
            window.location.href = "/index.html";
        }).catch(e => {
            alert("일치하는 유저가 없습니다.");
            document.getElementById("password").value = "";
        });
    } 
}, false);


function validateLogin(email, password) {
    if(email.value === "") {
        email.style.border = "2px solid red";
        email.focus();
        return false;
    } else {
        email.style.border = "1px solid #ddd";
    }

    if(password.value === "") {
        password.style.border = "2px solid red";
        password.focus();
        return false;
    } else {
        password.style.border = "1px solid #ddd";
    }

    return true;
}

async function loginRequest(data) {
    let url = `https://hobbyback.store/api/users/login`;
    let response = axios.post(url, data, null);
    return response;
}
