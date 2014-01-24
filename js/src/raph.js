var sched_elem = $("#schedule");
var maxWidth = window.innerWidth;
var maxHeight = 900;
var dx = maxWidth / 7;
var shifts = _solutions[1];
var paper = Raphael(document.getElementById('schedule'), 0, 0, maxWidth, maxHeight);
paper.setViewBox(0,0,maxWidth,maxHeight,true);
var svg = document.querySelector("svg");
svg.removeAttribute("width");
svg.removeAttribute("height");
function shiftToRect(shift) {
   var day = Math.floor(shift.start / ( 60 * 24));
   var x = day * dx;
   var open = store.schedule[day][0];
   var close = store.schedule[day][1];
   var scale = day * 24 * 60;
   var start = shift.start - scale - open;
   var end = start + shift.end - shift.start;
   var ratio = maxHeight / close;
   var x = day * dx;
   var width = dx;
   var y = start * ratio;
   var height = end * ratio - y;
   return {x: x, y: y, width: width, height: height};
};

for (var i = 0; i < shifts.length; i++) {
   var shift = shifts[i];
   var rect = shiftToRect(shift);
   var r = paper.rect(rect.x, rect.y, rect.width, rect.height);
   paper.text(rect.x + rect.width / 2,rect.y + rect.height / 2,shift.scheduled).attr("font","12px Arial").attr("fill","#ffffff");
   r.attr("fill", "#f00");
   r.attr("stroke", "#fff");
}
