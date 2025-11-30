import React, { useState } from 'react';

import { useSupportListMutation } from '@/services/users';

export const SupportPage: React.FC = () => {
  const [supportList] = useSupportListMutation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await supportList({ email, message });
    if (res.data?.success) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[color:var(--card)] text-[color:var(--card-foreground)] p-6 rounded-[var(--radius)] shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>

        {submitted ? (
          <p className="text-green-400 text-center font-medium">Thank you! Your message has been sent.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <span className="font-medium mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bg-[color:var(--input)] border border-[color:var(--border)] text-[color:var(--main-text)] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--main-button)]"
            />

            <span className="font-medium mb-1">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Your message here..."
              className="bg-[color:var(--input)] border border-[color:var(--border)] text-[color:var(--main-text)] rounded px-3 py-2 h-40 md:h-50 resize-none focus:outline-none focus:ring-2 focus:ring-[color:var(--main-button)]"
            />

            <button
              type="submit"
              className="md:w-40 bg-[color:var(--main-button)] text-[color:var(--main-button-text)] px-4 py-2 hover:bg-[color:var(--main-button-hover)] transition-shadow shadow-[var(--main-button-shadow)]"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
