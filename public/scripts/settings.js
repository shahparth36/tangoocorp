$("#toggle-password1").click(function() {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
    });
    
    $("#toggle-password2").click(function () {
    
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

var editButton = document.querySelector("#edit");
var email = document.querySelector("#email");
var username = document.querySelector("#username");
var phNumber = document.querySelector("#phNumber");
var profilebutton = document.querySelector("#profilebutton");
var settingsbutton = document.querySelector("#settingsbutton");
var settingsdiv = document.querySelector("#settingsdiv");
var profilediv = document.querySelector("#profilediv");
var settingsheader = document.querySelector("#settings-header");
var profileheader = document.querySelector("#profile-header");


profilebutton.addEventListener("click", () => {
  if (settingsheader.classList.contains("paclass")) {
    settingsheader.classList.remove("paclass");
    profileheader.classList.add("paclass");
    settingsdiv.style.display = "none";
    profilediv.style.display = "block";
  }
})

settingsbutton.addEventListener("click", () => {
  if (profileheader.classList.contains("paclass")) {
    profileheader.classList.remove("paclass");
    settingsheader.classList.add("paclass");
    profilediv.style.display = "none";
    settingsdiv.style.display = "inline-flex";
  }
});

editButton.addEventListener("click", (event) => {
  if (email.hasAttribute("readonly")) {
    event.preventDefault();
    email.removeAttribute("readonly");
    editButton.innerHTML = "Update Details";
  }

  if (username.hasAttribute("readonly")) {
    event.preventDefault();
    username.removeAttribute("readonly");
    editButton.innerHTML = "Update Details";
  }

  if (phNumber.hasAttribute("readonly")) {
    event.preventDefault();
    phNumber.removeAttribute("readonly");
    editButton.innerHTML = "Update Details";
  }

})



