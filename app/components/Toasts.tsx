import { Toaster } from "react-hot-toast";

const Toasts = () => {
  return (
    <Toaster
      toastOptions={{
        className: "toasts",
        style: {
          //border: "1px solid #000",
          boxShadow: "0px 3px 4px 3px rgba(0, 0, 0, 0.25)",
        },
        success: {
          iconTheme: {
            primary: "#1671d9",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default Toasts;
