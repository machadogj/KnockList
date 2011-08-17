var knocklist = (function () {

    var Task = function (name, completed, description, backlog) {
        this.name = ko.observable(name);
        this.completed = ko.observable(completed === true);
        this.description = ko.observable(description);
        this.backlog = backlog;
        this.complete = function () {
            this.completed(true);
        };
        this.selected = ko.observable(false);
        this.toggleSelected = function () {
            this.selected(!this.selected());
        };

        this.commit = function(){
            backlog.tasks.remove(this);
            backlog.planner.current.tasks.push(this);
        };

        this.postpone = function(){
            backlog.tasks.remove(this);
            backlog.planner.product.tasks.push(this);
        };

        this.toDto = function(){
            return {name: this.name(), completed: this.completed(), description: this.description()};
        };
        
        if (backlog){
            backlog.tasks.push(this);
        }
    };

    var NewTaskModel = function (backlog) {
        this.backlog = backlog;
        this.name = ko.observable();
        this.toTask = function () {
            return new knocklist.Task(this.name(), false, '', this.backlog);
        };
        this.clear = function () {
            this.name("");
        }
        this.save = function () {
            this.toTask();
            this.clear();
        };

        this.hasName = ko.dependentObservable(function () {
            return this.name() && this.name().length > 0;
        }, this);
    };
    
    var Backlog = function (planner) {
        this.planner = planner;
        this.tasks = ko.observableArray()
        this.pending = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) {
                return !item.completed();
            });
        }, this);
        this.completed = ko.dependentObservable(function () {
            return $.grep(this.tasks(), function (item) {
                return item.completed();
            });
        }, this);
        this.clearCompleted = function () {
            this.tasks.removeAll(this.completed());
        };
        this.clearTasks = function () {
            this.tasks([]);
        };
        this.completeVsTotal = ko.dependentObservable(function () {
            return this.completed().length + "/" + this.tasks().length;
        }, this);

        this.newTask = new knocklist.NewTaskModel(this);
    };

    var Planner = function(){
      this.product = new knocklist.Backlog(this);
      this.current = new knocklist.Backlog(this);
    };

    return { Task: Task, Backlog: Backlog, NewTaskModel: NewTaskModel, Planner: Planner };
})();
