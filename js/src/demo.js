var _employees = [];
var _employeeRecord = [];
var _totalHours = 0;
var _solutions = [];

function Employee(attr, _index){
    this._index = _index;
    this.name = attr['name'];
    this.canOpen = attr['canOpen'];
    this.minHours = attr['minHours'];
    this.maxHours = attr['maxHours'];
    this.schedule = attr['schedule'];
    this.working = 0;
    this.update = function() {
        var attr = fetch("src/employees.json")[this._index];
        this.name = attr['name'];
        this.canOpen = attr['canOpen'];
        this.minHours = attr['minHours'];
        this.maxHours = attr['maxHours'];
        this.schedule = attr['schedule'];
    };
}

function fetch(url){ 
    var data =  $.ajax({ type: 'GET', url: url, dataType: 'json', async: false });
    return data.responseJSON;
}

//perhaps rename to assignShifts
function makeShifts(list, employees){
    var queue = [];
    for(var i = 0; i < list.length - 1; i++){
        start = list[i]; 
        end = list[i + 1];
        hours = (end - start) / 60; 
        queue[i] = {'start':start,'end':end, 'employees':[], 'hours':hours};
        for(var j = 0; j < employees.length; j++){
            var name = employees[j].name;
            if (overlap(queue[i], employees[j]))
                queue[i]['employees'].push(name);
        }
    }
    return queue;
}


//sorts and returns unique shift divisions already bounded by the store's opening and closing
function uniqueShiftList(employees, store){
    var shifts = [[],[],[],[],[],[],[]];
    for (var day = 0; day < 7; day++) {
       for (var person = 0; person < employees.length; person++) { 
           //flatten multiple shifts for a person in a day
           employees[person].schedule[day] = _.flatten(employees[person].schedule[day]);
           for (var part = 0; part < employees[person].schedule[day].length; part++) {
               var scale = day * 24 * 60;
               var time = employees[person].schedule[day][part] + scale;
               var storeOpen = store.schedule[day][0] + scale;
               var storeClose = store.schedule[day][1] + scale;
               if (time > storeOpen && time < storeClose) 
                    shifts[day].push(time);
               shifts[day].push(storeOpen);
               shifts[day].push(storeClose);
           }
       }
    }
    
    //document/refactor
    return _.map(shifts, function(list){ return _.uniq(list.sort(function(a,b){return a - b;}), true);});
}  

function overlap(shift, employee) {
    var avg = (shift.start + shift.end)/2;
    var day = Math.floor(shift.start / ( 60 * 24));
    var scale = day * 24 * 60;

    for (var i = 0; i < employee.schedule.length; i++) {
        var pair = employee.schedule[day];
        if (avg <= (pair[1] + scale) && avg >= (pair[0] + scale))
            return true;
       
    }
    return false;
}

function getIndexOfName(list, name){
    for (var i = 0; i < list.length; i++) {
        if (list[i].name == name)
            return i;
    }
    return -1;
}

function schedule(queue, employees, index, solutions) {
    if (index == queue.length) {
        _employeeRecord = employees;
        _solutions.push(solutions);
        return solutions;
    }

    var shift = queue[index];
    
    for (var i = 0; i < shift.employees.length; i++) { 
            //if employee can take hours add him
            if (employees[i]['working'] + shift.hours <= employees[i]['maxHours']) {
                var copySol = solutions.slice(0);
                var copyEmp = employees.slice(0);
                var copyQue = queue.slice(0);
                copySol.push(shift); 
                copyQue[index]['scheduled'] = shift.employees[i];
                copyEmp[i]['working'] += shift.hours;
                schedule(copyQue, copyEmp, index + 1, copySol);
            } else { 
                console.log(employees[i]['name'] + " could not work: " + shift.hours);
                console.log("they are at: " + employees[i]['working'] + " with max: " + employees[i].maxHours);
            } 
    }

    return solutions;
}

(function(){
    console.log("welcome to scheduler");
    var employees = fetch("src/employees.json");
    var store = fetch("src/store.json");
    var shifts = uniqueShiftList(employees, store);

    //build queue of shift objects
    var queue = _.map(shifts, function(list){ return makeShifts(list,employees);})
    queue = _.sortBy(_.flatten(queue), function(data) { return data.employees.length;});

    //initialize employees
    for (var i = 0; i < employees.length; i++) {
            _employees.push(new Employee(employees[i],i));
    } 


    solutions = schedule(queue,_employees, 0, []);
    console.log(_employeeRecord);
    console.log(_solutions);
    for(var i = 0; i < _employeeRecord.length; i++) {

        _totalHours += _employeeRecord[i].working;
    }
    console.log("Total Hours: " + _totalHours);
    console.log("Minimum Coverage: " + store.maxHours);
})();
