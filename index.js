const express = require("express");
const path = require("path");
const fs = require ("fs/promises");
const app = express();
app.use(express.json())
const jsonPath = path.resolve("./file/users.json");

app.get("/users", async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, "utf8");
    res.send(jsonFile);
});

app.post("/users", async (req,res) => {
    const user = req.body;
    
    const usersArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));

    const lastIndex = usersArray.length - 1;
    const newId = usersArray[lastIndex].id + 1;
    usersArray.push({...user, id: newId});
    

    await fs.writeFile(jsonPath, JSON.stringify(usersArray));
    res.end();
});

const PORT = 8000;



app.put("/users", async (req, res) => {
    const usersArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
    const { name, age, country, id } = req.body;
    
    const userIndex = usersArray.findIndex(user => user.id === id);
    if(userIndex >= 0) {
        usersArray[userIndex].name = name;
        usersArray[userIndex].age = age;
        usersArray[userIndex].country = country;
        
    }
    await fs.writeFile(jsonPath, JSON.stringify(usersArray));
    
    res.send("usuario actualizado")
    
});

app.delete("/users", async (req, res) => {
    const usersArray = JSON.parse(await fs.readFile(jsonPath, "utf8"));
    const { id } = req.body;
    const userIndex = usersArray.findIndex(user => user.id === id);
    usersArray.splice(userIndex, 1)
    await fs.writeFile(jsonPath, JSON.stringify(usersArray));
    res.end();
});

app.listen(PORT, () => {
    console.log(`Esto es mi primer servidor ${PORT}`);
})