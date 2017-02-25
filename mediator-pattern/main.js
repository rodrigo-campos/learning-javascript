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

var task1 = new Task({
    name: 'Buy some apples',
    user: 'Rodrigo'
});

var mediator = (function() {
    var channels = {};

    var subscribe = function(channel, context, callback) {
        if(!mediator.channels[channel]) {
            mediator.channels[channel] = [];
        }

        mediator.channels[channel].push({
            context: context,
            callback: callback
        });
    };

    var publish = function(channel) {
        if (!mediator.channels[channel]) {
            return false;
        }

        var args = [].slice.call(arguments, 1);

        for(var i = 0; i < mediator.channels[channel].length; i++) {
            var sub = mediator.channels[channel][i];
            sub.callback.apply(sub.context, args);
        }

        return true;
    };

    return {
        channels: channels,
        subscribe: subscribe,
        publish: publish
    };

})();


var not = new notificationService();
var audit = new auditingService();
var log = new loggingService();

mediator.subscribe('complete', not, not.update);
mediator.subscribe('complete', audit, audit.update);
mediator.subscribe('complete', log, log.update);

task1.complete = function() {
    mediator.publish('complete', this);
    Task.prototype.complete.call(this);
};

task1.complete();
task1.save();
