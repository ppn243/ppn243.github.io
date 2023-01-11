var jwt = localStorage.getItem("jwt");
var uid = null;
var client = null;

if (jwt != null) {
  window.location.href = "task.html";
  document.getElementById("user_login").style.display = "none";
}

function loginFunction() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (email == "") {
    Swal.fire({
      text: "Login failed! Your email is null",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  } else if (password == "") {
    Swal.fire({
      text: "Login failed! Your password is null",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://dev.thanqminh.com:3001/auth/sign_in");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(
      JSON.stringify({
        email: email,
        password: password,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          jwt = xhttp.getResponseHeader("Access-Token");
          uid = xhttp.getResponseHeader("Uid");
          client = xhttp.getResponseHeader("Client");
          localStorage.setItem("jwt", jwt);
          localStorage.setItem("uid", uid);
          localStorage.setItem("client", client);
          localStorage.setItem("password", password);
          Swal.fire({
            text: "Login",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "homepage.html";
            }
          });
        } else {
          Swal.fire({
            text: "Login failed! Your account is not existed. Check your email or password again",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
    return false;
  }
}
