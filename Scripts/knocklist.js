var knocklist = (function () {

    var Task = function (name, status, description) {
        this.name = ko.observable(name);
        this.status = (status !== undefined) ? ko.observable(status) : ko.observable("pending");
        this.description = ko.observable(description);
        this.complete = function () { this.status("complete"); };
    };

    var NewTaskModel = function (backlog) {
            this.backlog = backlog;
            this.name = ko.observable();
            this.toTask = function () {
                return new knocklist.Task(this.name());
            };
            this.clear = function () {
                this.name("");
            }
            this.save = function () {
                backlog.tasks.push(this.toTask());
                this.clear();
            };

            this.hasName = ko.dependentObservable(function(){
                return this.name() && this.name().length > 0;
            }, this);
        };

    var Backlog = function () {

        this.tasks = ko.observableArray()
        this.pending = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) { return item.status() === "pending"; });
        }, this);
        this.completed = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) { return item.status() === "completed"; });
        }, this);
        this.cleanCompleted = function () {
            var nonCompletedTasks = $.grep(this.tasks(), function (t) { t.status() !== "completed"; });
            this.tasks(nonCompletedTasks);
        };
        this.clearTasks = function () {
            this.tasks([]);
        };

        this.newTask = new knocklist.NewTaskModel(this);
        
    }

    return { Task: Task, Backlog: Backlog, NewTaskModel: NewTaskModel };
})();
