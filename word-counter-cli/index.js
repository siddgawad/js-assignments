const fs = require("fs");
const { program } = require("commander");

program
.argument("<filepath>","C:\Users\theof\OneDrive\Desktop\API DETCHING\word-counter-cli\a.txt")
.action((filepath)=>{
    try{
        const text = fs.readFileSync(filepath,"utf-8");
        const count = text.split(/\s+/).filter(Boolean).length; 
        /*
        /\s+s/ means one or more whitespace characters -> ["hello", "world", "foo"] so we get only characters instead of spaces etc
        boolean when used as filter, converts each element to true or false and only keeps the ones which are true - we use this because split can sometimes produce 
        empty strings at the sart or end 

        so entire thing does - 
        gives you the number of words in a text file by:

         Splitting the content by whitespace

          Removing empty values

          Counting the remaining items
        */
        console.log(`You have ${count} words in this file.`);

    }
    catch(err){
        console.log("Error reading this file",err.message);
    }
    

});

program.parse();