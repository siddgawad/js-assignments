const express = require("express");
const app = express();
const PORT = 3000;

function logRequests(req,res,next){
    const path = req.path;
    const method = req.method;
    console.log(method);
    console.log(path);
  
    next();
}

app.use(logRequests);


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
});

app.listen(PORT,()=>{
    console.log(`Listening on http://localhost:${PORT}`);
})