$(function() {
$(window).scroll(function () {
if ($(this).scrollTop() > 40) {
 $(".moveRight").addClass("ScrollEffektRight").removeClass("firstPosition")
 $(".moveLeft").addClass("ScrollEffektLeft").removeClass("firstPosition")
 $(".removeClick").prop("onclick", null).off("click");
}
if ($(this).scrollTop() < 40) {
 $(".moveRight").removeClass("ScrollEffektRight").addClass("firstPosition")
 $(".moveLeft").removeClass("ScrollEffektLeft").addClass("firstPosition")
}
if ($(this).scrollTop() > 100) {
 $(".Hjem_GridInformasjon").removeClass("HiddenEffekt")
}
if ($(this).scrollTop() < 100) {
 $(".Hjem_GridInformasjon").addClass("HiddenEffekt")
}
});
});
