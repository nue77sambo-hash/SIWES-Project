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

export default function LoginPage() {
    const router = useRouter();

    const { login, loading, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // REDIRECT AUTHENTICATED USERS

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace(getPostAuthRedirect());
        }
    }, [loading, isAuthenticated, router]);

    // FIELD VALIDATION

    const validateField = (name, value) => {
        switch (name) {
            case "identifier":
                if (!value.trim()) {
                    return "Please enter your username or email.";
                }

                return "";

            case "password":
                if (!value) {
                    return "Please enter your password.";
                }

                return "";

            default:
                return "";
        }
    };

    // INPUT CHANGES

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
                general: "",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                general: "",
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
        const fields = ["identifier", "password"];
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
            identifier: true,
            password: true,
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        if (!validateForm()) return;

        setSubmitting(true);
        setErrors({});

        try {
            await login({
                identifier: formData.identifier.trim(),
                password: formData.password,
            });

            router.replace(getPostAuthRedirect());
        } catch (error) {
            const data = error.data || {};

            setErrors({
                identifier: data.identifier?.[0] || "",
                password: data.password?.[0] || "",
                general:
                    data.non_field_errors?.[0] ||
                    data.detail ||
                    data.message ||
                    error.message ||
                    "Unable to sign in. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // AUTHENTICATION INITIALIZATION

    if (loading) {
        return (
            <LoadingState
                message="Checking your session..."
                fullScreen
            />
        );
    }

    if (isAuthenticated) return null;

    return (
        <AuthLayout
            image="/images/auth/young-student-working-assignment.jpg"
            eyebrow="WELCOME BACK"
            title="Return to the archive."
            description="Sign in to continue exploring your collections, saved books and library requests."
            footer={
                <>
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-primary transition-colors hover:text-accent"
                    >
                        Create an account
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

                {/* IDENTIFIER */}

                <div>
                    <label
                        htmlFor="identifier"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Username or email address
                    </label>

                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        value={formData.identifier}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your username or email"
                        autoComplete="username"
                        required
                        aria-invalid={!!errors.identifier}
                        aria-describedby={
                            errors.identifier
                                ? "identifier-error"
                                : undefined
                        }
                        className={`w-full rounded-lg border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent ${
                            errors.identifier
                                ? "border-red-500"
                                : "border-border"
                        }`}
                    />

                    {errors.identifier && (
                        <p
                            id="identifier-error"
                            className="mt-2 text-xs text-red-500"
                        >
                            {errors.identifier}
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password}
                />

                {/* SUBMIT */}

                <LoadingButton
                    loading={submitting}
                    loadingText="Signing in..."
                >
                    Sign in
                </LoadingButton>
            </form>
        </AuthLayout>
    );
}