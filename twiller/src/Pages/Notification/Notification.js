import React, { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../../context/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const { t } = useTranslation();

  const ToastDisplay = () => (
    <div>
      <p>
        <b>{notification?.title}</b>
      </p>
      <p>{notification?.body}</p>
    </div>
  );

  useEffect(() => {
    requestForToken();
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
      })
      .catch((error) => console.log(t("notification.error"), error));
  }, []);

  useEffect(() => {
    if (notification?.title) {
      toast(<ToastDisplay />);
    }
  }, [notification]);

  return <Toaster />;
};

export default Notification;
