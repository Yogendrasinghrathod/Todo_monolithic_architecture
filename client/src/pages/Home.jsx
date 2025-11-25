import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import React, { useEffect, useState } from "react";

// import { useToast } from "@/components/ui/sonner";
import Navbar from "./navbar";
import toast from "react-hot-toast";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const Home = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const fetchTodos = async () => {
    try {
      const res = await api.get("/api/v1/todo");
      if (res.data.status) {
        setTodos(
          res.data.todos
          .slice().sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load todos");
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  const addTodoHandler = async () => {
    try {
      const res = await api.post("/api/v1/todo", { title, description });
      console.log(res.data);
      if (res.data.status) {
        toast.success(res.data.message);
        setDescription("");
        setTitle("");
        setTodos([res.data.todo, ...todos]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create todo");
    }
  };

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const clearSelection = () => {
    setSelectedTodo(null);
    setTitle("");
    setDescription("");
  };
  // -> update order - 1.) selectTodo(handleSelectTodo) got the todo and we also set title and description in this .
  //2.)handleSubmit -- if todoSelected then we will show to UpdateTodoHandler else CreateTodoHandler;
  // 3.) updateToHandler-> sended axios req,with payload(title,description)-> already setted by selectTodo --> fetchTodos();
  //4.) clear selection option


  // to delete same order as above handleSelectTodo -> deleteTodo->fetchTodos
  const updateTodoHandler = async () => {
    if (!selectedTodo?._id) {
      toast.error("Select a todo to update");
      return;
    }
    const payload = {
      title,
      description,
    };
    try {
      const res = await api.put(`/api/v1/todo/${selectedTodo._id}`, payload);
      toast.success(res.data?.message || "Todo updated");
      await fetchTodos();
      clearSelection();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update todo");
    }
  };
  const deleteTodoHandler=async()=>{
    if (!selectedTodo?._id) {
      toast.error("Select a todo to delete");
      return;
    }
    try {
      const res = await api.delete(`/api/v1/todo/${selectedTodo._id}`);
      if(res.data.status){
        toast.success(res.data.message);
        await fetchTodos();
        clearSelection();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete todo");
    }
  }
  const handleSubmit = async () => {
    if (selectedTodo) {
      await updateTodoHandler();
    } else {
      await addTodoHandler();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-5 mt-5 max-w-2xl">
          <div className="w-full">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              placeholder="Add todo...."
            />
          </div>

          <Textarea
            placeholder="Add description here...."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="w-fit">
              {selectedTodo ? "Update Todo 😏" : "Add Todo 😏"}
            </Button>
            {selectedTodo && (
              <Button variant="ghost" onClick={clearSelection} className="w-fit">
                Cancel
              </Button>
              
            )}
            {selectedTodo &&
            <Button variant="ghost" onClick={deleteTodoHandler} className="w-fit bg-red-500 hover:bg-red-600">
            Delete Todo
          </Button>}
             
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {todos.map((todo) => (
          <Card key={todo._id} className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>{todo.title}</CardTitle>
              <CardDescription>{todo.description}</CardDescription>
            </CardHeader>  
            <CardFooter>
              <Button onClick={() => handleSelectTodo(todo)} className="w-fit">
                Edit Todo
              </Button>
            </CardFooter>         
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
