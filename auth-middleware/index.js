const express = require("express");
const app = express();
const PORT = 3000;

const VALID_API_KEY = '100xdevs_cohort3_super_secret_valid_api_key'

function authenticateAPIkey(req,res,next){
    const api =  req.headers["100xdevs-api-key"];
    if(!api==VALID_API_KEY){
        return res.status(403).json({error:"could not find api key"});
    }
    next();
}

app.use(authenticateAPIkey);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Access granted' });
});

app.listen(PORT,()=>{
    console.log(`Auth middleware running on http://localhost:${PORT}`);
})