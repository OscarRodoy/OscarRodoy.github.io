$(function() {
$(window).scroll(function () {
if ($(this).scrollTop() > 130) {
 $(".Hjem_GridInformasjon").removeClass("HiddenEffekt")
 $(".UnderOverskrift").removeClass("HiddenEffekt")
}
if ($(this).scrollTop() < 130) {
 $(".Hjem_GridInformasjon").addClass("HiddenEffekt")
 $(".UnderOverskrift").addClass("HiddenEffekt")
}
});
});
