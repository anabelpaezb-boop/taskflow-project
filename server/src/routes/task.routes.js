const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  patchTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", patchTask);

module.exports = router;