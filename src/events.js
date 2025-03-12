const express = require("express");
const fs = require("fs");
const cron = require("node-cron");
const path = require("path");

const app = express();
module.exports = app;

app.use(express.json());

const EVENTS_FILE = path.join(__dirname, "../data/events.json");

// Load events from JSON file
const loadEvents = () => {
    if (!fs.existsSync(EVENTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"));
};

// Save events to JSON file
const saveEvents = (events) => {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
};

// Create a new event
app.post("/events", (req, res) => {
    const { name, description, date, time, category, reminderMinutes } = req.body;
    if (!name || !date || !time) {
        return res.status(400).json({ message: "Name, date, and time are required" });
    }

    const events = loadEvents();
    const newEvent = { id: events.length + 1, name, description, date, time, category, reminderMinutes };
    events.push(newEvent);
    saveEvents(events);

    res.status(201).json({ message: "Event created successfully", event: newEvent });
});

// Get all events
app.get("/events", (req, res) => {
    res.json(loadEvents());
});

// Get events by category
app.get("/events/category/:category", (req, res) => {
    const events = loadEvents().filter(event => event.category === req.params.category);
    res.json(events);
});

// Get upcoming events
app.get("/events/upcoming", (req, res) => {
    const now = new Date();
    const upcomingEvents = loadEvents().filter(event => new Date(`${event.date} ${event.time}`) > now);
    res.json(upcomingEvents);
});

// Reminder system
const scheduleReminders = () => {
    const events = loadEvents();
    events.forEach(event => {
        if (event.reminderMinutes) {
            const eventTime = new Date(`${event.date} ${event.time}`);
            const reminderTime = new Date(eventTime - event.reminderMinutes * 60000);

            if (reminderTime > new Date()) {
                cron.schedule(`${reminderTime.getMinutes()} ${reminderTime.getHours()} * * *`, () => {
                    console.log(`Reminder: ${event.name} is happening soon!`);
                });
            }
        }
    });
};

