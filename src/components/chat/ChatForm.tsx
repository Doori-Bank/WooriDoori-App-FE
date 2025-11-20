import React, { useState, useRef, useEffect } from "react";
import { img } from "@/assets/img";

export interface ChatMessage {
  id: string;
  type: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[]; // 챗봇이 제공하는 선택지
}

interface ChatFormProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({
  messages,
  onSendMessage,
  isTyping = false,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
      {/* 채팅 메시지 영역 */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {msg.type === "bot" && (
              <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-10 h-10 rounded-full border border-gray-500 bg-white-500">
                <img
                  src={img.doori_favicon}
                  alt="두리"
                  className="object-contain w-8 h-8"
                />
              </div>
            )}
            <div className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"} max-w-[75%]`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                <p className="text-[1.4rem] whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
              
              <span className={`text-[1rem] text-gray-500 mt-1 ${msg.type === "user" ? "mr-2" : "ml-2"}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.type === "user" && (
              <div className="flex-shrink-0 w-10 h-10" />
            )}
          </div>
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <div className="flex gap-2 justify-start items-end">
            <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-10 h-10 bg-blue-500 rounded-full">
              <img
                src={img.doori_favicon}
                alt="두리"
                className="object-contain w-8 h-8"
              />
            </div>
            <div className="px-4 py-3 bg-white rounded-2xl shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-200 rounded-full px-5 py-3 text-[1.4rem] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="flex justify-center items-center w-12 h-12 text-white bg-blue-500 rounded-full shadow-md transition-all hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg disabled:shadow-none"
          >
            <span className="text-[1.8rem]">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatForm;

