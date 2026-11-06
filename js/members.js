(function () {
  "use strict";

  var root = document.getElementById("member-directory");
  if (!root) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeHandle(raw) {
    var handle = String(raw == null ? "" : raw).trim();
    if (!handle) return "";
    if (handle.charAt(0) === "@") handle = handle.slice(1);
    handle = handle.replace(/^https?:\/\/(www\.)?x\.com\//i, "");
    handle = handle.replace(/^https?:\/\/(www\.)?twitter\.com\//i, "");
    handle = handle.split(/[/?#]/)[0];
    return handle;
  }

  function initialFor(name) {
    var trimmed = String(name || "").trim();
    if (!trimmed) return "?";
    return trimmed.charAt(0).toUpperCase();
  }

  function emptyState() {
    return (
      '<p class="members-empty">' +
      "No members listed yet. Join and tick " +
      '"List me in the member directory" to appear here. ' +
      '<a href="/join">Join the club</a>.' +
      "</p>"
    );
  }

  function cardHtml(member) {
    var name = String(member.name || "").trim() || "Member";
    var boat = String(member.boat || "").trim();
    var location = String(member.location || "").trim();
    var handle = normalizeHandle(member.x);
    var photo = String(member.photo || "").trim();
    var initial = initialFor(name);

    var media =
      '<div class="member-media">' +
      '<div class="member-avatar" aria-hidden="true">' +
      escapeHtml(initial) +
      "</div>";
    if (photo) {
      media +=
        '<img class="member-photo" src="' +
        escapeHtml(photo) +
        '" alt="" loading="lazy" width="320" height="320">';
    }
    media += "</div>";

    var meta = "";
    if (boat) {
      meta +=
        '<p class="member-boat"><span class="member-label">Boat</span> ' +
        escapeHtml(boat) +
        "</p>";
    }
    if (location) {
      meta +=
        '<p class="member-location"><span class="member-label">Sails</span> ' +
        escapeHtml(location) +
        "</p>";
    }
    if (handle) {
      meta +=
        '<p class="member-x"><span class="member-label">X</span> ' +
        '<a href="https://x.com/' +
        encodeURIComponent(handle) +
        '" rel="noopener noreferrer">@' +
        escapeHtml(handle) +
        "</a></p>";
    }

    return (
      '<article class="member-card">' +
      media +
      '<div class="member-body">' +
      "<h2>" +
      escapeHtml(name) +
      "</h2>" +
      meta +
      "</div>" +
      "</article>"
    );
  }

  function wirePhotoFallbacks(scope) {
    var photos = scope.querySelectorAll(".member-photo");
    for (var i = 0; i < photos.length; i++) {
      (function (img) {
        function hideBroken() {
          img.classList.add("is-broken");
        }
        img.addEventListener("error", hideBroken);
        if (img.complete && img.naturalWidth === 0) hideBroken();
      })(photos[i]);
    }
  }

  function render(members) {
    if (!Array.isArray(members) || members.length === 0) {
      root.innerHTML = emptyState();
      root.setAttribute("data-state", "empty");
      return;
    }
    root.innerHTML =
      '<div class="member-grid" aria-label="Member directory">' +
      members.map(cardHtml).join("") +
      "</div>";
    root.setAttribute("data-state", "ready");
    wirePhotoFallbacks(root);
  }

  function fail(message) {
    root.innerHTML =
      '<p class="members-empty" role="alert">' + escapeHtml(message) + "</p>";
    root.setAttribute("data-state", "error");
  }

  fetch("/members.json", { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load members.json (" + response.status + ")");
      }
      return response.json();
    })
    .then(render)
    .catch(function () {
      fail("Could not load the member directory right now. Try again later.");
    });
})();
