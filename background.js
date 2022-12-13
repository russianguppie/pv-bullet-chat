var socket = io("http://localhost:3000");

function update(tabId, state) {
  chrome.pageAction.setIcon({ path: `icons/48x48_${state}.png`, tabId: tabId });
  chrome.tabs.sendMessage(tabId, { type: state });
}

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

socket.on("bullet", function (msg) {
  console.log(`got a bullet: ${JSON.stringify(msg)}`);
  delegateBullet(msg);
});
