
---

# **Mimicking MVC in jQuery with Bootstrap & Validation**

## **Introduction**
MVC (Model-View-Controller) is a well-known architectural pattern that helps structure applications. While **jQuery itself is not an MVC framework**, we can mimic the pattern by separating concerns in our front-end code. 

This tutorial builds a **Task Manager** using jQuery while **mimicking MVC principles** and incorporating **Bootstrap for styling**.

---

## **1️ Project Setup**

### **Folder Structure**
```plaintext
/jquery-mvc-todo
│── task_manager.html   (UI)
│── subtask_manager.html   (UI)
│── app.js       (Model, View, Controller)
│── README.md    (This tutorial)
```

### **Including Bootstrap**
We'll use **Bootstrap 5** for styling. You can include it via a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
```

---

## **2️ Understanding MVC**
- **Model** 📦 → Manages data and validation.
- **View** 🖼️ → Handles UI rendering and updates.
- **Controller** 🎮 → Manages user input and interaction.

Although **pure jQuery isn't an MVC framework**, structuring code this way keeps it **organized**, **maintainable**, and **scalable**.

---

## **3️ HTML (View)**
Now with **Bootstrap styling** for a cleaner layout!

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Task Manager</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="app.js" defer></script>
    <style>
        .completed { text-decoration: line-through; color: gray; }
    </style>
</head>
<body class="container mt-4">
    <h1 class="text-center">Task Manager</h1>
    <div class="card p-3">
        <div class="mb-3">
            <input type="text" id="taskInput" class="form-control" placeholder="Task Description">
        </div>
        <div class="mb-3">
            <input type="number" id="hoursInput" class="form-control" placeholder="Hours to Complete">
        </div>
        <button id="addTask" class="btn btn-primary">Add Task</button>
        <p class="text-danger mt-2" id="errorMessage"></p>
    </div>
    <ul id="taskList" class="list-group mt-4"></ul>
</body>
</html>
```

### **Enhancements with Bootstrap**
✅ **Improved layout** with `container` and `card` styles  
✅ **Styled input fields** for better visibility  
✅ **Bootstrap buttons** for a modern look  
✅ **Error messages** use Bootstrap's `text-danger` class  

---

## **4️ JavaScript (Model, View & Controller)**
This version **includes validation and Bootstrap enhancements**.

```javascript
$(document).ready(function() {
    // Task Model with Validation
    function Task(description, hoursToComplete) {
        if (!description || typeof description !== "string") {
            throw new Error("Task description is required and must be a string.");
        }
        if (!hoursToComplete || isNaN(hoursToComplete) || hoursToComplete <= 0) {
            throw new Error("Hours to complete must be a positive integer.");
        }

        this.description = description;
        this.hoursToComplete = parseInt(hoursToComplete, 10);
        this.completed = false;
    }

    // Model: Stores tasks and handles validation
    var model = {
        tasks: [],
        addTask: function(description, hoursToComplete) {
            try {
                var newTask = new Task(description, hoursToComplete);
                this.tasks.push(newTask);
                return true;
            } catch (error) {
                $("#errorMessage").text(error.message).show();
                return false;
            }
        },
        removeTask: function(index) {
            this.tasks.splice(index, 1);
        },
        toggleTask: function(index) {
            this.tasks[index].completed = !this.tasks[index].completed;
        }
    };

    // View: Updates UI using Bootstrap styles
    var view = {
        render: function() {
            $("#taskList").empty();
            model.tasks.forEach(function(task, index) {
                var taskItem = `<li class="list-group-item d-flex justify-content-between ${task.completed ? 'completed' : ''}">
                    ${task.description} (Hours: ${task.hoursToComplete})
                    <div>
                        <button class="btn btn-warning btn-sm toggle" data-index="${index}">Toggle</button>
                        <button class="btn btn-danger btn-sm remove" data-index="${index}">Remove</button>
                    </div>
                </li>`;
                $("#taskList").append(taskItem);
            });
        }
    };

    // Controller: Handles user interactions
    var controller = {
        init: function() {
            $("#addTask").click(function() {
                $("#errorMessage").hide(); // Hide previous errors
                var taskDesc = $("#taskInput").val();
                var hours = $("#hoursInput").val();

                if (model.addTask(taskDesc, hours)) {
                    $("#taskInput").val('');
                    $("#hoursInput").val('');
                    view.render();
                }
            });

            $(document).on("click", ".remove", function() {
                var index = $(this).data("index");
                model.removeTask(index);
                view.render();
            });

            $(document).on("click", ".toggle", function() {
                var index = $(this).data("index");
                model.toggleTask(index);
                view.render();
            });
        }
    };

    controller.init();
});
```

---

## **5️ Key Features**
✅ **MVC-like structure** → Separates concerns for better organization.  
✅ **Bootstrap integration** → Improves UI appearance.  
✅ **Validation built-in** → Ensures task descriptions are required and `hoursToComplete` is a positive integer.  
✅ **Error handling** → Displays validation messages.  
✅ **Styled task list** → Uses Bootstrap **list-group** elements for modern styling.  

---

## **6️ Running the Project**
1. Save `index.html` and `app.js` in the same directory.
2. Open `index.html` in your browser.
3. Try adding tasks and observe UI updates.
4. Test **invalid inputs** like missing description or negative hours.

---

## **7️ Possible Enhancements**
💾 **LocalStorage Integration** → Persist tasks across sessions.  
🎨 **More Styling Tweaks** → Improve accessibility and responsiveness.  
📱 **Mobile-Friendly Design** → Optimize for different screen sizes.  

---

# **Adding Subtasks**  

With this addition users can **add subtasks inside task creation**, remove subtasks before submission, and create structured **task objects**. The UI is enhanced with **Bootstrap styling** for a modern, responsive design.

---

## **Understanding MVC in This Project**  
### 🔹 **Model (Data Management)**  
- Each task has a **description**, **estimated hours**, and **a list of subtasks**.  
- Subtasks contain a **name** and a **due date**.  
- Validation ensures data integrity before tasks and subtasks are created.

### 🔹 **View (UI Updates)**  
- Users can **add subtasks dynamically before submitting a task**.  
- Tasks and subtasks are displayed using **Bootstrap components**.  
- **Error messages** prevent invalid inputs.

### 🔹 **Controller (User Interaction)**  
- Handles **task and subtask creation**, validation, and deletion.  
- Ensures users can **remove individual subtasks before submission**.  
- Updates the UI **only when a task is fully created**.

---

## **Conclusion**
While **jQuery does not support MVC natively**, this approach **mimics the structure** effectively by **separating concerns** into Model, View, and Controller components.  
Adding **Bootstrap** improves the **appearance and responsiveness**, making this project more polished.


