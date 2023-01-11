var jwt = localStorage.getItem("jwt");
var uid = localStorage.getItem("uid");
var client = localStorage.getItem("client");

var task_counter = 0;
var available_counter = 0;
var completed_counter = 0;
var notdone_counter = 0;

var oldName;
var newName;

if (jwt == null) {
  alert("You need to login before using this page");
  window.location.href = "login.html";
}

console.log(jwt);
console.log(uid);
console.log(client);

function getUser() {
  const xhttp = new XMLHttpRequest();
  const xhttp_counter = new XMLHttpRequest();

  xhttp.open("GET", "https://dev.thanqminh.com:3001/profile");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const objects = JSON.parse(this.responseText);
        if (objects["name"] == null) {
          document.getElementById("username").innerHTML = objects["email"];
        } else {
          document.getElementById("username").innerHTML = objects["name"];
        }
        document.getElementById("email").value = objects["email"];
        document.getElementById("name").value = objects["name"];
        oldName = document.getElementById("name").value;
      } else {
        alert("You need to login before using this page!");
        window.location.href = "login.html";
        localStorage.removeItem("jwt");
        localStorage.removeItem("uid");
        localStorage.removeItem("client");
      }
    }
  };

  xhttp_counter.open("GET", "https://dev.thanqminh.com:3001/task_lists");
  xhttp_counter.setRequestHeader(
    "Content-Type",
    "application/json;charset=UTF-8"
  );
  xhttp_counter.setRequestHeader("Access-Token", jwt);
  xhttp_counter.setRequestHeader("Uid", uid);
  xhttp_counter.setRequestHeader("Client", client);
  xhttp_counter.send();
  xhttp_counter.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const objects = JSON.parse(this.responseText);
        for (let list of objects) {
          available_counter++;
          task_counter += list["todo_count"];
          completed_counter += list["done_count"];
        }
        notdone_counter = task_counter - completed_counter;

        document.getElementById("available").innerHTML = available_counter;
        document.getElementById("task_available").innerHTML = task_counter;
        document.getElementById("completed").innerHTML = completed_counter;
        document.getElementById("notdone").innerHTML = notdone_counter;
      }
    }
  };
}

function isEmpty(str) {
  return !str.trim().length;
}

function updateProfile() {
  newName = document.getElementById("name").value;
  const xhttp = new XMLHttpRequest();

  xhttp.open("PATCH", "https://dev.thanqminh.com:3001/auth");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send(
    JSON.stringify({
      name: newName,
    })
  );
  if (isEmpty(newName)) {
    Swal.fire({
      text: "Please fill your username",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (oldName == newName) {
    Swal.fire({
      text: "Please change your username",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else {
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          Swal.fire({
            text: "Updated successful",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
      }
    };
  }
}
