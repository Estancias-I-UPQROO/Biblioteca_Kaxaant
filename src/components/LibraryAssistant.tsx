// RUTA: src/components/LibraryAssistant.tsx

"use client";

import React, { useState, useEffect, useRef, type JSX } from 'react';
import {
  FaComment, FaTimes, FaBook, FaSearch, FaQuestionCircle,
  FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';
import './LibraryAssistant.css';

type Category = {
  ID_Categoria_Recursos_Electronicos: string;
  Nombre: string;
};

interface LibraryAssistantProps {
  initialCategories: Category[];
}

export const LibraryAssistant = ({ initialCategories }: LibraryAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string | JSX.Element; isUser: boolean }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickOptions = [
    { text: 'Consulta de horarios', icon: <FaInfoCircle /> },
    { text: 'Búsqueda de libros por categoria', icon: <FaSearch /> },
    { text: 'Préstamos', icon: <FaBook /> },
    { text: 'Renovación de préstamo en línea', icon: <FaBook /> },
    { text: 'Consulta de recursos electrónicos de paga', icon: <FaBook /> },
    { text: 'Contacto directo', icon: <FaQuestionCircle /> },
  ];

  const botResponses: Record<string, JSX.Element> = {
    'consulta de horarios': (
      <>
        Los horarios de atención de la Biblioteca son:<br />
        Lunes a Viernes: 09:00–14:00 y 17:00–20:00<br />
        Sábado y Domingo: Cerrado.
      </>
    ),
    'búsqueda de libros': (
      <>
        Contamos con las siguientes categorías de recursos electrónicos:<br />
        {categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.ID_Categoria_Recursos_Electronicos}>
                • <Link
                  href={`/recursos-electronicos/${category.ID_Categoria_Recursos_Electronicos}`}
                  className="bot-link"
                >
                  {category.Nombre}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span>No hay categorías disponibles en este momento.</span>
        )}
      </>
    ),
    'préstamos': (
      <>
        Para realizar un préstamo:<br />
        1. Acude a la Biblioteca.<br />
        2. Selecciona el libro.<br />
        3. Dirígete con la bibliotecóloga y llena la papeleta.<br />
        <strong>*El ejemplar 1 no está disponible para préstamo.*</strong>
      </>
    ),
    'renovación de préstamo en línea': (
      <>
        Para renovar tu préstamo, visita la sección{' '}
        <Link href="/renovacion" className="bot-link">Renovación</Link>.
      </>
    ),
    'consulta de recursos electrónicos de paga': (
      <>
        Contamos con dos recursos de paga, Digitalia y Pearson.<br />
        Para la descarga y uso de estos, consulta la sección{' '}
        <Link href="/ayuda" className="bot-link">AYUDA</Link>.
      </>
    ),
    'contacto directo': (
      <>
        Puedes escribirnos directamente a:<br />
        ✉️ Lesliee Lizbeth Martínez Rodríguez<br />
        📩 biblioteca@upqroo.edu.mx<br />
      </>
    ),
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    setTimeout(() => {
      setMessages([
        {
          text: '¡Bienvenido a la Biblioteca Virtual Kaxáant! ¿En qué puedo ayudarte?',
          isUser: false,
        },
      ]);
    }, 600);
  }, [isOpen, messages.length]);

  const handleSendMessage = (messageToSend: string) => {
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = messageToSend.toLowerCase();
      let response: string | JSX.Element = (
        <>
          Puedo ayudarte con:<br />
          • Consulta de horarios<br />
          • Búsqueda de libros<br />
          • Préstamos<br />
          • Renovación de préstamo en línea<br />
          • Consulta de recursos electrónicos<br />
          • Contacto directo<br />
          <br />
          Selecciona una opción.
        </>
      );
      
      for (const key in botResponses) {
        if (lowerMessage.includes(key)) {
          response = botResponses[key];
          break;
        }
      }

      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  return (
    <div className="assistant-container">
      <button
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente virtual'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComment size={24} />}
      </button>

      {isOpen && (
        <div className="assistant-chat" ref={chatRef}>
          <div className="chat-header">
            <h3>Asistente Biblioteca Kaxáant</h3>
          </div>

          <div className="chat-body">
            <div className="chat-messages-section">
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                    {typeof msg.text === 'string' ? (
                      msg.text.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="quick-options">
              {quickOptions.map((option, index) => (
                <button
                  key={index}
                  className="quick-option"
                  onClick={() => handleQuickOption(option.text)}
                >
                  {option.icon} {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};