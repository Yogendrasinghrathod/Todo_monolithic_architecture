import  jwt  from "jsonwebtoken";

const isAuthenticated=async(req,res,next)=>{

    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            status:false,
            message:"Token not found"
        })
    }

    const decode= await jwt.verify(token,process.env.SECRET_KEY);
    if(!decode){
        return res.status(401).json({
            status:false,
            message:"Unauthorized access"
        })
    }

    req.id=decode.userId;

    next();
}

export default isAuthenticated;