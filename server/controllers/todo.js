import { Todo } from "../model/todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "In complete todo",
      });
    }

    const todo = new Todo({ title, description });
    todo.save();
    return res.status(201).json({
      status: true,
      message: "Todo Created",
      todo,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find();

    return res.status(200).json({
      status: "success",
      todos,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { title } = req.body;
    // console.log(title);

    const todo = await Todo.findByIdAndUpdate(todoId, { title }, { new: true });
    await todo.save();
    return res.status(200).json({
      status: true,
      todo,
      message: "Updated Todo",
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    await Todo.findByIdAndDelete(todoId);

    return res.status(200).json({
      status: true,
      message: "Todo Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
