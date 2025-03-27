const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];

app.get("/",(req,res)=>{
    return res.status(200).json({todos});
});

app.post("/", (req, res) => {
    const {title} = req.body;
    if(!title) {
        return res.status(400).json({message:"title not found"});
    }
    
    const newTodo = {
        id: Date.now(),
        title,
        status: false
    };
    
    todos.push(newTodo);
    return res.status(201).json({message:"successfully added new todo", todo:newTodo});
});

app.put("/done", (req, res) => {
    const id = parseInt(req.body.id);
    if((!id) || (isNaN(id))) {
        return res.status(400).json({message:"did not find id"});
    }
    const todo = todos.find((t)=>t.id===id);
    if(!todo){
        return res.status(404).json({message:"did not find todo"});
    }
    if(todo.status === true) {
        return res.status(200).json({message:"todo is already marked as done"});
    }
    todo.status = true;
    return res.status(200).json({message:"todo marked as done",todo});
});

app.delete("/delete",(req,res)=>{
    const id = parseInt(req.body.id);
    if((!id)||(isNaN(id))){
        return res.status(400).json({message:"did not find id"});
    }
    const prevLength = todos.length;
    todos = todos.filter((t) => t.id !== id);
    if(prevLength===todos.length){
        return res.status(404).json({message:"did not find todo"});
    }
    return res.status(200).json({message:"deleted todo successfully"});
    
});

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
});



