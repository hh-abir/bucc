import { useState, useRef, useEffect } from "react";
import { X, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; sender: "bot" | "user" }[]
  >([{ text: "Welcome! How can I help you?", sender: "bot" }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="rounded-full bg-gray-800 p-2 text-white shadow-md transition hover:bg-gray-700"
        >
          <MessageSquare size={20} />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 flex max-h-[75vh] flex-col overflow-hidden rounded-t-lg bg-gray-900 text-white shadow-xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-72 sm:rounded-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-700 p-3">
            <h2 className="text-base font-medium">Chat</h2>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <button onClick={toggleChat} className="hover:text-gray-400">
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatPopup;
