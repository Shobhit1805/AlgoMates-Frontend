import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto my-4 sm:my-6 h-[75vh] flex flex-col rounded-2xl border border-base-300 shadow-lg bg-base-100">
        
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300 bg-base-200">
          <h1 className="text-base sm:text-lg font-semibold text-center">
            Chat
          </h1>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                "chat " +
                (user.firstName === msg.firstName
                  ? "chat-end"
                  : "chat-start")
              }
            >
              <div className="chat-header text-xs opacity-70 mb-1">
                {msg.firstName} {msg.lastName}
              </div>

              <div className="chat-bubble max-w-[85%] sm:max-w-[75%]">
                {msg.text}
              </div>

              <div className="chat-footer text-xs opacity-40 mt-1">
                Seen
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="px-3 sm:px-4 py-3 border-t border-base-300 bg-base-200 flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message…"
            className="flex-1 input input-bordered rounded-full text-sm sm:text-base"
          />

          <button
            onClick={sendMessage}
            className="btn btn-primary rounded-full px-5 sm:px-6"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;