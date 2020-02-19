var countDown = document.getElementById("countDown");
var days = Number(0);
var hours = Number(1);
var minutes = Number(0);
var seconds = Number(35);
if (days < 10) {days = "0" + days;};
if (hours < 10) {hours = "0" + hours;};
if (minutes < 10) {minutes = "0" + minutes;};
if (seconds < 10) {seconds = "0" + seconds;};
countDown.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
var time = Number((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + (seconds));
window.onload = function(){
  setInterval(function(){
    time -= 1;
    days = Math.floor(time / (24*60*60));
    hours = Math.floor(time / (60*60));
    minutes = Math.floor(time / 60);
    seconds = time % 60;

    if (hours > 0) {minutes -= hours*60;};
    if (days > 0) {hours -= days*24;};

    if (days < 10) {days = "0" + days;};
    if (hours < 10) {hours = "0" + hours;};
    if (minutes < 10) {minutes = "0" + minutes;};
    if (seconds < 10) {seconds = "0" + seconds;};
    countDown.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
  }, 1000);
};
