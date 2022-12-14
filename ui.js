const MAX_HISTORY_SIZE = 5;
const USR_MYSELF = 'Me'

$(document).on("click", ".bullet-open-advanced", function () {
  $(this).val($(this).val() == "-" ? "+" : "-");
  $(".bullet-advanced").slideToggle();
});

$(document).on("click", ".bullet-open-history", function () {
  $(".bullet-history").slideToggle();
});

function showBulletChatHistory(usr) {
  const bulletValue = $('#bullet').val()
  const p = document.createElement("p");
  const userName = document.createElement("span");
  userName.innerHTML = usr + ': ';
  const bulletSpan = document.createElement("span");
  bulletSpan.innerHTML = bulletValue;
  p.style.lineHeight = '0';

  // Different user will show different color.
  if (usr === 'Me') {
    console.log("yes, it is me");
    userName.style.color = 'red';
    bulletSpan.style.color = 'greenyellow';
  } else {
    console.log("no, it is not me");
    userName.style.color = 'cornflowerblue';
    bulletSpan.style.color = 'chocolate';
  }

  p.appendChild(userName);
  p.appendChild(bulletSpan);
  var historyLine = document.getElementById("historyLine");
  historyLine.appendChild(p);

  if (historyLine.childElementCount > MAX_HISTORY_SIZE) {
    var firstChild = historyLine.firstElementChild;
    historyLine.removeChild(firstChild);
  }
}

function isYoutube() {
  let url = window.location.href;
  return url.includes("youtube.com");
}

function objectifyForm(formArray) {
  let obj = {};
  for (let i = 0; i < formArray.length; i++) {
    obj[formArray[i]["name"]] = formArray[i]["value"];
  }
  return obj;
}

function getRandomArbitrary(max, min) {
  return Math.random() * (max - min) + min;
}

const obj = {Top: [0.3, 0.1], Middle: [0.6, 0.4], Bottom: [1, 0.8], Random: [1, 0]};
const positionMap = new Map(Object.entries(obj));
$(document).on("submit", ".bullet-gun", function () {
  showBulletChatHistory(USR_MYSELF);
  console.log($(this).serializeArray());

  let bullet = objectifyForm($(this).serializeArray());
  let duration = 5000 + Math.floor(Math.random() * 5000);
  let size = bullet["size"];
  let positionList = positionMap.get(bullet["positionPreference"].toString());
  let random = getRandomArbitrary(positionList[0], positionList[1]) * 0.85 + 0.05
  let isYoutubeWeb = isYoutube();
  bullet["position"] = isYoutubeWeb ? `calc((85% -${size}rem) * ${random})`: `calc((100% - ${size}rem) * ${random})`;
  bullet["duration"] = duration;
  chrome.runtime.sendMessage({
    type: "bullet-shot",
    bullet: bullet,
  });
  $(this).find('input[name="content"]').val('');
  event.preventDefault();
});

$(document).on("input", 'input[name="opacity"]', function () {
  let opacity = $(this).val();
  $(this).next(".tooltiptext").text(`Opacity (${opacity})`);
});

function parentURL() {
  let url = window.location.href;
  return url.substring(url.indexOf("?url=") + "?url=".length);
}

$(document).on("change", 'input[name="opacity"]', function () {
  window.parent.postMessage(
    { type: "opacity", value: $(this).val() },
    parentURL()
  );
});

$(document).ready(function () {
  $('input[name="target"]').val(parentURL());
});
