import { FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';
import { chatApi } from '../api/services';
import '../styles/chat-widget.css';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

const initialMessage: ChatMessage = {
  id: 1,
  role: 'assistant',
  text: 'Xin chào! Tôi có thể giúp bạn tìm đồ gia dụng phù hợp.',
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: message }]);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await chatApi.send(message);
      setMessages((current) => [...current, { id: Date.now(), role: 'assistant', text: response.data.message }]);
    } catch (requestError) {
      const serverMessage = axios.isAxiosError(requestError) && requestError.response?.data?.message;
      setError(typeof serverMessage === 'string' ? serverMessage : 'Chatbot đang bận. Bạn vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <section className="chat-panel" aria-label="Chatbot tư vấn">
          <header className="chat-header">
            <div className="chat-avatar"><Bot size={20} /></div>
            <div>
              <strong>Trợ lý gia dụng</strong>
              <span>Luôn sẵn sàng hỗ trợ</span>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Đóng chatbot">
              <X size={19} />
            </button>
          </header>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`chat-message ${message.role}`} key={message.id}>
                <span>{message.text}</span>
              </div>
            ))}
            {loading && <div className="chat-message assistant chat-loading"><LoaderCircle size={15} /> Đang suy nghĩ...</div>}
            <div ref={endRef} />
          </div>

          {error && <p className="chat-error" role="alert">{error}</p>}

          <form className="chat-form" onSubmit={send}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Hỏi về sản phẩm..."
              aria-label="Tin nhắn cho chatbot"
              maxLength={1000}
              disabled={loading}
            />
            <button type="submit" aria-label="Gửi tin nhắn" disabled={loading || !input.trim()}>
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`chat-toggle ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? 'Đóng chatbot' : 'Mở chatbot'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
