import { COLORS } from "./src/constants/colors.constants";
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
		mode: 'jit',
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
			fontFamily: {
        'cursive': ['var(--allura-font)', 'cursive'],
      },
  		colors: COLORS,
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
			backgroundImage: {
        'auth-pattern': "url('/assets/bg/bg-auth.jpg')"
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
