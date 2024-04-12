import { Loader } from "lucide-react";

export default function Button({
  type = "button",
  title,
  onClick = () => { },
  loading,
  text,
  children,
  full = false,
  outline = false,
  disabled = false,
  className = "",
}) {
  const classnames = [
    outline
      ? "bg-transparent text-primary hover:bg-primary hover:text-white"
      : "bg-primary text-white hover:opacity-80",
    full ? "w-full" : "block px-4",
    disabled ? "bg-[#e5e5e5] text-white cursor-not-allowed" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type={type}
      title={title}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick(e);
      }}
      className={`focus:outline-none py-2 rounded-lg transition-all duration-300 border-primary border-2 font-medium ${classnames} ${className}`}
    >
      {loading ? (
        <>
          <Loader size="16" className="" />
          <span style={{ paddingLeft: "0.5rem" }}>Loading...</span>
        </>
      ) : (
        text || children
      )}
    </button>
  );
}
