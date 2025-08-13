/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            fontSize: {
                'xs': 'var(--font-xs)',
                'sm': 'var(--font-sm)',
                'base': 'var(--font-base)',
                'lg': 'var(--font-lg)',
                'xl': 'var(--font-xl)',
                '2xl': 'var(--font-2xl)',
                '3xl': 'var(--font-3xl)',
            },
            colors: {
                'theme-bg-primary': 'var(--bg-primary)',
                'theme-bg-secondary': 'var(--bg-secondary)',
                'theme-bg-tertiary': 'var(--bg-tertiary)',
                'theme-text-primary': 'var(--text-primary)',
                'theme-text-secondary': 'var(--text-secondary)',
                'theme-text-tertiary': 'var(--text-tertiary)',
                'theme-border': 'var(--border-color)',
                'theme-accent': 'var(--accent-color)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["light"],
                    primary: "#3b82f6",
                    secondary: "#6366f1",
                    accent: "#10b981",
                    neutral: "#374151",
                    "base-100": "#ffffff",
                    "base-200": "#f9fafb",
                    "base-300": "#f3f4f6",
                },
                dark: {
                    ...require("daisyui/src/theming/themes")["dark"],
                    primary: "#3b82f6",
                    secondary: "#6366f1",
                    accent: "#10b981",
                    neutral: "#1f2937",
                    "base-100": "#111827",
                    "base-200": "#1f2937",
                    "base-300": "#374151",
                },
            },
        ],
    },
};