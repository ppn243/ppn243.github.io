var jwt = localStorage.getItem("jwt");
var uid = localStorage.getItem("uid");
var client = localStorage.getItem("client");

if (jwt == null) {
  window.location.href = "login.html";
}

function passwordFunction() {
  const current_password = localStorage.getItem("password");
  const old_password = document.getElementById("old_password").value;
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirm_password").value;

  if (current_password != old_password) {
    Swal.fire({
      text: "Your old password is not matching your new password.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", "https://dev.thanqminh.com:3001/auth/password");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Access-Token", jwt);
    xhttp.setRequestHeader("Uid", uid);
    xhttp.setRequestHeader("Client", client);
    xhttp.send(
      JSON.stringify({
        password: password,
        password_confirmation: confirm_password,
      })
    );

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        if (this.status == 200) {
          localStorage.setItem("password", password);
          Swal.fire({
            text: objects["message"],
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          const array = objects["errors"]["full_messages"];
          let formattedSring = "";
          for (i = 0; i < array.length; i++) {
            formattedSring += array[i] + "." + "<br>";
          }
          Swal.fire({
            html: formattedSring,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
    return false;
  }
}
