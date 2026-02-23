import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Incluindo componentes compartilhados do monorepo se existirem
    '../../packages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Usar classe para dark mode
  theme: {
    extend: {
      // Extensões futuras do tema podem ser adicionadas aqui
    },
  },
  plugins: [],
};

export default config;
