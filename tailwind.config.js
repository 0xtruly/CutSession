module.exports = {
    content: [
      "./src/**/*.{html,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          "custom-gold": "#E7D27C",
          "custom-gray-100": "#FAFAFA",
          "custom-gray-200": "#737373",
          "custom-gray-300": "#777777",
          "custom-gray-400": "#4C4C4C",
          "custom-gray-500": "#B3B3B3",
          "custom-gray-600": "#443C4D",
          "custom-gray-700": "#72687B",
        },
        borderColor: {
          primary: "rgba(179, 179, 179, 0.25)",
          card: "#EEEDEF",
        },
        boxShadow: {
          s01:"0px 2px 4px -2px rgba(68, 60, 77, 0.12), 0px 4px 4px -2px rgba(68, 60, 77, 0.08)"
        }
      },
    },
    plugins: [],
  }