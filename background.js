let time = 600; //預設10分鐘
let obj = { live: false, currMin: 10, currSec: null };
function checkLive() {
  if (!obj.live) {
    fetch(
      "https://api-vfan.vlive.tv/v2/channel.984/home?gcc=TW&locale=zh_tw&app_id=8c6cc7b45d2568fb668be6e05b6e5a3b&on_complete=redirect_to_location&debug=true&next=&limit=20&boardIds=1977&mediaChannel=false&_=1596423385290"
    )
      .then((res) => res.text())
      .then((res) => {
        let data = JSON.parse(res).contentList;
        if (data[0].videoType == "LIVE") {
          obj.live = true;
          window.open("https://channels.vlive.tv/C1B7AF/home");
          clearInterval(checkInterval);
        }
      });
  }
}
let checkInterval = setInterval(checkLive, time * 1000);

//當點擊icon
chrome.extension.onConnect.addListener(function (port) {
  //傳送到popup.js
  port.postMessage(obj);
  //接收來自popup.js的資料
  port.onMessage.addListener(function (res) {
    clearInterval(checkInterval);
    obj.live = false;
    time = res.time;
    obj.currMin = res.currMin;
    obj.currSec = res.currSec;
    if (obj.currMin == 0) obj.currMin = null;
    if (obj.currSec == 0) obj.currSec = null;
    checkInterval = setInterval(checkLive, time * 1000);
  });
});
