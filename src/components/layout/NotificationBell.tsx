"use client";

import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const formatTime = (createdAt: Timestamp | string | undefined) => {
    if (!createdAt) return "";
    const date = createdAt instanceof Timestamp
      ? createdAt.toDate()
      : new Date(createdAt as string);
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return "fa-box";
      case "product": return "fa-tag";
      case "rfq": return "fa-file-invoice";
      case "status": return "fa-circle-check";
      default: return "fa-bell";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order": return "text-blue-500";
      case "product": return "text-green-500";
      case "rfq": return "text-purple-500";
      case "status": return "text-amber-500";
      default: return "text-gray-500";
    }
  };

  const handleNotificationClick = async (n: (typeof notifications)[0]) => {
    if (!n.isRead && n.id) await markRead(n.id);
    if (n.link) {
      setOpen(false);
      router.push(n.link);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <i className="fa-solid fa-bell text-white text-lg"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-brand-ink text-sm">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-brand-green-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <i className="fa-regular fa-bell-slash text-3xl mb-3"></i>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition flex gap-3 items-start ${!n.isRead ? "bg-blue-50/50" : ""}`}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!n.isRead ? "bg-blue-100" : "bg-gray-100"}`}>
                    <i className={`fa-solid ${getIcon(n.type)} text-sm ${getIconColor(n.type)}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-tight ${!n.isRead ? "font-semibold text-brand-ink" : "font-medium text-gray-700"}`}>
                        {n.title}
                      </p>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 text-center">
              <p className="text-xs text-gray-400">{notifications.length} notification{notifications.length > 1 ? "s" : ""} total</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
