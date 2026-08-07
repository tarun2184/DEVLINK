import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, SendIcon, CheckCircle2Icon, ArrowLeftIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppStore';

export function ClientInbox() {
  const { user, messagesForClient, developers, projects, sendMessage } = useAppStore();
  const navigate = useNavigate();

  const clientEmail = user?.email || 'sarah.j@acme.com';
  const myMessages = messagesForClient(clientEmail);

  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Group messages by developer & project
  const selectedDev = developers.find((d) => d.id === selectedDeveloperId) || developers[0];
  const conversationMessages = myMessages.filter((m) => m.developerId === selectedDev?.id);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedDev) return;

    sendMessage({
      projectId: conversationMessages[0]?.projectId || projects[0]?.id || 'general',
      developerId: selectedDev.id,
      clientName: user?.name || 'Client User',
      clientEmail: clientEmail,
      body: replyText.trim(),
      senderRole: 'client'
    });

    setReplyText('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <MailIcon className="h-6 w-6 text-indigo-600" />
            Client Inbox
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track your project inquiries and developer communications.
          </p>
        </div>

        <Link
          to="/client"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          Browse More Developers
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Developers List Sidebar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            Conversations ({developers.length})
          </h2>

          <div className="space-y-2">
            {developers.map((dev) => {
              const devMsgs = myMessages.filter((m) => m.developerId === dev.id);
              const isSelected = (selectedDeveloperId || developers[0]?.id) === dev.id;
              const hasReplied = devMsgs.some((m) => m.senderRole === 'developer');

              return (
                <button
                  key={dev.id}
                  onClick={() => setSelectedDeveloperId(dev.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                      : 'border-transparent hover:bg-slate-50'
                  }`}>
                  <img
                    src={dev.avatarUrl}
                    alt={dev.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{dev.name}</h3>
                      {hasReplied && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Developer replied" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{dev.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {devMsgs.length} {devMsgs.length === 1 ? 'message' : 'messages'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Conversation Area */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            {/* Header for Selected Developer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDev?.avatarUrl}
                  alt={selectedDev?.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <Link
                    to={`/client/developer/${selectedDev?.id}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                    {selectedDev?.name}
                  </Link>
                  <p className="text-xs text-slate-500">{selectedDev?.title} · {selectedDev?.location}</p>
                </div>
              </div>

              <Link
                to={`/client/developer/${selectedDev?.id}`}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                View Portfolio →
              </Link>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {conversationMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No messages exchanged yet with {selectedDev?.name}. Send your first project inquiry below!
                </div>
              ) : (
                conversationMessages.map((msg) => {
                  const isDeveloper = msg.senderRole === 'developer';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isDeveloper ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-md rounded-2xl p-4 text-sm ${
                          isDeveloper
                            ? 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                            : 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                        }`}>
                        <div className="flex items-center justify-between gap-3 text-xs mb-1.5 opacity-80">
                          <span className="font-semibold">
                            {isDeveloper ? selectedDev?.name : 'You (Client)'}
                          </span>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {msg.budget && (
                          <span className="inline-block mb-2 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 font-semibold">
                            Budget: {msg.budget}
                          </span>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Message Composer */}
          <div className="pt-4 border-t border-slate-100 mt-4">
            {sentSuccess && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                Message delivered to {selectedDev?.name}!
              </div>
            )}

            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Write a message or reply to ${selectedDev?.name.split(' ')[0]}...`}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                <SendIcon className="h-4 w-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
