import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useSupportListMutation } from '@/services/users';

export const SupportPage: React.FC = () => {
  const [supportList] = useSupportListMutation();
  const { isMobile } = useSidebar();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await supportList({ email, message });
    if (res.data?.success) setSubmitted(true);
  };

  return (
    <div className="p-2 md:p-8 w-full h-full">
      {isMobile && <SidebarTrigger className="-ml-1" />}
      <h1 className="text-2xl font-semibold">Support</h1>
      <h3 className="text-sm">Please contact us if you&#39;re having trouble with your account</h3>

      <div className="flex md:gap-6 mt-6 p-2 md:p-6 bg-transparent/10">
        <main className="flex-1 mx-2">
          <div className="w-full max-w-lg bg-[color:var(--card)] text-[color:var(--card-foreground)] p-6">
            {submitted ? (
              <p className="text-green-400 text-center font-medium">Thank you! Your message has been sent.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <span className="font-medium mb-1">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="
                    border rounded-sm bg-accent/20 px-3 py-2
                    outline-none
                    focus:ring-1 focus:ring-[--main-button]
                    focus:ring-offset-2
                    transition
                  "
                />

                <span className="font-medium mb-1">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Your message here..."
                  className="
                    border rounded-sm bg-accent/20 px-3 py-2
                    outline-none
                    focus:ring-1 focus:ring-[--main-button]
                    focus:ring-offset-2
                    transition
                  "
                />

                <Button type="submit" className="self-start px-4 py-2 bg-[--main-button-dark] text-white rounded-lg">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
