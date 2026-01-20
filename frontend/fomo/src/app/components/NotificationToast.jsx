export default function NotificationToast({ message, type }) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2
        px-6 py-3 rounded-xl text-white
        shadow-lg z-50
        transition-all duration-500 ease-out
        animate-slide-down
        ${colors[type]}
      `}
    >
      {message}
    </div>
  );
}
