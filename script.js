const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskContainer");

const searchInput = document.getElementById("searchInput");
const desktopSearch = document.getElementById("desktopSearch");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const notesArea = document.getElementById("notesArea");
const saveNotes = document.getElementById("saveNotes");

const taskPage = document.getElementById("taskPage");
const notesPage = document.getElementById("notesPage");
const calendarPage = document.getElementById("calendarPage");

const taskDate = document.getElementById("taskDate");
const calendarTasks = document.getElementById("calendarTasks");

const themeBtn = document.getElementById("themeBtn");
const currentDate = document.getElementById("currentDate");

const menuItems = document.querySelectorAll(".menu-item");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


// Current Date

const today = new Date();

currentDate.innerText =
    today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// Sidebar Toggle

menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});


// Save Tasks

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Render Calendar

function renderCalendarTasks() {

    const selectedDate = taskDate.value;

    calendarTasks.innerHTML = "";

    const filtered = tasks.filter(
        task => task.date === selectedDate
    );

    if (filtered.length === 0) {
        calendarTasks.innerHTML =
            "<p>No tasks on this date.</p>";
        return;
    }

    filtered.forEach(task => {

        calendarTasks.innerHTML += `
        <div class="task-card">
            <h3>${task.text}</h3>
        </div>
        `;

    });

}


// Render Tasks

function renderTasks() {

    taskContainer.innerHTML = "";

    document.getElementById(
        "totalTasks"
    ).innerText = tasks.length;


    document.getElementById(
        "pendingTasks"
    ).innerText =
        tasks.filter(
            task => !task.completed
        ).length;


    document.getElementById(
        "completedTasks"
    ).innerText =
        tasks.filter(
            task => task.completed
        ).length;


    document.getElementById(
        "highPriorityTasks"
    ).innerText =
        tasks.filter(
            task => task.priority === "High"
        ).length;

    let filteredTasks = [...tasks];

    if (currentFilter === "pending") {
        filteredTasks =
            filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks =
            filteredTasks.filter(task => task.completed);
    }

    let text =
        searchInput.value || desktopSearch.value;

    text = text.toLowerCase();

    filteredTasks =
        filteredTasks.filter(task =>
            task.text.toLowerCase().includes(text)
        );

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.classList.add("task-card");

        card.innerHTML = `

        <h3 class="task-title">
        ${task.text}
        </h3>

        <span class="task-status ${task.completed ?
                "completed" :
                "pending"
            }">

        ${task.completed ?
                "Completed" :
                "Pending"
            }

        </span>

        <div class="task-actions">

            <button class="edit-btn">
            Edit
            </button>

            <button class="complete-btn">

            ${task.completed ?
                "Undo" :
                "Complete"
            }

            </button>

            <button class="delete-btn">
            Delete
            </button>

        </div>
        `;


        // EDIT

        const editBtn =
            card.querySelector(".edit-btn");

        editBtn.addEventListener("click", () => {

            const title = card.querySelector(".task-title");

            title.innerHTML = `
        <input
        type="text"
        class="edit-input"
        value="${task.text}">
    `;

            const input = card.querySelector(".edit-input");

            input.focus();

            input.addEventListener("blur", () => {

                const newText = input.value.trim();

                if (newText !== "") {

                    task.text = newText;

                    saveTasks();

                    renderTasks();
                }

            });

        });


        // COMPLETE

        const completeBtn =
            card.querySelector(".complete-btn");

        completeBtn.addEventListener("click", () => {

            task.completed =
                !task.completed;

            saveTasks();

            renderTasks();

        });


        // DELETE

        const deleteBtn =
            card.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            const index =
                tasks.indexOf(task);

            tasks.splice(index, 1);

            saveTasks();

            renderTasks();

        });


        taskContainer.appendChild(card);

    });

}



// Add Task

addBtn.addEventListener("click", () => {

    const text =
        taskInput.value.trim();

    if (text === "") return;

    tasks.push({

        text: text,

        completed: false,

        date: dueDate.value,

        priority: priority.value

    });

    saveTasks();

    taskInput.value = "";

    renderTasks();

});


// Search

searchInput.addEventListener(
    "input",
    renderTasks
);

desktopSearch.addEventListener(
    "input",
    renderTasks
);


// Notes

notesArea.value =
    localStorage.getItem("notes") || "";

saveNotes.addEventListener("click", () => {

    localStorage.setItem(
        "notes",
        notesArea.value
    );

    alert(
        "Notes Saved Successfully!"
    );

});


// Menu

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(menu =>
            menu.classList.remove("active")
        );

        item.classList.add("active");

        const page =
            item.dataset.page;


        taskPage.style.display = "none";
        notesPage.style.display = "none";
        calendarPage.style.display = "none";


        if (page === "notes") {
            notesPage.style.display = "block";
        }

        else if (page === "calendar") {
            calendarPage.style.display = "block";
        }

        else {

            taskPage.style.display = "block";

            currentFilter = page;

            renderTasks();

        }

        sidebar.classList.remove("show");

    });

});



// Calendar

taskDate.addEventListener(
    "change",
    renderCalendarTasks
);


// Dark Mode

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle(
        "dark"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

});


if (
    localStorage.getItem("theme")
    === "dark"
) {

    document.body.classList.add(
        "dark"
    );

}


// Enter Key

taskInput.addEventListener(
    "keypress",
    e => {

        if (e.key === "Enter") {
            addBtn.click();
        }

    }
);


renderTasks();