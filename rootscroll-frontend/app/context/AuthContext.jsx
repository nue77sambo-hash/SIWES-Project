"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getToken,
} from "../lib/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // RESTORE AUTHENTICATION

    useEffect(() => {
        let active = true;

        const initializeAuth = async () => {
            if (!getToken()) {
                if (active) setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                if (active) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error(
                    "Unable to restore authentication:",
                    error
                );

                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        return () => {
            active = false;
        };
    }, []);

    // HANDLE EXPIRED SESSIONS

    useEffect(() => {
        const handleExpiredSession = () => {
            setUser(null);
        };

        window.addEventListener(
            "rootscroll:session-expired",
            handleExpiredSession
        );

        return () => {
            window.removeEventListener(
                "rootscroll:session-expired",
                handleExpiredSession
            );
        };
    }, []);

    // REFRESH USER

    const refreshUser = async () => {
        if (!getToken()) {
            setUser(null);
            return null;
        }

        try {
            const currentUser = await getCurrentUser();

            setUser(currentUser);

            return currentUser;
        } catch (error) {
            console.error(
                "Unable to refresh user:",
                error
            );

            setUser(null);

            return null;
        }
    };

    // REGISTER

    const register = async (userData) => {
        const data = await registerUser(userData);

        setUser(data.user);

        return data;
    };

    // LOGIN

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        setUser(data.user);

        return data;
    };

    // LOGOUT

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider."
        );
    }

    return context;
};