var jwt = localStorage.getItem("jwt");
var uid = localStorage.getItem("uid");
var client = localStorage.getItem("client");
let counter = 0;
let id_counter = 0;

const folder_lists = document.getElementById("folder_lists");
const deletefolder_lists = document.getElementById("deletefolder_lists");
const addtaskfolders_lists = document.getElementById("addtaskfolders_lists");
const updatefolder_lists = document.getElementById("updatefolder_lists");
const movetaskfolders_list = document.getElementById("movetaskfolders_list");

if (jwt == null) {
  alert("You need to login");
  window.location.href = "login.html";
}

const serverUrl = "https://dev.thanqminh.com:3001/";

//functions execute after loading / reload
function loadingFolders() {
  let folder_counter = 0;

  document.getElementById("table").style.display = "none";
  document.getElementById("btn_addtask").style.display = "none";
  document.getElementById("notify").innerHTML = "";

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `${serverUrl}/task_lists`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      for (let list of objects) {
        options = document.createElement("option");
        options.innerHTML = list["name"];
        options.value = list["id"];

        delete_options = document.createElement("option");
        delete_options.innerHTML = list["name"];
        delete_options.value = list["id"];

        addtask_options = document.createElement("option");
        addtask_options.innerHTML = list["name"];
        addtask_options.value = list["id"];

        updatefolder_options = document.createElement("option");
        updatefolder_options.innerHTML = list["name"];
        updatefolder_options.value = list["id"];

        movefolder_options = document.createElement("option");
        movefolder_options.innerHTML = list["name"];
        movefolder_options.value = list["id"];

        folder_lists.appendChild(options);
        deletefolder_lists.appendChild(delete_options);
        addtaskfolders_lists.appendChild(addtask_options);
        updatefolder_lists.appendChild(updatefolder_options);
        movetaskfolders_list.appendChild(movefolder_options);
        folder_counter++;
        if (folder_counter == objects.length) {
          loadingFolderOnReload();
        }
      }
    }
  };

  const xhttp_shared = new XMLHttpRequest();
  xhttp_shared.open("GET", `${serverUrl}/shared`);
  xhttp_shared.setRequestHeader(
    "Content-Type",
    "application/json;charset=UTF-8"
  );
  xhttp_shared.setRequestHeader("Access-Token", jwt);
  xhttp_shared.setRequestHeader("Uid", uid);
  xhttp_shared.setRequestHeader("Client", client);
  xhttp_shared.send();

  xhttp_shared.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      for (let list of objects) {
        options = document.createElement("option");
        options.innerHTML = list["name"];
        options.value = list["id"];

        folder_lists.appendChild(options);
        folder_counter++;
        if (folder_counter == objects.length) {
          loadingFolderOnReload();
        }
      }
    }
  };
}

function loadFolderUpdateDeleteAddTask() {
  if (localStorage.getItem("selectedFolder")) {
    addtaskfolders_lists.value = localStorage.getItem("selectedFolder");
    updatefolder_lists.value = localStorage.getItem("selectedFolder");
    deletefolder_lists.value = localStorage.getItem("selectedFolder");

    document.getElementById("updatefolder_name").value =
      updatefolder_lists.options[updatefolder_lists.selectedIndex].text;
    localStorage.setItem(
      "selectedUpdateFolderText",
      updatefolder_lists.options[updatefolder_lists.selectedIndex].text
    );
  }
}

function loadingOnchangeSelectUpdate() {
  document.getElementById("updatefolder_name").value =
    updatefolder_lists.options[updatefolder_lists.selectedIndex].text;
  localStorage.setItem(
    "selectedUpdateFolderText",
    updatefolder_lists.options[updatefolder_lists.selectedIndex].text
  );
}

function loadingUsers() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `${serverUrl}/users`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send();
  const user_list = document.getElementById("users_list");

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      for (let list of objects) {
        user_options = document.createElement("option");
        user_options.innerHTML = list["email"];
        user_options.value = list["id"];
        user_list.appendChild(user_options);
      }
    }
  };
}
loadingUsers();

function loadingFolderOnReload() {
  if (localStorage.getItem("selectedFolder")) {
    folder_lists.value = localStorage.getItem("selectedFolder");
    selectFolder();
  }
}

//functions execute when select folder / select shared tasks
function getSharedTask() {
  folder_lists.value = 1;

  document.getElementById("table").style.display = "inline";
  document.getElementById("btn_addtask").style.display = "inline";
  document.getElementById("notify").innerHTML = "";
  document.getElementById("filter_select").value = "all";
  counter = 0;
  $("#task_lists").empty();
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `${serverUrl}/shared`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const objects = JSON.parse(this.responseText);
        if (objects.length === 0) {
          document.getElementById("table").style.display = "none";
          document.getElementById("notify").innerHTML = "";
        } else {
          document.getElementById("th_options").innerHTML = "Task shared by";
          document.getElementById("th_name").innerHTML = "Task list";
          for (let list of objects) {
            const task_lists = document.getElementById("task_lists");

            const tr = document.createElement("tr");
            const th_id = document.createElement("th");
            const td_name = document.createElement("td");
            const td_status = document.createElement("td");
            const td_details = document.createElement("td");
            const td_options = document.createElement("td");

            const random = Math.floor(Math.random() * 2) + 1;

            th_id.scope = "row";

            th_id.innerHTML = counter + 1;
            td_name.innerHTML = list["name"];

            if (list["description"] == null) {
              td_details.innerHTML = "No details received";
            } else {
              td_details.innerHTML = list["description"];
            }
            td_options.innerHTML = list["user_id"];

            if (random == 1) {
              td_status.innerHTML = "Not done";
            } else {
              td_status.innerHTML = "Done";
            }
            //create table
            task_lists.appendChild(tr);
            tr.appendChild(th_id);
            tr.appendChild(td_name);
            tr.appendChild(td_status);
            tr.appendChild(td_details);
            tr.appendChild(td_options);

            counter++;
          }
        }
      }
    }
  };
}

function selectFolder() {
  localStorage.setItem(
    "selectedFolder",
    document.getElementById("folder_lists").value
  );
  document.getElementById("table").style.display = "inline";
  document.getElementById("btn_addtask").style.display = "inline";
  document.getElementById("notify").innerHTML = "";
  document.getElementById("filter_select").value = "all";
  counter = 0;
  $("#task_lists").empty();
  fetchTask();
}

//function for fetching task / assign task function for buttons inside it
function fetchTask() {
  let selected = folder_lists.options[folder_lists.selectedIndex].value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `${serverUrl}/task_lists/${selected}/todos`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.setRequestHeader("Access-Token", jwt);
  xhttp.setRequestHeader("Uid", uid);
  xhttp.setRequestHeader("Client", client);
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        const objects = JSON.parse(this.responseText);
        if (objects.length === 0) {
          document.getElementById("table").style.display = "none";
          document.getElementById("notify").innerHTML = "";
        } else {
          document.getElementById("th_options").innerHTML = "Actions";
          document.getElementById("th_name").innerHTML = "Name";
          document.getElementById("th_status").innerHTML = "Status";
          for (let list of objects) {
            const task_lists = document.getElementById("task_lists");

            const tr = document.createElement("tr");
            const th_id = document.createElement("th");
            const td_name = document.createElement("td");
            const td_status = document.createElement("td");
            const td_details = document.createElement("td");
            const td_options = document.createElement("td");

            const edit_button = document.createElement("button");
            const completed_button = document.createElement("button");
            const share_button = document.createElement("button");
            const duplicate_button = document.createElement("button");
            const move_button = document.createElement("button");
            const delete_button = document.createElement("button");

            const edit_i = document.createElement("span");
            const completed_i = document.createElement("span");
            const share_i = document.createElement("span");
            const duplicate_i = document.createElement("span");
            const move_i = document.createElement("span");
            const delete_i = document.createElement("span");

            th_id.scope = "row";

            td_options.style.display = "flex";
            edit_button.className = "btn btn-primary 1";
            edit_button.title = "Edit";
            edit_button.setAttribute("data-toggle", "modal");
            edit_button.setAttribute("data-target", "#editModal");
            edit_i.innerHTML = "Edit";

            completed_button.className = "btn btn-success 1";
            completed_button.title = "Mark as completed";
            completed_button.setAttribute("data-toggle", "modal");
            completed_button.setAttribute("data-target", "#completedModal");
            completed_i.innerHTML = "Check";

            share_button.className = "btn btn-info 1";
            share_button.title = "Share";
            share_button.setAttribute("data-toggle", "modal");
            share_button.setAttribute("data-target", "#shareModal");
            share_i.innerHTML = "Share";

            duplicate_button.className = "btn btn-warning 1";
            duplicate_button.title = "Duplicate";
            duplicate_button.setAttribute("data-toggle", "modal");
            duplicate_button.setAttribute("data-target", "#duplicateModal");
            duplicate_i.innerHTML = "Duplicate";

            move_button.className = "btn btn-warning 2";
            move_button.title = "Move";
            move_button.setAttribute("data-toggle", "modal");
            move_button.setAttribute("data-target", "#moveModal");
            move_i.innerHTML = "Move";

            delete_button.className = "btn btn-danger 1";
            delete_button.title = "Delete";
            delete_button.setAttribute("data-toggle", "modal");
            delete_button.setAttribute("data-target", "#deletedModal");
            delete_i.innerHTML = "Delete";

            th_id.innerHTML = counter + 1;
            td_name.innerHTML = list["name"];
            if (list["done"] == null) {
              td_status.innerHTML = "Not done";
            } else {
              td_status.innerHTML = "Completed";
              edit_button.style.display = "none";
              share_button.style.display = "none";
              completed_button.style.display = "none";
              duplicate_button.style.display = "none";
              move_button.style.display = "none";
            }
            if (!list["description"].trim()) {
              td_details.innerHTML = "No detail received.";
            } else {
              td_details.innerHTML = list["description"];
            }

            //create table
            task_lists.appendChild(tr);
            tr.appendChild(th_id);
            tr.appendChild(td_name);
            tr.appendChild(td_status);
            tr.appendChild(td_details);
            tr.appendChild(td_options);

            td_options.appendChild(edit_button);
            edit_button.appendChild(edit_i);

            td_options.appendChild(completed_button);
            completed_button.appendChild(completed_i);

            td_options.appendChild(share_button);
            share_button.appendChild(share_i);

            td_options.appendChild(duplicate_button);
            duplicate_button.appendChild(duplicate_i);

            td_options.appendChild(move_button);
            move_button.appendChild(move_i);

            td_options.appendChild(delete_button);
            delete_button.appendChild(delete_i);

            //event for each button in each row
            const btn_delete =
              document.getElementsByClassName("btn btn-danger 1")[counter];
            btn_delete.addEventListener("click", function () {
              document.getElementById("delete_label1").innerHTML =
                'Are you sure you want to delete <span class = "thick">' +
                list["name"] +
                "</span> task?";
              document.getElementById("delete_label2").innerHTML =
                "Action can't be revert!";
              const confirm = document.getElementById("delete_btn task");
              confirm.addEventListener("click", function () {
                xhttp.open(
                  "DELETE",
                  `${serverUrl}/task_lists/${selected}/todos/${list["id"]}`
                );
                xhttp.setRequestHeader(
                  "Content-Type",
                  "application/json;charset=UTF-8"
                );
                xhttp.setRequestHeader("Access-Token", jwt);
                xhttp.setRequestHeader("Uid", uid);
                xhttp.setRequestHeader("Client", client);
                xhttp.send();
                Swal.fire({
                  html:
                    "<span class = 'thick'>" +
                    list["name"] +
                    "</span> task deleted!",
                  icon: "success",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                });
              });
            });

            const btn_duplicate =
              document.getElementsByClassName("btn btn-warning 1")[counter];
            btn_duplicate.addEventListener("click", function () {
              document.getElementById("duplicate_label1").innerHTML =
                'Are you sure duplicate <span class = "thick">' +
                list["name"] +
                "</span> task?";
              const confirm = document.getElementById("duplicate_btn");
              confirm.addEventListener("click", function () {
                const folder_id = document.getElementById("folder_lists").value;
                const task_name = list["name"];
                const task_description = list["description"];
                xhttp.open(
                  "POST",
                  `${serverUrl}/task_lists/${folder_id}/todos`
                );
                xhttp.setRequestHeader(
                  "Content-Type",
                  "application/json;charset=UTF-8"
                );
                xhttp.setRequestHeader("Access-Token", jwt);
                xhttp.setRequestHeader("Uid", uid);
                xhttp.setRequestHeader("Client", client);
                xhttp.send(
                  JSON.stringify({
                    name: task_name,
                    description: task_description,
                  })
                );
                Swal.fire({
                  html:
                    "<span class = 'thick'>" +
                    list["name"] +
                    "</span> task duplicated!",
                  icon: "success",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                });
              });
            });

            const btn_move =
              document.getElementsByClassName("btn btn-warning 2")[counter];
            btn_move.addEventListener("click", function () {
              const confirm = document.getElementById("move_btn");
              confirm.addEventListener("click", function () {
                const oldfolder_id =
                  document.getElementById("folder_lists").value;
                const newfolder_id = movetaskfolders_list.value;
                const folder_name =
                  movetaskfolders_list.options[
                    movetaskfolders_list.selectedIndex
                  ].text;
                const task_name = list["name"];
                const task_description = list["description"];

                if (oldfolder_id == newfolder_id) {
                  Swal.fire({
                    html: "Your can't move task, please select a different folder",
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                } else {
                  const xhttp_delete = new XMLHttpRequest();
                  xhttp_delete.open(
                    "DELETE",
                    `${serverUrl}/task_lists/${selected}/todos/${list["id"]}`
                  );
                  xhttp_delete.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=UTF-8"
                  );
                  xhttp_delete.setRequestHeader("Access-Token", jwt);
                  xhttp_delete.setRequestHeader("Uid", uid);
                  xhttp_delete.setRequestHeader("Client", client);
                  xhttp_delete.send();

                  xhttp.open(
                    "POST",
                    `${serverUrl}/task_lists/${newfolder_id}/todos`
                  );
                  xhttp.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=UTF-8"
                  );
                  xhttp.setRequestHeader("Access-Token", jwt);
                  xhttp.setRequestHeader("Uid", uid);
                  xhttp.setRequestHeader("Client", client);
                  xhttp.send(
                    JSON.stringify({
                      name: task_name,
                      description: task_description,
                    })
                  );
                  Swal.fire({
                    html:
                      "<span class = 'thick'>" +
                      list["name"] +
                      "</span> task moved to <span class = 'thick'>" +
                      folder_name +
                      "</span> folder!",
                    icon: "success",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: "OK",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      location.reload();
                    }
                  });
                }
              });
            });

            const btn_edit =
              document.getElementsByClassName("btn btn-primary 1")[counter];
            btn_edit.addEventListener("click", function () {
              document.getElementById("edittask_name").value = list["name"];
              const old_name = document.getElementById("edittask_name").value;
              const confirm = document.getElementById("edit_btn");
              confirm.addEventListener("click", function () {
                const name = document.getElementById("edittask_name").value;
                const description =
                  document.getElementById("edittask_detail").value;
                if (name == "") {
                  Swal.fire({
                    text: "Oopsss",
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                } else {
                  xhttp.open(
                    "PATCH",
                    `${serverUrl}/task_lists/${selected}/todos/${list["id"]}`
                  );
                  xhttp.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=UTF-8"
                  );
                  xhttp.setRequestHeader("Access-Token", jwt);
                  xhttp.setRequestHeader("Uid", uid);
                  xhttp.setRequestHeader("Client", client);
                  xhttp.send(
                    JSON.stringify({
                      name: name,
                      description: description,
                    })
                  );
                  Swal.fire({
                    html:
                      "Task <span class = 'thick'>" +
                      old_name +
                      " </span> has been edited!",
                    icon: "success",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonText: "OK",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      location.reload();
                    }
                  });
                }
              });
            });

            const btn_completed =
              document.getElementsByClassName("btn btn-success 1")[counter];
            btn_completed.addEventListener("click", function () {
              document.getElementById("completedtask_label").innerHTML =
                "Are you sure you want to mark <span class = 'thick'>" +
                list["name"] +
                "</span> task as done?";
              const confirm = document.getElementById("completed_btn");
              confirm.addEventListener("click", function () {
                xhttp.open(
                  "PATCH",
                  `${serverUrl}/task_lists/${selected}/todos/${list["id"]}`
                );
                xhttp.setRequestHeader(
                  "Content-Type",
                  "application/json;charset=UTF-8"
                );
                xhttp.setRequestHeader("Access-Token", jwt);
                xhttp.setRequestHeader("Uid", uid);
                xhttp.setRequestHeader("Client", client);
                xhttp.send(
                  JSON.stringify({
                    done: true,
                  })
                );
                Swal.fire({
                  html:
                    "<span class = 'thick'>" +
                    list["name"] +
                    "</span> task marked completed!",
                  icon: "success",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                });
              });
            });

            const btn_share =
              document.getElementsByClassName("btn btn-info 1")[counter];
            btn_share.addEventListener("click", function () {
              const confirm = document.getElementById("share_btn");
              confirm.addEventListener("click", function () {
                const share_user = document.getElementById("users_list").value;
                const share_user_text =
                  document.getElementById("users_list").options[
                    document.getElementById("users_list").selectedIndex
                  ].text;
                xhttp.open("POST", `${serverUrl}/task_lists/${selected}/share`);
                xhttp.setRequestHeader(
                  "Content-Type",
                  "application/json;charset=UTF-8"
                );
                xhttp.setRequestHeader("Access-Token", jwt);
                xhttp.setRequestHeader("Uid", uid);
                xhttp.setRequestHeader("Client", client);
                xhttp.send(
                  JSON.stringify({
                    user_id: share_user,
                    task_list_id: list["id"],
                    description: list["name"],
                    is_write: true,
                  })
                );
                Swal.fire({
                  html:
                    "<span class = 'thick'>" +
                    list["name"] +
                    "</span> task shared to <span class = 'thick'>" +
                    share_user_text +
                    "</span>.",
                  icon: "success",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                });
              });
            });

            counter++;
          }
        }
      }
    }
  };
}

//functions for interacting with folders / new task
function addFolder() {
  let folderName = document.getElementById("addFolder_name").value;
  if (folderName == "") {
    Swal.fire({
      text: "Please give your new!",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${serverUrl}/task_lists`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Access-Token", jwt);
    xhttp.setRequestHeader("Uid", uid);
    xhttp.setRequestHeader("Client", client);
    xhttp.send(
      JSON.stringify({
        name: folderName,
      })
    );

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 201) {
          Swal.fire({
            html: "<span class = 'thick'>" + folderName + "</span>created!",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        } else {
          Swal.fire({
            text: "Something wrong!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
  }
}

function deleteFolder() {
  let selected = deletefolder_lists.value;
  let text = deletefolder_lists.options[deletefolder_lists.selectedIndex].text;
  if (selected) {
    Swal.fire({
      title: "Are you sure?",
      html:
        "You are about to delete <span class = 'thick'>" +
        text +
        "</span> Task list! <p class = thick> !!!</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        const xhttp = new XMLHttpRequest();

        xhttp.open("DELETE", `${serverUrl}/task_lists/${selected}`);
        xhttp.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        xhttp.setRequestHeader("Access-Token", jwt);
        xhttp.setRequestHeader("Uid", uid);
        xhttp.setRequestHeader("Client", client);
        xhttp.send();
        Swal.fire({
          html: "<span class = 'thick'>" + text + "</span> folder deleted!",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    });
  } else {
    Swal.fire({
      text: "Please choose folder `(*>﹏<*)′",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

function updateFolder() {
  let folder_oldname = localStorage.getItem("selectedUpdateFolderText");
  const folder_name = document.getElementById("updatefolder_name").value;
  let folder_value = updatefolder_lists.value;

  if (folder_name == "") {
    Swal.fire({
      text: "Oopsie ",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else if (folder_oldname == folder_name) {
    Swal.fire({
      html: "Your inputed name is the same",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else {
    const xhttp = new XMLHttpRequest();

    xhttp.open("PATCH", `${serverUrl}/task_lists/${folder_value}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Access-Token", jwt);
    xhttp.setRequestHeader("Uid", uid);
    xhttp.setRequestHeader("Client", client);
    xhttp.send(
      JSON.stringify({
        name: folder_name,
      })
    );

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          Swal.fire({
            html:
              "<span class = 'thick'>" +
              folder_oldname +
              "</span> Task list name updated to <span class = 'thick'>" +
              folder_name +
              "</span>!",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        } else {
          Swal.fire({
            text: "hello",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
  }
}

function addTask() {
  const task_name = document.getElementById("addTask_name").value;
  const task_description = document.getElementById("addTask_detail").value;
  let folder_value = addtaskfolders_lists.value;
  if (task_name == "") {
    Swal.fire({
      text: "Oopsie",
      icon: "error",
      confirmButtonText: "OK",
    });
  } else {
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", `${serverUrl}/task_lists/${folder_value}/todos`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Access-Token", jwt);
    xhttp.setRequestHeader("Uid", uid);
    xhttp.setRequestHeader("Client", client);
    xhttp.send(
      JSON.stringify({
        name: task_name,
        description: task_description,
      })
    );

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 201) {
          Swal.fire({
            html: "<span class = 'thick'>" + task_name + "</span> task added!",
            icon: "success",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        } else {
          Swal.fire({
            text: "Please!!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    };
  }
}

//Functions for outside of tasks
function filterStatus() {
  const filter = document.getElementById("filter_select");
  const table = document.getElementById("table");
  rows = table.getElementsByTagName("tr");

  for (i = 1, j = rows.length; i < j; ++i) {
    cells = rows[i].getElementsByTagName("td");
    if (filter.value != "all") {
      if (cells[1].innerHTML != filter.value) {
        rows[i].style.display = "none";
      } else {
        rows[i].style.display = "table-row";
      }
    } else {
      rows[i].style.display = "table-row";
    }
  }
}

function search() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function sortTableNumerically() {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("th")[0];
      y = rows[i + 1].getElementsByTagName("th")[0];
      if (dir == "asc") {
        if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTableAlphabetical(n) {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//xD
