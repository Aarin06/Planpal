(function () {
  "use strict";

  function onError(err) {
    console.error("[error]", err);
    let errorBox = document.querySelector("#error-box");
    errorBox.innerHTML = err;
    // Rewrite this to use a 'hidden' class instead.
    errorBox.style.visibility = "visible";
  }

  function updateVotes(message) {
    document.querySelector("#msg" + message.id + " .upvote-icon").innerHTML =
      message.upvote;
    document.querySelector("#msg" + message.id + " .downvote-icon").innerHTML =
      message.downvote;
  }

  let updateMessages = function () {
    document.querySelector("#messages").innerHTML = "";
    apiService.getMessages(0).then(function (response) {
      if (response.error) return onError(response.error);
      response.messages.forEach(function (message) {
        var elmt = document.createElement("div");
        elmt.className = "row message align-items-center";
        elmt.id = "msg" + message.id;
        elmt.innerHTML = `
            <div class="col-1 message-user">
              <img
                class="message-picture"
                src="/users/${message.UserId}/profile/picture"
                alt="${message.username}"
              />
              <div class="message-username">${message.User.username}</div>
            </div>
            <div class="col-auto message-content">
              ${message.content}
            </div>
            <div class="col-1 upvote-icon icon">${message.upvote}</div>
            <div class="col-1 downvote-icon icon">${message.downvote}</div>
            <div class="col-1 delete-icon icon"></div>
        `;
        elmt
          .querySelector(".delete-icon")
          .addEventListener("click", function () {
            apiService.deleteMessage(message.id).then(function (res) {
              if (res.error) return onError(res.error);
              return updateMessages();
            });
          });
        elmt
          .querySelector(".upvote-icon")
          .addEventListener("click", function () {
            apiService.upvoteMessage(message.id).then(function (res) {
              if (res.error) return onError(res.error);
              return updateVotes(res);
            });
          });
        elmt
          .querySelector(".downvote-icon")
          .addEventListener("click", function () {
            apiService.downvoteMessage(message.id).then(function (res) {
              if (res.error) return onError(res.error);
              return updateVotes(res);
            });
          });
        document.querySelector("#messages").prepend(elmt);
      });
    });
  };

  window.addEventListener("load", function () {
    apiService.getUsername().then((res) => {
      document.querySelector("#signin-button").style.visibility = res.username
        ? "hidden"
        : "visible";
      document.querySelector("#signout-button").style.visibility = res.username
        ? "visible"
        : "hidden";
      document.querySelector("#create-message-form").style.visibility =
        res.username ? "visible" : "hidden";
      if (res.username) {
        updateMessages();
        document
          .querySelector("#create-message-form")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            var username = document.querySelector("#post-username").value;
            var content = document.querySelector("#post-content").value;
            document.getElementById("create-message-form").reset();
            apiService.addMessage(username, content).then(function (res) {
              if (res.error) return onError(res.error);
              return updateMessages();
            });
          });
      }
    });
  });
})();
