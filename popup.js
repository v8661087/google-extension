var port = chrome.extension.connect({
  name: "Sample Communication",
});

let max = 60;
let minute = document.getElementById("minute");
minute.addEventListener("input", function () {
  minute.value = minute.value.replace(/\D|^0/, "");
  if (minute.value > max) minute.value = max;
});

let second = document.getElementById("second");
second.addEventListener("input", function () {
  second.value = second.value.replace(/\D|^0/, "");
  if (second.value > max) second.value = max;
});

let status = document.getElementById("status");
let freq = document.getElementById("freq");

let button = document.getElementById("button");
button.addEventListener("click", function () {
  if (minute.value && second.value) {
    freq.innerText = `每${minute.value}分${second.value}秒檢查一次`;
  } else if (minute.value && !second.value) {
    freq.innerText = `每${minute.value}分鐘檢查一次`;
  } else if (!minute.value && second.value) {
    freq.innerText = `每${second.value}秒檢查一次`;
  } else {
    minute.value = 10;
    second.value = null;
    freq.innerText = "每10分鐘檢查一次";
  }
  status.innerText = "啟動中";
  let time = +minute.value * 60 + +second.value;
  currMin = +minute.value;
  currSec = +second.value;
  let obj = { time, currMin, currSec };
  port.postMessage(obj);
});
//接收background.js
port.onMessage.addListener(function (obj) {
  minute.value = obj.currMin;
  second.value = obj.currSec;
  if (obj.live) {
    status.innerText = "暫停中";
    freq.innerText = "";
  } else {
    status.innerText = "啟動中";
    if (minute.value && second.value) {
      freq.innerText = `每${minute.value}分${second.value}秒檢查一次`;
    } else if (minute.value && !second.value) {
      freq.innerText = `每${minute.value}分鐘檢查一次`;
    } else if (!minute.value && second.value) {
      freq.innerText = `每${second.value}秒檢查一次`;
    } else {
      minute.value = 10;
      second.value = null;
      freq.innerText = "每10分鐘檢查一次";
    }
  }
});
