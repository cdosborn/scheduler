var sched_elem = $("#schedule");
var maxWidth = window.innerWidth;
var maxHeight = 900;
var _solutionsIndex = 0;
var dx = maxWidth / 7;
var paper = Raphael(document.getElementById('schedule'), 0, 0, maxWidth, maxHeight);

    //allows for scaling
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
}

function draw(index) {
    var shifts = _solutions[index];
    for (var i = 0; i < shifts.length; i++) {
       var shift = shifts[i];
       var rect = shiftToRect(shift);
       var r = paper.rect(rect.x, rect.y, rect.width, rect.height);
       paper.text(rect.x + rect.width / 2,rect.y + rect.height / 2,shift.scheduled + " " + i).attr("font","12px Arial").attr("fill","#000");
       r.attr("fill", "#fff");
       r.attr("stroke", "#000");
    }
}

function redraw(index) {
    paper.clear();
    draw(index);
} 

function next() {
    if (_solutionsIndex == _solutions.length)
        _solutionsIndex = 0;
    redraw(_solutionsIndex);
    console.log(_solutionsIndex);
    _solutionsIndex++;
}

next();
