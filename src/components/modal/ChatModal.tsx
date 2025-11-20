import React, { useState, useCallback, useEffect } from "react";
import ChatForm, { ChatMessage } from "@/components/chat/ChatForm";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      text: "안녕하세요! 금융 전문가 두리에요. 무엇을 도와드릴까요?",
      timestamp: "오전 10:30",
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 애니메이션 시작
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback((text: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      text,
      timestamp: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).replace("AM", "오전").replace("PM", "오후"),
    };

    setMessages((prev) => [...prev, newUserMessage]);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`flex fixed inset-0 z-50 justify-center items-end transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      } bg-black bg-opacity-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-3xl w-full max-w-[400px] h-[85vh] flex flex-col transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-end items-center p-4 bg-white rounded-t-3xl border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-[2rem] leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* 채팅 폼 */}
        <ChatForm
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatModal;
