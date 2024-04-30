import React, { useState, useEffect } from "react";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

const Noty = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [count, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      const response = await fetch(`http://localhost:9000/User/markAsRead/${notification.NotificationID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      if (response.ok) {
        navigate(notification.Link);
      } else {
        console.error("Failed to mark notification as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (notification) => {
    try {
      const response = await fetch(`http://localhost:9000/User/deleteNotification/${notification.NotificationID}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (response.ok) {
        fetchNotifications();
      } else {
        console.error("Failed to delete notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:9000/User/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const data2 = data.map((notification) => ({
          ...notification,
          DateTime: new Date(notification.DateTime).toLocaleDateString("en-GB"),
        }));
        setNotifications(data2);
        setNotificationCount(data2.length);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="noty-icon">
      <div onClick={() => setShowDropdown(!showDropdown)}>
        {count > 0 && <div className="noty-count">{count}</div>}
        <svg
          viewBox="0 0 24 24"
          className="noty-svg"
          fill="#00579e"
          width="33px"
        >
          <g>
            <path d="M21.697 16.468c-.02-.016-2.14-1.64-2.103-6.03.02-2.532-.812-4.782-2.347-6.335C15.872 2.71 14.01 1.94 12.005 1.93h-.013c-2.004.01-3.866.78-5.242 2.174-1.534 1.553-2.368 3.802-2.346 6.334.037 4.33-2.02 5.967-2.102 6.03-.26.193-.366.53-.265.838.102.308.39.515.712.515h4.92c.102 2.31 1.997 4.16 4.33 4.16s4.226-1.85 4.327-4.16h4.922c.322 0 .61-.206.71-.514.103-.307-.003-.645-.263-.838zM12 20.478c-1.505 0-2.73-1.177-2.828-2.658h5.656c-.1 1.48-1.323 2.66-2.828 2.66zM4.38 16.32c.74-1.132 1.548-3.028 1.524-5.896-.018-2.16.644-3.982 1.913-5.267C8.91 4.05 10.397 3.437 12 3.43c1.603.008 3.087.62 4.18 1.728 1.27 1.285 1.933 3.106 1.915 5.267-.024 2.868.785 4.765 1.525 5.896H4.38z" />
          </g>
        </svg>
      </div>
      {showDropdown && (
        <div className="notification-dropdown">
          <ul>
          {notifications.map((notification) => (
            <li key={notification.NotificationID} onClick={() => handleNotificationClick(notification)}>
              <span className="delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification); }}>X</span>
              <div>{notification.Message}</div>
              <div>{notification.DateTime}</div>
            </li>
          ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Noty;