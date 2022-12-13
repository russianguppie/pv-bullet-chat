(() => {
  let opacity;
  let $iframe;
  let url = window.location.href;
  let src = chrome.extension.getURL("ui.html");
  window.addEventListener("message", function (e) {
    if (event.origin !== src.substring(0, src.length - "/ui.html".length)) {
      console.log("expect origin: " + src);
      console.log("unknow origin: " + event.origin);
      return;
    }
    switch (e.data["type"]) {
      case "opacity":
        opacity = e.data["value"];
        break;
      default:
        console.log("unknown data type");
    }
  });

  chrome.extension.onMessage.addListener(function (msg, sender, sendRes) {
    console.log(msg);
    switch (msg.type) {
      case "active":
        if ($("#bullet-frame").length !== 0) {
          break;
        }
        $iframe = $("<iframe>")
          .prop("src", src + "?url=" + url)
          .prop("id", "bullet-frame")
          .css({
            border: 0,
            position: "fixed",
            height: "500px",
            width: "300px",
            right: "-240px",
            bottom: "5%",
            "z-index": 20000,
          })
          .appendTo("body");
        $iframe.animate({ right: "1%" }, 600);
        break;
      case "pending":
        if ($("#bullet-frame").length === 0) {
          break;
        }
        $iframe.animate({ right: -$iframe.width() }, function () {
          $iframe.remove();
        });
        break;
      case "shot":
        shoot(msg.bullet);
        break;
      default:
        console.log(`unknow message type: ${msg.type}`);
    }
  });

  function sanitize(str) {
    if (sanitize.escape === undefined) {
      sanitize.escape = $("<textarea>")[0];
    }
    sanitize.escape.textContent = str;
    return sanitize.escape.innerHTML;
  }

  function shoot(bullet) {
    let $bullet = $("<span>")
      .prop("class", "bullet")
      .text(sanitize(bullet["content"]))
      .css({
        position: "fixed",
        top: bullet["position"],
        color: bullet["color"],
        "font-size": `${bullet["size"]}rem`,
        opacity: opacity,
        "white-space": "nowrap",
        "z-index": 10000,
      })
      .appendTo("body");
    $bullet.css({ right: -Math.floor(1.25 * $bullet.width()) + "px" });
    $bullet.animate(
      { right: "100%" },
      bullet["duration"],
      "linear",
      function () {
        $(this).remove();
      }
    );
  }
})();
