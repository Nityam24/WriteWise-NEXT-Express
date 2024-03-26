// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const http = require("http");
// const socketIO = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const io = socketIO(server);

// const port = 5000;

// // MongoDB/Mongoose setup
// mongoose.connect(
//   "mongodb+srv://nityampatel2402:AZubT9iY2PiwZPd4@cluster0.mw36lkf.mongodb.net/chatapp?retryWrites=true&w=majority&appName=Cluster0"
//   // {
//   //   useNewUrlParser: true,
//   //   useUnifiedTopology: true,
//   // }
// );

// const ChatGroup = mongoose.model("ChatGroup", {
//   name: String,
// });

// const Message = mongoose.model("Message", {
//   groupId: String,
//   userId: String, // ID of the user who sent the message
//   // messageId: String, // Unique identifier for the message
//   text: String,
//   createdAt: { type: Date, default: Date.now }, // Timestamp of when the message was created
//   expireAt: { type: Date, default: Date.now, index: { expires: "10s" } }, // Automatically delete the message after 1 hour
// });

// // Middleware
// app.use(bodyParser.json());

// // Socket.IO events
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("join", (groupId) => {
//     socket.join(groupId);
//     console.log(`User joined group ${groupId}`);
//   });

//   socket.on("message", async ({ groupId, userId, message }) => {
//     try {
//       const newMessage = new Message({ groupId, userId, text: message });
//       await newMessage.save();
//       io.to(groupId).emit("message", newMessage);
//     } catch (err) {
//       console.error("Error adding message to MongoDB:", err);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

// // Endpoint for creating a new ChatGroup entry
// app.post("/chatgroups", async (req, res) => {
//   const { userId1, name1, userId2, name2 } = req.body;

//   try {
//     // Check if a ChatGroup entry with the same userId combination already exists
//     const existingChatGroup = await ChatGroup.findOne({
//       $or: [
//         { userId1, userId2 },
//         { userId1: userId2, userId2: userId1 },
//       ],
//     });

//     if (existingChatGroup) {
//       // ChatGroup entry with the same userId combination already exists
//       res
//         .status(400)
//         .json({ error: "ChatGroup already exists for these users" });
//       return;
//     }

//     // Create a new ChatGroup entry
//     const newChatGroup = new ChatGroup({ userId1, name1, userId2, name2 });
//     await newChatGroup.save();

//     res.status(201).json(newChatGroup);
//   } catch (err) {
//     console.error("Error creating ChatGroup:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Endpoint for retrieving messages of a specific chat group
// app.get("/chatgroups/:groupId/messages", async (req, res) => {
//   const groupId = req.params.groupId;

//   try {
//     const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
//     res.json(messages);
//   } catch (err) {
//     console.error("Error retrieving chat messages from MongoDB:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Start server
// server.listen(port, () => {
//   console.log(`Express server listening at http://localhost:${port}`);
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const chatGroupRoutes = require("./routes/chatGroupRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/chatgroups", chatGroupRoutes);
app.use("/messages", messageRoutes);

const server = http.createServer(app);
const io = socketIO(server);

const port = Process.env.PORT || 8080;

mongoose.connect(process.env.DB_URL);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group ${groupId}`);
  });

  socket.on("message", async (message) => {
    const savedMessage = await createMessage(message);

    if (savedMessage) {
      io.to(message.groupId).emit("message", savedMessage);
    } else {
      console.error("Error saving message to database");
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
