import { useState, useRef, useEffect } from "react";
import { X, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; sender: "bot" | "user" }[]
  >([{ text: "Welcome! How can I help you?", sender: "bot" }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return <div>{/* Placeholder for future content */}</div>;
};

export default ChatPopup;
