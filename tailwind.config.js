/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const values = [5, 10, 15, 20, 25, 30];

      const clipPathUtilities = values.reduce((acc, px) => {
        acc[`.cut-top-left-${px}`] = { '--cut-top-left': `${px}px` };
        acc[`.cut-top-right-${px}`] = { '--cut-top-right': `${px}px` };
        acc[`.cut-bottom-left-${px}`] = { '--cut-bottom-left': `${px}px` };
        acc[`.cut-bottom-right-${px}`] = { '--cut-bottom-right': `${px}px` };

        acc[`.cut-top-${px}`] = { '--cut-top-left': `${px}px`, '--cut-top-right': `${px}px` };
        acc[`.cut-bottom-${px}`] = { '--cut-bottom-left': `${px}px`, '--cut-bottom-right': `${px}px` };
        acc[`.cut-left-${px}`] = { '--cut-top-left': `${px}px`, '--cut-bottom-left': `${px}px` };
        acc[`.cut-right-${px}`] = { '--cut-top-right': `${px}px`, '--cut-bottom-right': `${px}px` };

        return acc;
      }, {});

      addUtilities({
        ...clipPathUtilities,
        '.cut': {
          clipPath: `
            polygon(
              var(--cut-top-left, 0px) 0%,
              calc(100% - var(--cut-top-right, 0px)) 0%,
              100% var(--cut-top-right, 0px),
              100% calc(100% - var(--cut-bottom-right, 0px)),
              calc(100% - var(--cut-bottom-right, 0px)) 100%,
              var(--cut-bottom-left, 0px) 100%,
              0% calc(100% - var(--cut-bottom-left, 0px)),
              0% var(--cut-top-left, 0px)
            )
          `,
        },
      });
    }),
    require('tailwindcss-animate'), // eslint-disable-line global-require
  ],
};
