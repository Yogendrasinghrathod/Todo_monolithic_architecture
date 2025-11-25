import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar=()=> {
  const navigate = useNavigate();

  const logoutHandler=async()=>{
    try {
        const res = await api.get("/api/v1/user/logout");
        if(res.data.success){
          // alert(res.data.message);
          toast.success(res.data.message);
          navigate("/login")
        }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
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
