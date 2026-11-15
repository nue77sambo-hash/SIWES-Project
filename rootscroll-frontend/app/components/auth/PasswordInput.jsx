"use client";

import { useState } from "react";

export default function PasswordInput({
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
    placeholder,
    autoComplete,
    error,
}) {
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-foreground"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    aria-invalid={!!error}
                    aria-describedby={
                        error ? `${id}-error` : undefined
                    }
                    className={`w-full rounded-lg border bg-background px-4 py-3 pr-14 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent ${
                        error
                            ? "border-red-500"
                            : "border-border"
                    }`}
                />

                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    aria-label={
                        visible ? "Hide password" : "Show password"
                    }
                    aria-pressed={visible}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-muted transition-colors hover:text-accent"
                >
                    {visible ? "Hide" : "Show"}
                </button>
            </div>

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-2 text-xs text-red-500"
                >
                    {error}
                </p>
            )}
        </div>
    );
}