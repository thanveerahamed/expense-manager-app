import {google} from "googleapis";
import express from "express";

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/oauth2callback",
);

app.get("/", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://mail.google.com/"],
        prompt: "consent", // Forces consent screen to get refresh token
    });
    res.redirect(url);
});

app.get("/oauth2callback", async (req, res) => {
    const {code} = req.query;
    const {tokens} = await oauth2Client.getToken(code as string);
    console.log("Refresh Token:", tokens.refresh_token);
    res.send("You can close this window now.");
});

app.listen(3001, () => console.log("Server running on port 3000"));
