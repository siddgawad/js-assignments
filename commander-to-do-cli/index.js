const path = require("path");
const fs = require("fs");
const {program} = require("commander");

const FILE_PATH=path.join(__dirname,"todos.json");
function loadTodos(){
    try{
        if(!fs.existsSync(FILE_PATH))return[];
const data = fs.readFileSync(FILE_PATH,"utf-8");
if(!data.trim()){
    console.log("specify correct file");
    return[];
}
return JSON.parse(data);
    }
    catch(err){
        console.log("Could not load todos",err.message);
        return[];
    }

};

function saveTodos(todos){
    try{
        fs.writeFileSync(FILE_PATH,JSON.stringify(todos,null,2),"utf-8");
        console.log("Saved task successfully");
    }
    catch(err){
        console.log("could not save todo"),err.message;
    }
};

program
.name("todo")
.description("A simple todo CLI app using calculator")
.version("1.0.0");

program 
.command("add")
.description("Add todo to list")
.argument("<task>","Task to add") // this lets commander know that we want to take in task, without this we could not use task in .action() - this is how u define a positional argument with commander 
.action((task)=>{
    const todos = loadTodos();
    const newTodo={
        id:todos.length>0?todos[todos.length-1].id+1:1,
        task,
        status:false,

    };
    todos.push(newTodo);
    saveTodos(todos);
    console.log(`Added task with id ${newTodo.id} ${newTodo.task}`);

});

program
.command("list")
.description("show all todos in list")
.action(()=>{
    const todos = loadTodos();
    if(todos.length===0){
        console.log("nothing to display");
        return;
    }
    todos.forEach((todo)=>{
        const status = todo.status?"done":"not done";
        console.log(`${todo.id} ${status} ${todo.task}`);
    });
});

program
.command("done")
.description("Mark any todo w/ id as done")
.argument("<id>","need id to find task")
.action((id)=>{
    const todos = loadTodos();
    const parseId = parseInt(id);
    if(isNaN(parseId)){
        console.log("enter a valid id");
        return;
    }
    const todo = todos.find((t)=>t.id===parseId)
    if(!todo){
        console.log(`Could not find task with id ${parseId}`);
        return;
    }
    todo.status = true;
    saveTodos(todos);
    console.log(`Successfully marked task with id ${parseId} as done!`);
    }
    
);

program 
.command("delete")
.description("Delete any todo w/ id")
.argument("<id>","need id to find task to delete")
.action((id)=>{
    const todos = loadTodos();
    const parseId = parseInt(id);
    if(isNaN(id)){
        console.log("Enter a valid number as id")
        return;
    }
    const index = todos.findIndex((todo)=>todo.id===parseId)
    if(index===-1){
        console.log("could not find id in list so could not delete");
        return;
    }
    const removed = todos.splice(index,1)[0];
    console.log(`Successfully deleted task ${removed.id} ${removed.task}`);
    saveTodos(todos);
});

program.parse();
