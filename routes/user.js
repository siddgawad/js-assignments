const {Router} = require("express");
const router = Router();
const userMiddleware = require("../middleware/middleware-login");
const users = [];
const todos = [];

router.post('/signup',(req,res)=>{
    const {username, password} = req.body;
   
    if(!username || !password ){
        return res.status(400).json({message:"invalid password or username"})
    }

    const existingUser = users.find((user)=>user.username===username);
    if(existingUser){
        return res.status(404).json({message:"User already exists"});
    }
    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        username,
        password,

    };
    users.push(newUser);
    return res.status(201).json({message:"Signup successfull",user:newUser});
});

router.post('/login',(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password ){
        return res.status(400).json({message:"invalid password or username"})
    }

    const isUser = users.find((user)=>user.username===username);
    if(!isUser){
        return res.status(404).json({message:"username does not exist"});
    }
    if(isUser.password!==password){
        return res.status(404).json({message:"password incorrect"});
    }
    else{
        return res.status(200).json({message:"successfully logged in"})
    }

});

router.post('/todos', userMiddleware, (req, res) => {
    const {title} = req.body;

    if(!title){
        return res.status(400).json({message:"invalid task given"});
    }

    const newTodo ={
        id: todos.length>0? todos[todos.length-1].id+1:1,
        task:title,
        status:false,
        userId: req.userId
    }

    todos.push(newTodo);
    return res.status(201).json({message:"created a new todo successfully",todo:newTodo});
    
  });

  router.get('/todos',userMiddleware,(req,res)=>{
    const userId = req.userId;
    const getTodo = todos.filter((todo)=>todo.userId===userId);

    res.status(200).json({todos:userTodos});
  });

  router.post('/logout',userMiddleware,(req,res)=>{
    res.status(200).json({ message: `User ${req.userId} logged out.` });
  });
  



