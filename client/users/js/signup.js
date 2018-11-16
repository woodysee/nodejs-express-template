const submitBtnEl = document.getElementById("submit-btn");

function submitSignup() {
  const data = JSON.stringify({
    "name": {
      "first": document.querySelector("#signup-form input[name=firstName]").value,
      "last": document.querySelector("#signup-form input[name=lastName]").value,
      "alias": document.querySelector("#signup-form input[name=alias]").value
    },
    "contact": {
      "email": document.querySelector("#signup-form input[name=email]").value
    },
    "password": document.querySelector("#signup-form input[name=password]").value
  });
  console.log(data);
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  xhr.open("POST", "/users/api");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}
submitBtnEl.addEventListener("click", submitSignup);