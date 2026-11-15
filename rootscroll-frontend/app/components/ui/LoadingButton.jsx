"use client";

export default function LoadingButton({
  children,
  loading = false,
  loadingText = "Please wait...",
  disabled = false,
  type = "submit",
  className = "",
  onClick,
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`
                flex w-full items-center justify-center gap-2
                rounded-lg bg-primary px-5 py-3.5
                text-sm font-semibold text-white
                transition-all hover:opacity-90
                disabled:cursor-not-allowed disabled:opacity-60
                ${className}
            `}
            onClick={onClick}
        >
            {loading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
}