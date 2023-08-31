import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = ({ show, toastType, toastMessage }) => {
  useEffect(() => {
    if (show) {
      switch (toastType) {
        case "success":
          toast.success(toastMessage,{theme:'colored',position:toast.POSITION.BOTTOM_RIGHT});
          break;
        case "error":
          toast.error(toastMessage,{theme:'colored',position:toast.POSITION.BOTTOM_RIGHT});
          break;
      }
    }
  }, [show]);
  return (
    <>
      <ToastContainer hideProgressBar={true} autoClose={4000} />
    </>
  );
};

export default ToastNotification;
