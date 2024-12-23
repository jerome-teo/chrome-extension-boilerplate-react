// const express = require("express");
// const { google } = require("googleapis");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Gmail API OAuth2 setup
// const oauth2Client = new google.auth.OAuth2(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI
// );

// // Step 1: Generate OAuth URL for the user to log in
// app.get("/auth-url", (req, res) => {
//     const authUrl = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: ["https://www.googleapis.com/auth/gmail.readonly"],
//     });
//     res.json({ authUrl });
// });

// // Step 2: Exchange authorization code for tokens
// app.post("/auth-callback", async (req, res) => {
//     const { code } = req.body;
//     try {
//         const { tokens } = await oauth2Client.getToken(code);
//         oauth2Client.setCredentials(tokens);
//         res.json(tokens); // Send tokens back to the frontend
//     } catch (error) {
//         console.error("Error exchanging authorization code:", error);
//         res.status(500).send("Failed to authenticate.");
//     }
// });

// // Step 3: Fetch user emails
// app.get("/emails", async (req, res) => {
//     try {
//         const gmail = google.gmail({ version: "v1", auth: oauth2Client });
//         const response = await gmail.users.messages.list({ userId: "me", maxResults: 10 });

//         const messages = response.data.messages || [];
//         const emails = [];

//         for (let message of messages) {
//             const email = await gmail.users.messages.get({ userId: "me", id: message.id });
//             emails.push({
//                 id: email.data.id,
//                 snippet: email.data.snippet,
//                 subject: email.data.payload.headers.find((h) => h.name === "Subject")?.value || "No Subject",
//             });
//         }

//         res.json(emails);
//     } catch (error) {
//         console.error("Error fetching emails:", error);
//         res.status(500).send("Failed to fetch emails.");
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
