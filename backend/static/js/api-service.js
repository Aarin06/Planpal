const apiService = (function () {
  "use strict";

  const module = {};

  module.addMessage = function (username, content) {
    return fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, content: content }),
    }).then((res) => res.json());
  };

  module.deleteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  module.upvoteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upvote" }),
    }).then((res) => res.json());
  };

  module.downvoteMessage = function (messageId) {
    return fetch(`/api/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "downvote" }),
    }).then((res) => res.json());
  };

  module.getMessages = function (page = 0) {
    return fetch(`/api/messages?page=${page}`).then((res) => res.json());
  };

  module.getUsername = function () {
    return fetch(`/users/me`).then((res) => res.json());
  };

  module.signin = function (username, password) {
    return fetch("/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.signup = function (username, password) {
    return fetch("/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  return module;
})();
