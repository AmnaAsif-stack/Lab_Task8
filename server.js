const app = require("./events"); // Import app from events.js

const PORT = 3000;

// Default route for the homepage
app.get("/", (req, res) => {
    res.send("Welcome to the Event Planning and Reminder System API!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
