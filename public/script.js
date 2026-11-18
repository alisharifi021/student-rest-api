const form = document.getElementById("studentForm");
const list = document.getElementById("studentList");
const message = document.getElementById("message");

const idInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const courseInput = document.getElementById("course");
const saveBtn = document.getElementById("saveBtn");

let students = [];

// GET /students
async function getStudents() {
  try {
    const response = await fetch("/students");

    if (!response.ok) {
      throw new Error("Could not load students");
    }

    students = await response.json();
    list.innerHTML = "";

    students.forEach(student => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = student.id;

      const nameCell = document.createElement("td");
      nameCell.textContent = student.name;

      const courseCell = document.createElement("td");
      courseCell.textContent = student.course;

      const actions = document.createElement("td");

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => editStudent(student.id);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteStudent(student.id);

      actions.append(editBtn, deleteBtn);
      row.append(idCell, nameCell, courseCell, actions);
      list.appendChild(row);
    });

    message.textContent = students.length
      ? `GET /students → ${students.length} student(s) loaded`
      : "GET /students → no students yet";
  } catch (error) {
    message.textContent = error.message;
  }
}


// POST /students
async function addStudent(name, course) {
  const response = await fetch("/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, course })
  });

  if (!response.ok) {
    throw new Error("Could not add student");
  }
}

// PUT /students/:id

function editStudent(id) {
  const student = students.find(s => s.id === id);

  if (!student) return;

  idInput.value = student.id;
  nameInput.value = student.name;
  courseInput.value = student.course;

  saveBtn.textContent = "Update Student";
}

async function updateStudent(id, name, course) {
  const response = await fetch(`/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, course })
  });

  if (!response.ok) {
    throw new Error("Could not update student");
  }
}


function resetForm() {
  form.reset();
  idInput.value = "";
  saveBtn.textContent = "Add Student";
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const id = idInput.value;
  const name = nameInput.value.trim();
  const course = courseInput.value.trim();

  if (!name || !course) return;

  try {
    if (id) {
      await updateStudent(id, name, course);
    } else {
      await addStudent(name, course);
    }

    resetForm();
    await getStudents();

    message.textContent = id
      ? "Student updated"
      : "Student added";

  } catch (error) {
    message.textContent = error.message;
  }
});

document.getElementById("getBtn")
  .addEventListener("click", getStudents);

getStudents();


// DELETE /students/:id
async function deleteStudent(id) {
  try {
    const response = await fetch(`/students/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Could not delete student");
    }

    await getStudents();
    message.textContent = "Student deleted";
  } catch (error) {
    message.textContent = error.message;
  }
}
