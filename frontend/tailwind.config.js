/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#111111",
        obsidian: "#0f0f0f",
        gold: "#7a1f2b",
        cream: "#f8f5f0",
        emerald: "#1f3d37",
        mist: "#ffffff",
        sand: "#6b6b6b"
      },
      fontFamily: {
        display: ["Playfair Display", "Cinzel", "serif"],
        body: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 50px rgba(17,17,17,0.12)",
        glow: "0 20px 50px rgba(184,138,47,0.18)"
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(247,245,243,1) 100%)",
        "lux-gradient":
          "linear-gradient(135deg, rgba(122,31,43,0.08) 0%, rgba(255,255,255,1) 55%, rgba(248,246,244,1) 100%)"
      }
    }
  },
  plugins: []
};
