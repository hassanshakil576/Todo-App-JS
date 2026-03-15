const input = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const ulList = document.querySelector("#task-list");
const allBtn = document.querySelector(".btn-outline-primary")
const activeBtn = document.querySelector(".btn-outline-warning");
const completeBtn = document.querySelector(".btn-outline-success");
const score = document.querySelector("#score");
const progress = document.querySelector("#progress-bar");

const arr = [];
let currentState = "all";

const savedTodos = JSON.parse(localStorage.getItem("todos"));

if (savedTodos) {
    arr.push(...savedTodos);
}

renderTodo();

input.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addBtn.click()
    }
})

addBtn.addEventListener("click", () => {
    // console.log(input.value)
    if (input.value === "") {
        addBtn.disabled
    } else {
        arr.push({
            text: input.value,
            completed: false,
        });

    }
    input.value = "";
    saveTodos();
    renderTodo();
})

const completedTask = (index) => {
    arr[index].completed = !arr[index].completed
    renderTodo();
    saveTodos();
}

allBtn.addEventListener("click", () => {
    currentState = "all";
    renderTodo();
})

activeBtn.addEventListener("click", () => {
    currentState = "active";
    renderTodo();
})

completeBtn.addEventListener("click", () => {
    currentState = "completed";
    renderTodo();
})

const deleteItem = (index) => {
    arr.splice(index, 1);
    // console.log(arr);
    renderTodo();
    saveTodos();
}

const editItem = (index) => {
    if (arr[index].completed === true) {
        return;
    }
    const updatedTitle = prompt("Enter your updated Title");
    arr[index].text = updatedTitle;
    renderTodo();
    saveTodos();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(arr));
}

function updateScore() {
    const totalTasks = arr.length;
    // console.log(totalTasks);
    const comTasks = arr.filter(item => item.completed).length;
    // console.log(comTasks);
    const activeTasks = totalTasks - comTasks;
    // console.log(activeTasks);
    score.innerHTML = `${comTasks}/${totalTasks}`;
    let progressBar = 0;
    if (totalTasks > 0) {
        progressBar = (comTasks / totalTasks) * 100;
    }
    progress.style.width = `${progressBar}%`;
}

function renderTodo() {
    ulList.innerHTML = "";
    arr.forEach((item, index) => {
        const newItem = document.createElement("li");
        newItem.classList = "list-group-item d-flex justify-content-between align-items-center";
        newItem.innerHTML = `<div class="d-flex align-items-center gap-2 ${item.completed ? "completed" : ""}">
                        <input type="checkbox" class="form-check-input" ${item.completed ? "checked" : ""}>
                        <span>${item["text"]}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <button onclick="editItem(${index})" class="btn btn-sm btn-success"><i class="bi bi-pencil"></i></button>
                        <button onclick="deleteItem(${index})" class="btn btn-sm btn-danger delete-btn"><i class="bi bi-trash"></i></button>
                    </div>`;
        newItem.addEventListener("change", () => {
            completedTask(index);
        })

        if (currentState === "active" && item.completed === true) {
            return;
        }
        if (currentState === "completed" && item.completed === false) {
            return;
        }
        ulList.append(newItem);
    })
    updateScore()
}

