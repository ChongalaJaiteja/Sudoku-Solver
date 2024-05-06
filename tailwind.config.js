/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "app-font": ["Montserrat", "sans-serif"],
            },
        },
    },
    plugins: [],
};
