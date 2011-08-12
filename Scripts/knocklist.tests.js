/// <reference path="jquery-1.6.2.js" />
/// <reference path="knockout-1.2.1.js" />
/// <reference path="qunit.js" />
/// <reference path="knocklist.js" />

module("tasks");
test("new task is in pending status.", function () {
    var t = new knocklist.Task();
    //assert
    equal(t.status(), "pending");
});

test("new task should contain name.", function () {
    var name = "test task";
    var t = new knocklist.Task(name);
    //assert
    equal(t.name(), name);
});

test("new task accepts status in constructor", function () {
    var status = "completed";
    var t = new knocklist.Task("some name", status);
    //assert
    equal(t.status(), status);
});

test("task accepts description in the constructor", function () {
    var description = "some description";
    var t = new knocklist.Task("name", undefined, description);
    //assert
    equal(t.description(), description);
});

test("complate sets the status to 'complete'", function () {
    var t = new knocklist.Task("name");
    t.complete();
    //assert
    equal(t.status(), "complete");
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

test("when saving new task, task is stored in backlog's tasks.", function () {
    var backlog = new knocklist.Backlog();
    var m = backlog.newTask;
    m.name("test task");
    m.save();
    //assert
    equal(backlog.tasks().length, 1);
    equal(backlog.tasks()[0].name(), "test task");
});

test("has value is true when name is set.", function () {
    var m = new knocklist.Backlog().newTask;
    m.name("test task");
    //assert
    ok(m.hasName());
});

module("backlog");
test("backlog contains empty list of tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.tasks().length === 0, "actual: " + backlog.tasks);
});

test("backlog contains empty list of pending tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.pending().length === 0);
});

test("backlog contains empty list of completed tasks.", function () {
    var backlog = new knocklist.Backlog();
    //assert
    ok(backlog.completed().length === 0);
});

test("when a pending task is added, tasks length is one", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.tasks().length, 1);
});

test("when a pending task is added, pending tasks is one", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.pending().length, 1);
});

test("when a pending task is added, completed length is zero", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    equal(backlog.completed().length, 0);
});

test("when adding a task and then completing it, pending tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.status("completed");
    //assert
    equal(backlog.pending().length, 0);
});

test("when adding a task and then completing it, completed tasks has one", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.status("completed");
    //assert
    equal(backlog.completed().length, 1);
});

test("when cleaning completed tasks, backlog's completed tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    var t = new knocklist.Task("test task");
    backlog.tasks.push(t);
    t.status("completed");
    backlog.cleanCompleted();
});

test("when cleaning tasks, backlog's tasks is empty", function () {
    var backlog = new knocklist.Backlog();
    backlog.tasks.push(new knocklist.Task("test task"));
    backlog.clearTasks();
    //assert
    equal(backlog.tasks().length, 0);
});
