import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const TestSocket = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [groupId, setGroupId] = useState("6636382739a500dc88ed7c6a");
  const [customerId, setCustomerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [cusname, setCusname] = useState("");
  const [selname, setSelname] = useState("");

  const socket = useRef(null);

  useEffect(() => {
    console.log("groupID:", groupId);
    fetch(`http://localhost:5000/messages?groupId=${groupId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received messages:", data);
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("groupCreated", ({ groupId }) => {
      console.log("Group created with ID:", groupId);
      setGroupId(groupId);
    });
    console.log("updated groupId:", groupId);

    socket.current.on("message", (message) => {
      console.log("Received message taken:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Clean up the effect
    return () => {
      socket.current.disconnect();
      console.log("Disconnected from server");
    };
  }, []);

  const sendMessage = () => {
    if (!groupId || !userId || !message) {
      console.error("Missing required data");
      return;
    }
    socket.current.emit("message", { groupId, userId, text: message });
    console.log({ groupId, message });
    setMessage("");
  };

  const createNewChatGroup = () => {
    if (!customerId || !cusname || !sellerId || !selname) {
      console.error("Missing required data");
      return;
    }
    socket.current.emit("createAndJoinGroup", {
      userId1: customerId,
      name1: cusname,
      userId2: sellerId,
      name2: selname,
    });
  };

  return (
    <div>
      <h2>Testing Socket.IO</h2>
      <input
        type="text"
        placeholder="Enter your ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="customerId"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />
      <input
        type="text"
        placeholder="cusname"
        value={cusname}
        onChange={(e) => setCusname(e.target.value)}
      />
      <input
        type="text"
        placeholder="sellerId"
        value={sellerId}
        onChange={(e) => setSellerId(e.target.value)}
      />
      <input
        type="text"
        placeholder="selname"
        value={selname}
        onChange={(e) => setSelname(e.target.value)}
      />

      <button onClick={createNewChatGroup}>Create Chat Group</button>
      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        <p>my chat</p>
        {messages.map((message, index) => (
          <li key={index}>{message.text + "  " + message.userId}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestSocket;
