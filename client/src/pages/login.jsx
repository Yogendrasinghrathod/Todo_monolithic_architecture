import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
   const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  // const {toast} = useToast();
  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  
  const loginHandler = async() => {

    try {
      const res = await api.post("/api/v1/user/login", user);
      console.log(res);
        
      if(res.data.status){
          toast.success(res.data.message);
          navigate("/");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Input
          type="email"
          name="email"
          value={user.email}
          onChange={changeHandler}
          placeholder="Email"
        />
        <Input
          type="password"
          name="password"
          value={user.password}
          onChange={changeHandler}
          placeholder="Password"
        />
        <Button onClick={loginHandler} className="w-full">Login</Button>
      </div>
    </div>
  );
};

export default Login;
