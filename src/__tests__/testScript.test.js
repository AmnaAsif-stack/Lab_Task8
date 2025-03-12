const request = require("supertest");
const express = require("express");
const app = require("../events"); // Ensure you export `app` in events.js

describe("Event API Tests", () => {
    it("should create a new event", async () => {
        const res = await request(app).post("/events").send({
            name: "Team Meeting",
            description: "Discuss project updates",
            date: "2025-03-15",
            time: "10:00",
            category: "Meetings",
            reminderMinutes: 30
        });

        expect(res.status).toBe(201);
        expect(res.body.event).toHaveProperty("id");
        expect(res.body.event.name).toBe("Team Meeting");
    });

    it("should return all events", async () => {
        const res = await request(app).get("/events");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return upcoming events", async () => {
        const res = await request(app).get("/events/upcoming");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
