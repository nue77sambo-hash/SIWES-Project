const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const TOKEN_KEY = "rootscroll_token";

// TOKEN MANAGEMENT

export const getToken = () => {
    if (typeof window === "undefined") return null;

    return sessionStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token) => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    if (typeof window === "undefined") return;

    sessionStorage.removeItem(TOKEN_KEY);
};

// SESSION EXPIRATION

export const handleSessionExpired = () => {
    removeToken();

    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new Event("rootscroll:session-expired")
        );
    }
};

// ERROR HANDLING

const getErrorMessage = (data) => {
    if (!data) {
        return "Something went wrong. Please try again.";
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.detail) return data.detail;
    if (data.message) return data.message;

    if (data.non_field_errors?.length) {
        return data.non_field_errors[0];
    }

    const fieldErrors = Object.values(data)
        .flat(Infinity)
        .filter((error) => typeof error === "string");

    return fieldErrors[0] ||
        "Something went wrong. Please try again.";
};

const authRequest = async (endpoint, options = {}) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );

    const data = await response.json().catch(() => null);

    if (response.status === 401 && options.headers?.Authorization) {
        handleSessionExpired();
    }

    if (!response.ok) {
        const error = new Error(getErrorMessage(data));

        error.status = response.status;
        error.data = data;

        throw error;
    }
    return data;
};

// REGISTER

export const registerUser = async (userData) => {
    const data = await authRequest("/auth/register/", {
        method: "POST",
        body: JSON.stringify(userData),
    });

    if (!data?.token) {
        throw new Error("Registration succeeded, but no authentication token was returned.");
    }

    saveToken(data.token);

    return data;
};

// LOGIN

export const loginUser = async (credentials) => {
    const data = await authRequest("/auth/login/", {
        method: "POST",
        body: JSON.stringify(credentials),
    });

    if (!data?.token) {
        throw new Error("Login succeeded, but no authentication token was returned.");
    }

    saveToken(data.token);

    return data;
};

// GET CURRENT USER

export const getCurrentUser = async () => {
    const token = getToken();

    if (!token) return null;

    return authRequest("/auth/me/", {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    });
};

// LOGOUT

export const logoutUser = async () => {
    const token = getToken();

    try {
        if (token) {
            await authRequest("/auth/logout/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
        }
    } finally {
        removeToken();
    }
};