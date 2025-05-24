$(document).ready(function() {
    // Task Model with Validation + Subtasks
    function Task(description, hoursToComplete, subtasks = []) {
        if (!description || typeof description !== "string") {
            throw new Error("Task description is required and must be a string.");
        }
        if (!hoursToComplete || isNaN(hoursToComplete) || hoursToComplete <= 0) {
            throw new Error("Hours to complete must be a positive integer.");
        }

        this.description = description;
        this.hoursToComplete = parseInt(hoursToComplete, 10);
        this.completed = false;
        this.subtasks = subtasks.slice(0, 5); // Store up to 5 subtasks
    }

    // Model: Stores tasks & manages subtasks
    var model = {
        tasks: [],
        subtasksBuffer: [], // Store subtasks temporarily before creating a task

        addTask: function(description, hoursToComplete) {
            try {
                var newTask = new Task(description, hoursToComplete, this.subtasksBuffer);
                this.tasks.push(newTask);
                this.subtasksBuffer = []; // Clear subtask buffer after task is created
                return true;
            } catch (error) {
                $("#errorMessage").text(error.message).show();
                return false;
            }
        },

        addSubtaskToBuffer: function(name, date) {
            if (!name || !date) {
                alert("Subtask name and date are required!");
                return false;
            }
            if (this.subtasksBuffer.length >= 5) {
                alert("You can only add up to 5 subtasks.");
                return false;
            }

            this.subtasksBuffer.push({ name, date });
            return true;
        },

        removeSubtaskFromBuffer: function(index) {
            this.subtasksBuffer.splice(index, 1);
        },

        removeTask: function(index) {
            this.tasks.splice(index, 1);
        },

        toggleTask: function(index) {
            this.tasks[index].completed = !this.tasks[index].completed;
        }
    };

    // View: Updates the UI
    var view = {
        renderTasks: function() {
            $("#taskList").empty();
            model.tasks.forEach(function(task, index) {
                var taskItem = `<li class="list-group-item d-flex flex-column">
                    <div class="d-flex justify-content-between">
                        <span class="${task.completed ? 'completed' : ''}">
                            ${task.description} (Hours: ${task.hoursToComplete})
                        </span>
                        <div>
                            <button class="btn btn-warning btn-sm toggle" data-index="${index}">Toggle</button>
                            <button class="btn btn-danger btn-sm remove" data-index="${index}">Remove</button>
                        </div>
                    </div>
                    <ul class="mt-2 list-group">
                        ${task.subtasks.map((subtask, subIndex) => `
                            <li class="list-group-item d-flex justify-content-between">
                                ${subtask.name} - Due: ${subtask.date}
                            </li>
                        `).join('')}
                    </ul>
                </li>`;
                $("#taskList").append(taskItem);
            });
        },

        renderSubtasksBuffer: function() {
            $("#subtaskList").empty();
            model.subtasksBuffer.forEach(function(subtask, index) {
                $("#subtaskList").append(`
                    <li class="list-group-item d-flex justify-content-between">
                        ${subtask.name} - Due: ${subtask.date}
                        <button class="btn btn-danger btn-sm remove-subtask" data-index="${index}">Remove</button>
                    </li>
                `);
            });
        }
    };

    // Controller: Manages interactions
    var controller = {
        init: function() {
            $("#addTask").click(function() {
                $("#errorMessage").hide();
                var taskDesc = $("#taskInput").val();
                var hours = $("#hoursInput").val();

                if (model.addTask(taskDesc, hours)) {
                    $("#taskInput").val('');
                    $("#hoursInput").val('');
                    view.renderTasks();
                    view.renderSubtasksBuffer(); // Clear subtasks after creation
                }
            });

            $("#addSubtask").click(function() {
                var subtaskName = $("#subtaskName").val();
                var subtaskDate = $("#subtaskDate").val();

                if (model.addSubtaskToBuffer(subtaskName, subtaskDate)) {
                    $("#subtaskName").val('');
                    $("#subtaskDate").val('');
                    view.renderSubtasksBuffer();
                }
            });

            $(document).on("click", ".remove-subtask", function() {
                var index = $(this).data("index");
                model.removeSubtaskFromBuffer(index);
                view.renderSubtasksBuffer();
            });

            $(document).on("click", ".remove", function() {
                var index = $(this).data("index");
                model.removeTask(index);
                view.renderTasks();
            });

            $(document).on("click", ".toggle", function() {
                var index = $(this).data("index");
                model.toggleTask(index);
                view.renderTasks();
            });
        }
    };

    controller.init();
});