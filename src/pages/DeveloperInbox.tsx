import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InboxIcon, SendIcon, CheckCircle2Icon, ArrowLeftIcon, FolderIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/AppStore';

export function DeveloperInbox() {
  const { currentDeveloper, messagesForDeveloper, projects, sendMessage } = useAppStore();
  const navigate = useNavigate();

  const inboxMessages = messagesForDeveloper(currentDeveloper.id);

  const [selectedClientEmail, setSelectedClientEmail] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Group messages by client email
  const clientEmails = Array.from(new Set(inboxMessages.map((m) => m.clientEmail)));
  const activeEmail = selectedClientEmail || clientEmails[0] || '';
  const conversationMessages = inboxMessages.filter((m) => m.clientEmail === activeEmail);
  const clientName = conversationMessages[0]?.clientName || 'Client';

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeEmail) return;

    sendMessage({
      projectId: conversationMessages[0]?.projectId || projects[0]?.id || 'general',
      developerId: currentDeveloper.id,
      clientName: clientName,
      clientEmail: activeEmail,
      body: replyText.trim(),
      senderRole: 'developer'
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
            onClick={() => navigate('/developer')}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Developer Dashboard
          </button>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <InboxIcon className="h-6 w-6 text-indigo-600" />
            Developer Inbox
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage client inquiries, project proposals, and direct messages.
          </p>
        </div>

        <Link
          to="/developer/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          Upload New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client Contacts List Sidebar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            Client Inquiries ({clientEmails.length})
          </h2>

          <div className="space-y-2">
            {clientEmails.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No client inquiries yet. When a client contacts you, it will show up here.
              </div>
            ) : (
              clientEmails.map((email) => {
                const devMsgs = inboxMessages.filter((m) => m.clientEmail === email);
                const firstMsg = devMsgs[0];
                const isSelected = activeEmail === email;

                return (
                  <button
                    key={email}
                    onClick={() => setSelectedClientEmail(email)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-200 shadow-sm'
                        : 'border-transparent hover:bg-slate-50'
                    }`}>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {firstMsg?.clientName.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{firstMsg?.clientName}</h3>
                        {firstMsg?.budget && (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                            {firstMsg.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{email}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {devMsgs.length} {devMsgs.length === 1 ? 'message' : 'messages'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
          {clientEmails.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Your inbox is empty. When clients contact you regarding your published projects, their inquiries will appear here.
            </div>
          ) : (
            <>
              <div>
                {/* Header for Active Client */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                      {clientName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{clientName}</h2>
                      <p className="text-xs text-slate-500">{activeEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                  {conversationMessages.map((msg) => {
                    const isDeveloper = msg.senderRole === 'developer';
                    const project = projects.find((p) => p.id === msg.projectId);

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isDeveloper ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-md rounded-2xl p-4 text-sm ${
                            isDeveloper
                              ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                              : 'bg-slate-100 text-slate-900 rounded-tl-none border border-slate-200'
                          }`}>
                          <div className="flex items-center justify-between gap-3 text-xs mb-1.5 opacity-80">
                            <span className="font-semibold">
                              {isDeveloper ? 'You (Developer)' : clientName}
                            </span>
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {project && (
                            <div className="flex items-center gap-1.5 text-xs opacity-90 mb-2">
                              <FolderIcon className="h-3.5 w-3.5" />
                              <span>Re: {project.title}</span>
                            </div>
                          )}

                          {msg.budget && (
                            <span className="inline-block mb-2 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 font-semibold">
                              Budget: {msg.budget}
                            </span>
                          )}

                          <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Message Composer */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                {sentSuccess && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                    Reply delivered to {clientName}!
                  </div>
                )}

                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${clientName}...`}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                    <SendIcon className="h-4 w-4" />
                    Reply
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
