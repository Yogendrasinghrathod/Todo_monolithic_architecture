import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar=()=> {
  const navigate = useNavigate();

  const logoutHandler=async()=>{
    try {
        const res= await axios.get("http://localhost:8000/api/v1/user/logout", {
          withCredentials: true,
        });
        if(res.data.success){
          // alert(res.data.message);
          toast.success(res.data.message);
          navigate("/login")
        }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className="bg-gray-600">
      <div className="flex items-center justify-between p-2">
        <h1 className="font-bold text-lg">{"Yogendra Singh"}</h1>
        <Button className="" onClick={logoutHandler}>Logout</Button>
      </div>
    </div>
  );
}

export default Navbar;
