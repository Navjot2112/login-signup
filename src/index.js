const express = require('express');
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the user already exists
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.send("User already exists");
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const userdata = await collection.insertMany(data);
    console.log("usercreated", userdata);
    res.redirect('/');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt for username:", username);

    const user = await collection.findOne({ name: username });
    if (!user) {
        console.log("User not found");
        return res.status(400).send('Invalid username');
    }

    console.log("Stored hashed password:", user.password);
    console.log("Entered password:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
        console.log("Password does not match");
        return res.status(400).send('Invalid password');
    }

    console.log("Login successful for username:", username);
    res.send('Login successful');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
