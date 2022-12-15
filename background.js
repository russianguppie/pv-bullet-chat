var socket = io("http://localhost:3000");

function update(tabId, state) {
  chrome.pageAction.setIcon({path: `icons/48x48_${state}.png`, tabId: tabId});
  chrome.tabs.sendMessage(tabId, {type: state});
}

chrome.commands.onCommand.addListener(function (command) {
  if (command === "random") {
    const size = Math.floor(Math.random() * 5);
    const testBullet = {
      color: getRandomColor(),
      content: getRandomMessage(),
      duration: 5000 + Math.floor(Math.random() * 2000),
      opacity: "1",
      position: `calc((100% - ${size}rem) * ${Math.random() * 0.85 + 0.05})`,
      size: size
    }
    socket.emit("bullet", testBullet);
    delegateBullet(testBullet);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
  tabState[tabId] = 0;
  //update(tabId, "pending"); Let's just keep the extension active
});

var tabState = {};
chrome.pageAction.onClicked.addListener(function (tab) {
  tabState[tab.id] ^= 1;
  let state = ["pending", "active"][tabState[tab.id]];
  update(tab.id, state);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendRes) {
  switch (msg.type) {
    case "bullet-shot":
      socket.emit("bullet", msg.bullet);
      delegateBullet(msg.bullet);
      break;
    default:
      alert(
        `unknow request: ${JSON.stringify(msg)} from sender ${JSON.stringify(
          sender
        )}`
      );
  }
});

function delegateBullet(bullet) {
  chrome.tabs.query({ url: bullet["target"] }, function (tabs) {
    console.log("bullet" + bullet)
    console.log(tabs);
    for (let tab of tabs) {
      if (tabState[tab.id]) {
        console.log("sending to tab");
        chrome.tabs.sendMessage(tab.id, {
          type: "shot",
          bullet: bullet,
        });
      }
    }
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomMessage() {
  const hypeMessages = [
    "Wow!",
    "Unreal!",
    "Insane!",
    "Sick play!",
    "OMG!",
    "WTF?!",
    "Amazing!",
    "Incredible!",
    "Mind blown!",
    "That's crazy!",
    "What a move!",
    "Wowzers!",
    "Best play ever!",
    "Go team go!",
    "Hoo-rah!",
    "Yes!",
    "Whoa!",
    "Boom!",
    "Awesome!",
    "Yay!"
  ];
  return hypeMessages[Math.floor(Math.random() * hypeMessages.length)];
}

socket.on("bullet", function (msg) {
  console.log(`got a bullet: ${JSON.stringify(msg)}`);
  delegateBullet(msg);
});
