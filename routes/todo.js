const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const router = Router();

let todos=[];

// todo Routes
router.post('/', (req, res) => {
    const {title} = req.body;
    if(!title){
        return res.status(400).json({error:"did not find title"});
    }
    const newTodo ={
        id:todos.length>0?todos[todos.length-1].id+1:1,
        title,
        status:false
    }
    todos.push(newTodo);

    console.log(`Successfully added new todo to the list`);
    
});

router.put('/', adminMiddleware, (req, res) => {
    // Implement update todo  logic
});

router.delete('/', adminMiddleware, (req, res) => {
    // Implement delete todo logic
   
});

router.delete('/:id', adminMiddleware, (req, res) => {
    // Implement delete todo by id logic
    const id = parseInt(req.params.id);
    if((!id)||(isNaN(id))){
        return res.status(404).json({error:"did not give valid id"});
    }
    const index = todos.findIndex((t)=>t.id===id)
    if(index===-1){
        return res.status(404).json({error:"did not find id"});
    }
    const removed = todos.splice(index,1)[0];
    console.log(`Deleted task ${removed.title} ${removed.status} successfully`)
    return res.status(201).json({ message: "Todo created", todo: newTodo });

});


router.get('/', adminMiddleware, (req, res) => {
    // Implement fetching all todo logic
    const todo = todos.forEach((todo)=>{
        if(!todo){
            console.log("error collecting todo");
            return res.status(400).json({message:"error no todo found"});
        }
        console.log(`${todo}`);
        return res.status(200).json({message:"fetched all todos"});
    });

});

router.get('/:id', adminMiddleware, (req, res) => {
    // Implement fetching todo by id logic

    const id = parseInt(req.params.id);
    const todo = todos.find((todo)=>todo.id===id)
    const done = todo.status? "true":"false";
    if(!todo){
        console.log("could not find relevant todo");
    }
    console.log(`${done} ${todo}`);
    return res.status(200).json({message:"done fetched successfully"});
    
});

module.exports = router;