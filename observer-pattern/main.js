var Task = require('./task');

var notificationService = function () {
    var message = 'Notifying ';
    this.update = function (task) {
        console.log(message + task.user + ' for task ' + task.name);
    };
};

var loggingService = function () {
    var message = 'Logging ';
    this.update = function (task) {
        console.log(message + task.user + ' for task ' + task.name);
    };
};

var auditingService = function () {
    var message = 'Auditing ';
    this.update = function (task) {
        console.log(message + task.user + ' for task ' + task.name);
    };
};

function ObserverList() {
    this.observerList = [];
};

ObserverList.prototype.add = function(obj) {
    return this.observerList.push(obj);
};

ObserverList.prototype.get = function(index) {
    if(index > -1 && index < this.observerList.length) {
        return this.observerList[index];
    }
    return false;
};

ObserverList.prototype.count = function() {
    return this.observerList.length;
};

ObserverList.prototype.removeAt = function(index) {
    this.observerList.splice(index, 1);
};

ObserverList.prototype.indexOf = function(obj, startIndex) {
    for(var i = startIndex; i < this.observerList.length; i++) {
        if (this.observerList[i] === obj)
            return i;
    }

    return -1;
};

var ObservableTask = function(data) {
    Task.call(this, data);
    this.observers = new ObserverList();
};

ObservableTask.prototype.addObserver = function(observer) {
    this.observers.add(observer);
};

ObservableTask.prototype.removeObserver = function(observer) {
    this.observers.removeAt(this.observers.indexOf(observer, 0));
};

ObservableTask.prototype.notify = function(context) {
    var observerCount = this.observers.count();

    for(var i = 0; i < observerCount; i++) {
        var fn = this.observers.get(i);

        if(typeof(fn) === "function") {
            fn(context);
        }
    }
};

ObservableTask.prototype.save = function() {
    this.notify(this);
    Task.prototype.save.call(this);
};

var task1 = new ObservableTask({
    name: 'Buy some apples',
    user: 'Rodrigo'
});

var not = new notificationService();
var audit = new auditingService();
var log = new loggingService();

task1.addObserver(not.update);
task1.addObserver(audit.update);
task1.addObserver(log.update);

task1.save();

task1.removeObserver(audit.update);

task1.save();
