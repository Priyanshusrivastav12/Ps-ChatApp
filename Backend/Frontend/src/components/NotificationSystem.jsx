import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthProvider';

function NotificationSystem() {
  const { socket } = useSocketContext();
  const [authUser] = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Request notification permission on mount
    if (permission === 'default') {
      Notification.requestPermission().then(result => {
        setPermission(result);
      });
    }
  }, [permission]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('newMessage', (message) => {
      // Only show notification if the user is not actively chatting with the sender
      const isCurrentChat = window.location.pathname.includes('/chat') && 
                          document.visibilityState === 'visible';
      
      if (!isCurrentChat && permission === 'granted') {
        showNotification(message);
      }
      
      // Add to notification queue
      addNotification({
        id: Date.now(),
        type: 'message',
        title: 'New Message',
        message: message.message,
        sender: message.senderName || 'Someone',
        timestamp: new Date(),
        read: false
      });
    });

    // Listen for typing indicators
    socket.on('userTyping', (data) => {
      // Could add typing notifications here if needed
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket, permission]);

  const showNotification = (message) => {
    if (permission !== 'granted') return;

    const notification = new Notification('New Message', {
      body: message.message,
      icon: '/vite.svg', // You can use a custom icon
      badge: '/vite.svg',
      tag: `message-${message.senderId}`, // Prevents duplicate notifications
      requireInteraction: false,
      silent: false
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      // Navigate to the chat with the sender
      notification.close();
    };
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Service Worker registration for background notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <div className="notification-system">
      {/* In-app notification banner */}
      {notifications.filter(n => !n.read).length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications
            .filter(n => !n.read)
            .slice(0, 3)
            .map(notification => (
              <div
                key={notification.id}
                className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg max-w-sm animate-slideIn"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{notification.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-gray-400 hover:text-white ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default NotificationSystem;
