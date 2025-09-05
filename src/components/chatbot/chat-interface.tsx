/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useChat } from "@ai-sdk/react";
import ChatForm from "./chat-form";
import MessagesCard from "./messages-card";
import { chatApiMiddleware } from "@/utils/api";
import {
  ChatOption,
  CONSULTATION_MESSAGE,
  ESTIMATE_MESSAGE,
  INITIAL_MESSAGE,
} from "@/utils/constants";

interface ChatInterfaceProps {
  inModal?: boolean;
}

export default function ChatInterface({ inModal = false }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, setMessages, status } = useChat({
    initialMessages: INITIAL_MESSAGE,
    api: "/api/chat",
    onResponse(response) {
      console.log(response, "response");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // @ts-ignore
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    handleInputChange({ target: { value: "" } } as any);

    try {
      const assistantResponse = await chatApiMiddleware([
        ...messages,
        userMessage,
      ]);

      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleOptionSelect = async (option: ChatOption) => {
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: option.text,
    };

    // @ts-ignore
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const contextualMessage = {
        id: (Date.now() + 1).toString(),
        role: "user",
        content: `User selected option: ${option.value} - ${option.text}. Please provide appropriate follow-up questions and service recommendations based on this selection for The SciTech & IP Law Firm.`,
      };

      const assistantResponse = await chatApiMiddleware([
        ...messages,
        userMessage,
        contextualMessage,
      ]);

      const responseWithActions = {
        ...assistantResponse,
        showEstimateButton: option.value === "guidance",
        showConsultationButton: option.value === "pdf" ? false : true,
        showPDFButton: option.value === "pdf",
      };

      setMessages((prevMessages) => [...prevMessages, responseWithActions]);
    } catch (error) {
      console.error("Error handling option selection:", error);
    }
  };

  const handleEstimateRequest = () => {
    // @ts-ignore
    setMessages((prevMessages) => [...prevMessages, ESTIMATE_MESSAGE]);

    console.log("Redirecting to estimate form...");
  };

  const handleConsultationRequest = () => {
    // @ts-ignore
    setMessages((prevMessages) => [...prevMessages, CONSULTATION_MESSAGE]);

    console.log("Opening scheduling system...");
  };

  return (
    <div
      className={`flex flex-col ${
        inModal
          ? "h-[calc(600px-64px)]"
          : "h-[calc(100vh-12rem)] max-w-3xl mx-auto"
      }`}
    >
      <MessagesCard
        calendlyUrl="https://calendly.com/ahussain-digitalauxilius/30min"
        status={status}
        inModal={inModal}
        messages={messages}
        onOptionSelect={handleOptionSelect}
        onEstimateRequest={handleEstimateRequest}
        onConsultationRequest={handleConsultationRequest}
      />
      <ChatForm
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
