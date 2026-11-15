export default function LoadingState({
    message = "Loading...",
    fullScreen = false,
}) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`
                flex flex-col items-center justify-center gap-4
                ${fullScreen ? "min-h-[70vh]" : "py-12"}
            `}
        >
            {/* Spinner */}
            <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full border-[3px] border-border" />

                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-accent animate-spin" />
            </div>

            {/* Message */}
            <p className="text-sm text-muted tracking-wide">
                {message}
            </p>
        </div>
    );
}