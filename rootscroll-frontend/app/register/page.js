"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthLayout from "../components/auth/AuthLayout";
import PasswordInput from "../components/auth/PasswordInput";
import LoadingState from "../components/ui/LoadingState";
import LoadingButton from "../components/ui/LoadingButton";

import { useAuth } from "../context/AuthContext";
import { getPostAuthRedirect } from "../lib/redirect";

export default function RegisterPage() {
    const router = useRouter();

    const { register, loading, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Redirect authenticated users.
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace(getPostAuthRedirect());
        }
    }, [loading, isAuthenticated, router]);

    // FIELD VALIDATION

    const validateField = (name, value, values = formData) => {
        switch (name) {
            case "username":
                if (!value.trim()) {
                    return "Please enter a username.";
                }

                if (value.trim().length < 3) {
                    return "Username must contain at least 3 characters.";
                }

                if (value.trim().length > 150) {
                    return "Username cannot exceed 150 characters.";
                }

                return "";

            case "email":
                if (!value.trim()) {
                    return "Please enter your email address.";
                }

                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                ) {
                    return "Please enter a valid email address.";
                }

                if (value.trim().length > 254) {
                    return "Email address is too long.";
                }

                return "";

            case "password":
                if (!value) {
                    return "Please create a password.";
                }

                if (value.length < 8) {
                    return "Password must contain at least 8 characters.";
                }

                return "";

            case "confirmPassword":
                if (!value) {
                    return "Please confirm your password.";
                }

                if (value !== values.password) {
                    return "Your passwords do not match.";
                }

                return "";

            default:
                return "";
        }
    };

    // INPUT CHANGES

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedData);

        // Revalidate fields once the user has interacted with them.
        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(
                    name,
                    value,
                    updatedData
                ),
                general: "",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                general: "",
            }));
        }

        // Changing password should also revalidate confirmation.
        if (name === "password" && touched.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField(
                    "confirmPassword",
                    updatedData.confirmPassword,
                    updatedData
                ),
            }));
        }
    };

    // FIELD BLUR

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    // FORM VALIDATION

    const validateForm = () => {
        const fields = [
            "username",
            "email",
            "password",
            "confirmPassword",
        ];

        const newErrors = {};

        fields.forEach((field) => {
            const message = validateField(
                field,
                formData[field]
            );

            if (message) {
                newErrors[field] = message;
            }
        });

        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // BACKEND FIELD ERRORS

    const handleServerErrors = (error) => {
        const data = error.data || {};

        const fieldErrors = {};

        ["username", "email", "password"].forEach((field) => {
            if (data[field]) {
                fieldErrors[field] = Array.isArray(data[field])
                    ? data[field][0]
                    : data[field];
            }
        });

        const generalError =
            data.non_field_errors?.[0] ||
            data.detail ||
            data.message ||
            "";

        setErrors({
            ...fieldErrors,
            general:
                generalError ||
                (Object.keys(fieldErrors).length
                    ? ""
                    : error.message ||
                      "Registration failed. Please try again."),
        });
    };

    // SUBMIT

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (!validateForm()) return;

        setSubmitting(true);
        setErrors({});

        try {
            await register({
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            router.replace(getPostAuthRedirect());
        } catch (error) {
            handleServerErrors(error);
        } finally {
            setSubmitting(false);
        }
    };

    // AUTHENTICATION INITIALIZATION

    if (loading) {
        return (
            <LoadingState
                message="Preparing your account..."
                fullScreen
            />
        );
    }

    if (isAuthenticated) return null;

    return (
        <AuthLayout
            image="/images/auth/kevin-canlas-QYHehJ9Iovs-unsplash.jpg"
            eyebrow="JOIN THE ARCHIVE"
            title="Create your account."
            description="Begin your journey through the knowledge, ideas, and literature behind the world of computing."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary transition-colors hover:text-accent"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
            >
                {/* GENERAL ERROR */}

                {errors.general && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
                    >
                        {errors.general}
                    </div>
                )}

                {/* USERNAME */}

                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Choose a username"
                        autoComplete="username"
                        maxLength={150}
                        required
                        aria-invalid={!!errors.username}
                        aria-describedby={
                            errors.username
                                ? "username-error"
                                : undefined
                        }
                        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent ${
                            errors.username
                                ? "border-red-500"
                                : "border-border"
                        }`}
                    />

                    {errors.username && (
                        <p
                            id="username-error"
                            className="mt-2 text-xs text-red-500"
                        >
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* EMAIL */}

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="you@example.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={
                            errors.email
                                ? "email-error"
                                : undefined
                        }
                        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent ${
                            errors.email
                                ? "border-red-500"
                                : "border-border"
                        }`}
                    />

                    {errors.email && (
                        <p
                            id="email-error"
                            className="mt-2 text-xs text-red-500"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* PASSWORD */}

                <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    error={errors.password}
                />

                {/* CONFIRM PASSWORD */}

                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                />

                <p className="text-xs leading-5 text-muted">
                    Use at least 8 characters. Choose a password
                    that is difficult for others to guess.
                </p>

                {/* SUBMIT */}

                <LoadingButton
                    loading={submitting}
                    loadingText="Creating account..."
                >
                    Create account
                </LoadingButton>

                <p className="text-center text-xs leading-5 text-muted">
                    By creating an account, you agree to use
                    RootScroll responsibly and respect the
                    library's reservation policies.
                </p>
            </form>
        </AuthLayout>
    );
}