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
      ) : null}
    </div>
  );
};

export default ChatPopup;
