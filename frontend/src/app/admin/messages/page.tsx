"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { deleteMessage, getMessages, markMessageAsRead } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Message } from "@/types/message";

type FilterTab = "all" | "unread";

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) throw new Error("Admin token not found. Please login again.");
      const data = await getMessages(token);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (filter === "unread") {
      return messages.filter((message) => !message.isRead);
    }

    return messages;
  }, [messages, filter]);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.isRead).length,
    [messages]
  );

  const handleMarkRead = async (id: string) => {
    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      const updated = await markMessageAsRead(id, token);
      setMessages((prev) => prev.map((message) => (message.id === id ? updated : message)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to mark message as read");
    }
  };

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message);

    if (message.isRead) {
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      const updated = await markMessageAsRead(message.id, token);
      setMessages((prev) => prev.map((item) => (item.id === message.id ? updated : item)));
      setSelectedMessage(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to mark message as read");
    }
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    const token = getToken();
    if (!token) {
      setError("Admin token not found. Please login again.");
      return;
    }

    try {
      await deleteMessage(messageToDelete.id, token);
      setMessages((prev) => prev.filter((message) => message.id !== messageToDelete.id));
      setMessageToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete message");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-slate-900">
            Message Management
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review contact submissions and manage response status.
          </p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
          {unreadCount} unread
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          Unread
        </button>
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-t border-slate-100">
                    <td className="px-4 py-4" colSpan={5}>
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              : null}

            {!loading && filteredMessages.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={5}>
                  No messages found for this filter.
                </td>
              </tr>
            ) : null}

            {!loading
              ? filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    onClick={() => handleOpenMessage(message)}
                    className={`border-t border-slate-100 ${
                      !message.isRead ? "bg-blue-50/40" : "bg-white"
                    } cursor-pointer transition-colors hover:bg-slate-50`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{message.name}</td>
                    <td className="px-4 py-3 text-slate-600">{message.email}</td>
                    <td className="max-w-md px-4 py-3 text-slate-700">
                      <p className="line-clamp-3">{message.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          !message.isRead
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {!message.isRead ? "Unread" : "Read"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {!message.isRead ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleMarkRead(message.id);
                            }}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Mark Read
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setMessageToDelete(message);
                          }}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {messageToDelete ? (
        <Modal
          title="Delete Message"
          message={`Delete message from ${messageToDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setMessageToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}

      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-slate-900">
                  Message from {selectedMessage.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{selectedMessage.email}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  selectedMessage.isRead
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {selectedMessage.isRead ? "Read" : "Unread"}
              </span>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedMessage.message}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessageToDelete(selectedMessage);
                  setSelectedMessage(null);
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
