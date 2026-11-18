const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());



app.use(express.static(
  path.join(__dirname, "public")
));
let students = [
  { id: 1, name: "Asha", course: "HTML" },
  { id: 2, name: "Rahul", course: "JavaScript" },
  { id: 3, name: "Ali", course: "CSS" },
  { id: 4, name: "Sara", course: "Python" },
  { id: 5, name: "James", course: "Java" },
  { id: 6, name: "Maya", course: "MySQL" },
  { id: 7, name: "Derek", course: "Node.js" }
];

let nextId = 8;


//get the all students 

app.get("/students", (req, res) => {
  res.json(students);
});

// http://localhost:3000/students


app.post("/students", (req, res) => {
  const { name, course } = req.body || {};

if (
  typeof name !== "string" ||
  !name.trim() ||
  typeof course !== "string" ||
  !course.trim()
) {
  return res.status(400).json({
    error: "Valid name and course required"
  });
}

  const student = {
    id: nextId++,
    name: name.trim(),
    course: course.trim()
  };

  students.push(student);

  res.status(201).json(student);
});


///


app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(s => s.id === id);

  if (!student) {
    return res.status(404).json({
      error: "Student not found"
    });
  }

  const { name, course } = req.body || {};

  if (typeof name !== "string" || !name.trim() ||
      typeof course !== "string" || !course.trim()) {
    return res.status(400).json({
      error: "Valid name and course required"
    });
  }

  student.name = name.trim();
  student.course = course.trim();

  res.json(student);
});


app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = students.some(s => s.id === id);

  if (!exists) {
    return res.status(404).json({
      error: "Student not found"
    });
  }

  students = students.filter(s => s.id !== id);

  res.sendStatus(204);
});


app.listen(8080, () => {
  console.log("Server running at http://localhost:8080/");
});