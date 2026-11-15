export const getPostAuthRedirect = () => {
    if (typeof window === "undefined") {
        return "/account";
    }

    const params = new URLSearchParams(
        window.location.search
    );

    const next = params.get("next");

    if (!next) return "/account";

    // Only allow internal paths.
    if (
        !next.startsWith("/") ||
        next.startsWith("//") ||
        next.includes("\\")
    ) {
        return "/account";
    }

    try {
        const destination = new URL(
            next,
            window.location.origin
        );

        // Reject external destinations.
        if (destination.origin !== window.location.origin) {
            return "/account";
        }

        // Prevent authentication redirect loops.
        if (
            destination.pathname === "/login" ||
            destination.pathname === "/register"
        ) {
            return "/account";
        }

        return (
            destination.pathname +
            destination.search +
            destination.hash
        );
    } catch {
        return "/account";
    }
};