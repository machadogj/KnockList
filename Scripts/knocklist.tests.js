/// <reference path="jquery-1.6.2.js" />
/// <reference path="knockout-1.2.1.js" />
/// <reference path="qunit.js" />
/// <reference path="knocklist.js" />

module("tasks");
test("when creating a task, it is not completed.", function () {
    var t = new knocklist.Task();
    //assert
    ok(!t.completed());
});

test("when creating a task, you can specify a name.", function () {
    var name = "test task";
    var t = new knocklist.Task(name);
    //assert
    equal(t.name(), name);
});

test("when creating a task, you can specify a complete status", function () {
    var status = "completed";
    var t = new knocklist.Task("some name", true);
    //assert
    ok(t.completed());
});

test("when creating a task with a specified status, you can also specify the description", function () {
    var description = "some description";
    var t = new knocklist.Task("name", true, description);
    //assert
    equal(t.description(), description);
});

test("when creating a new task, it should not be selected.", function () {
    var t = new knocklist.Task("name");
    ok(!t.selected());
});

test("when toggling an unselected task, task is selected", function () {
    var t = new knocklist.Task("name");
    t.toggleSelected();
    ok(t.selected());
});

test("when toggling a selected task, task is not selected anymore", function () {
    var t = new knocklist.Task("name");
    t.selected(true);
    t.toggleSelected();
    ok(!t.selected());
});

test("when deleting a task, it be removed from the backlog", function() {
   var backlog = new knocklist.Backlog();
    backlog.newTask.save();
    backlog.tasks()[0].remove();

    ok(backlog.tasks().length == 0);
});
test("when storing a task, should contain name, status and description", function(){
    var t = new knocklist.Task("test name", true, "test description");

    var dto = t.toDto();

    equal(dto.name, "test name");
    equal(dto.completed, true);
    equal(dto.description, "test description");
});

module("newTaskModel");
test("toTask creates a task with the right name", function () {
    var m = new knocklist.NewTaskModel();
    m.name("test task");
    var t = m.toTask();
    //assert
    equal(t.name(), "test task");
});
test("clear sets the name to empty string", function () {
    var m = new knocklist.NewTaskModel();
    m.name("some name");
    m.clear();
    equal(m.name(), "");
});

test("when saving a new task, task is added to the backlog's tasks.", function () {
    var backlog = new knocklist.Backlog();
    var m = backlog.newTask;
    m.name("test task");
    m.save();
    //assert
    equal(backlog.tasks().length, 1);
    equal(backlog.tasks()[0].name(), "test task");
});

test("has name is true when name is not empty.", function () {
    var m = new knocklist.Backlog().newTask;
    m.name("test task");
    //assert
    ok(m.hasName());
});

module("backlog");
test("a new backlog should contain an empty list of tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.tasks().length === 0, "actual: " + backlog.tasks);
});

test("a new backlog should contain an empty list of pending tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.pending().length === 0);
});

test("a new backlog should contain an empty list of completed tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.completed().length === 0);
});

test("should be able to add a task to the backlog.", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.tasks().length, 1);
});

test("when a pending task is added, pending tasks contains one task", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.pending().length, 1);
});

test("when a pending task is added, completed tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.completed().length, 0);
});

test("when adding a task and then completing it, pending tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.complete();
    //assert
    equal(backlog.pending().length, 0);
});

test("when adding a task and then completing it, completed tasks has one", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.complete();
    //assert
    equal(backlog.completed().length, 1);
});

test("when cleaning completed tasks, backlog's completed tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.complete();
    backlog.clearCompleted();

    equal(backlog.completed().length, 0);
});

test("when cleaning completed tasks, backlog's uncompleted tasks are not deleted.", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    backlog.clearCompleted();

    equal(backlog.tasks().length, 1);
});

test("when cleaning a completed task, backlog's uncompleted task is not deleted.", function () {
    var backlog = new knocklist.Backlog();
    var t1 = new knocklist.Task("test task");
    backlog.tasks.push(t1);
    var t2 = new knocklist.Task("test task");
    backlog.tasks.push(t2);
    t2.complete();
    backlog.clearCompleted();

    equal(backlog.tasks().length, 1);
});

test("when cleaning tasks, backlog's tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    backlog.clearTasks();
    //assert
    equal(backlog.tasks().length, 0);
});

test("when backlog is empty, completeVsTotal is 0/0", function () {
    var backlog = new knocklist.Backlog();

    equal(backlog.completeVsTotal(), "0/0");
});

test("when there's a pending task in the backlog, completeVsTotal is 0/1", function () {
    var backlog = new knocklist.Backlog();
    backlog.newTask.save();

    equal(backlog.completeVsTotal(), "0/1");
});

test("when there's one complete task in the backlog, completeVsTotal is 1/1", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task();
    backlog.tasks.push(t);
    t.complete();

    equal(backlog.completeVsTotal(), "1/1");
});

module("planner");
test("a planner should contain a product backlog", function(){
    var planner = new knocklist.Planner();

    ok(planner.product != undefined);
});

test("a planner should contain a backlog for the current day", function(){
   var planner = new knocklist.Planner();

    ok(planner.current != undefined);
});

test("when committing to a task, the task should be removed from the product backlog", function(){
    var planner = new knocklist.Planner();
    planner.product.newTask.save();
    planner.product.tasks()[0].commit(); //committing.

    ok(planner.product.tasks().length == 0);
});

test("when committing to a task, the task should be added to the current backlog", function(){
    var planner = new knocklist.Planner();
    planner.product.newTask.save();
    planner.product.tasks()[0].commit(); //committing.

    ok(planner.current.tasks().length == 1);
});

test("when post-poning a task, the task should be removed from the current backlog", function(){
    var planner = new knocklist.Planner();
    planner.current.newTask.save();
    planner.current.tasks()[0].postpone(); //postponing

    ok(planner.current.tasks().length == 0);
});

test("when post-poning a task, the task should be added to the product backlog", function(){
    var planner = new knocklist.Planner();
    planner.current.newTask.save();
    planner.current.tasks()[0].postpone(); //postponing

    ok(planner.product.tasks().length == 1);
});

test("if you postpone, then commit to the same task, the task should be removed from product backlog", function(){
   var planner = new knocklist.Planner();
    var task = planner.current.newTask.save();
    task.postpone();
    task.commit();
    
    equal(planner.product.tasks().length, 0);
});