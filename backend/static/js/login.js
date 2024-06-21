(function () {
  "use strict";

  window.onload = function () {
    function onError(err) {
      let errorBox = document.querySelector("#error-box");
      errorBox.innerHTML = err;
      errorBox.style.visibility = "visible";
    }

    function submit() {
      if (document.querySelector("form").checkValidity()) {
        const username = document.querySelector("form [name=username]").value;
        const password = document.querySelector("form [name=password]").value;
        const action = document.querySelector("form [name=action]").value;
        apiService[action](username, password).then(function (res) {
          if (res.error) return onError(res.error);
          window.location.href = "/";
        });
      }
    }

    document.querySelector("#signin").addEventListener("click", function (e) {
      document.querySelector("form [name=action]").value = "signin";
      submit();
    });

    document.querySelector("#signup").addEventListener("click", function (e) {
      document.querySelector("form [name=action]").value = "signup";
      submit();
    });

    document.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault();
    });
  };
})();
