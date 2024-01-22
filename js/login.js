document.querySelector("#submit-btn").addEventListener("click", function (e) {
    e.preventDefault()
    let email = document.querySelector("#email");
    let password = document.querySelector("#password");
    let loginUrl = "http://13.124.255.30/api/users/login";
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

document.querySelector(".kakao-login").addEventListener("click", function() {
    getKakaoLogin();
});

function getKakaoLogin() {
    let url = "https://kauth.kakao.com/oauth/authorize?client_id=6666e4d3e7955e33eac0eb2e6609e3e5&redirect_uri=http://localhost:8080/api/users/login/kakao/callback&response_type=code";
    window.location.href = url;
}
// 토큰을 가져온 뒤 로컬 스토리지에 저장예정
// axios에서 보안 헤더가 안나오는 문제 있음. 아마 axios에 설정을 해줘야하거나 서버에서 허용을 해줘야할듯.
// 네트워크 탭에는 제대로 나옴.


