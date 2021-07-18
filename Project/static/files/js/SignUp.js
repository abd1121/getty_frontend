const signUpBtn = document.getElementById("signup-Btn");
const uidField = document.getElementById("uid");
const password = document.getElementById("createPassword");
const confirmPassword = document.getElementById("confirmPassword");
const passToolTip = document.getElementById("passwordToolTip");
const cPassToolTip = document.getElementById("cPassWordToolTip");
const showPass = document.getElementById("showPass");
const showCPass = document.getElementById("showCPass");

signUpBtn.addEventListener("click", (event) => {
  signUpButtonClick(event);
});

showPass.addEventListener("click", () => togglePasswordView(password));

showCPass.addEventListener("click", () => togglePasswordView(confirmPassword));

function signUpButtonClick(e) {
  e.preventDefault();

  // Validations
  if (password.value.length < 8) {
    passToolTip.style.color = "red";
    passToolTip.style.opacity = 1;
  } else {
    passToolTip.style.color = "#0d2a52";
    passToolTip.style.opacity = 0.4;
  }
  if (confirmPassword.value !== password.value) {
    cPassToolTip.innerHTML = "Passwords don't match";
    cPassToolTip.style.color = "red";
    cPassToolTip.style.opacity = 1;
  } else {
    cPassToolTip.innerHTML = "Minimum 8 Characters";
    cPassToolTip.style.color = "#0d2a52";
    cPassToolTip.style.opacity = 0.4;
  }
}

const togglePasswordView = (Field) => {
  // Toggle the visibility of passwords
  if (Field.type === "password") {
    Field.type = "text";
  } else {
    Field.type = "password";
  }
};

function uploadImage() {}
