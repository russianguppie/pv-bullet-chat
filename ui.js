const MAX_HISTORY_SIZE = 5;

$(document).on("click", ".bullet-open-advanced", function () {
  $(this).val($(this).val() == "-" ? "+" : "-");
  $(".bullet-advanced").slideToggle();
});

$(document).on("click", ".bullet-open-history", function () {
  $(this).val($(this).val() == "N" ? "H" : "N");
  $(".bullet-history").slideToggle();
});

function showBulletChatHistory() {
  const bulletValue = $('#bullet').val()
  const p = document.createElement("p");
  const userName = document.createElement("span");
  userName.innerHTML = "Me: ";
  userName.style.color = 'red';
  const bulletSpan = document.createElement("span");
  bulletSpan.innerHTML = bulletValue;
  bulletSpan.style.color = 'greenyellow';
  p.style.lineHeight = '0';

  p.appendChild(userName);
  p.appendChild(bulletSpan);
  var historyLine = document.getElementById("historyLine");
  historyLine.appendChild(p);

  if (historyLine.childElementCount > MAX_HISTORY_SIZE) {
    var firstChild = historyLine.firstElementChild;
    historyLine.removeChild(firstChild);
  }
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

const obj = {Top: [0.3, 0], Middle: [0.65, 0.3], Bottom: [1, 0.65], Random: [1, 0]};
const positionMap = new Map(Object.entries(obj));
$(document).on("submit", ".bullet-gun", function () {
  showBulletChatHistory();
  console.log($(this).serializeArray())
  let bullet = objectifyForm($(this).serializeArray());
  let duration = 5000 + Math.floor(Math.random() * 5000);
  let size = bullet["size"];
  let positionList = positionMap.get(bullet["positionPreference"].toString());
  let random = getRandomArbitrary(positionList[0], positionList[1]) * 0.85 + 0.05
  bullet["position"] = `calc((100% - ${size}rem) * ${random})`;
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
