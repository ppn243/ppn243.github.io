var jwt = null;
jwt = localStorage.getItem("jwt");

if (jwt != null) {
  console.log(jwt);
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "none";
} else {
  document.getElementById("change_password").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("logout").style.display = "none";
}

function logOut(e) {
  e.preventDefault();
  Swal.fire({
    title: "Log Out",
    text: "Goodbye",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#blue",
    cancelButtonColor: "#d33",
    confirmButtonText: "Log Out",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("uid");
      localStorage.removeItem("client");
      localStorage.removeItem("selectedFolder");
      localStorage.removeItem("selectedUpdateFolderText");
      localStorage.removeItem("password");
      Swal.fire({
        text: "Logged out!",
        icon: "success",
        confirmButtonText: "OK!!!!!!!!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "login.html";
        }
      });
    }
  });
}
// var logout = document.getElementById("logoutbutton");

// logout.addEventListener(
//   "click",
//   function () {
//     localStorage.removeItem("jwt");
//     localStorage.removeItem("uid");
//     localStorage.removeItem("client");
//     localStorage.removeItem("name");
//     localStorage.removeItem("password");

//     console.log("alo123");

//     window.location.href = "login.html";
//   },
//   false
// );
