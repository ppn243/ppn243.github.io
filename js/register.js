function registerFunction() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const c_password = document.getElementById("confirm_password").value;

  if (password != c_password) {
    Swal.fire({
      text: "Your password is not matching with confirm password",
      icon: "error",
      confirmButtonText: "OK",
    });
    return false;
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://dev.thanqminh.com:3001/auth");
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(
      JSON.stringify({
        email: email,
        password: password,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        if (this.status == 200) {
          Swal.fire({
            text: "Register",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "login.html";
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
