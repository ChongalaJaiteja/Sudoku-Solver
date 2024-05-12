/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                "app-font": ["Montserrat", "sans-serif"],
            },
            screens: {
                xs: "480px",
                sm: "580px",
                md: "770px",
            },
            container: {
                center: true,
            },
        },
    },
    plugins: [],
};
