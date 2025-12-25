export default function Button({
  children,
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
}) {
  const base =
    "rounded font-medium transition flex items-center justify-center";

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-black text-black hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading ? <span className="animate-pulse">Loading...</span> : children}
    </button>
  );
}
