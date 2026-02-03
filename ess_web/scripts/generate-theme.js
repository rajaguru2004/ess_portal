const fs = require('fs');
const path = require('path');

const themePath = path.join(__dirname, '../theme/colors.json');
const cssPath = path.join(__dirname, '../app/globals.css');

// Read JSON
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));

// Helper to generate CSS variables
function generateVariables(colors) {
  return Object.entries(colors)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
}

// Helper to generate @theme block
function generateThemeBlock(colors) {
  return Object.keys(colors)
    .map(key => `  --color-${key}: var(--${key});`)
    .join('\n');
}

const cssContent = `@import "tailwindcss";

:root {
${generateVariables(theme.light)}
  --radius: 0.5rem;
}

@theme inline {
${generateThemeBlock(theme.light)}
}


* {
  border-color: var(--border);
}

body {
  background: var(--background);
  color: var(--foreground);
}
`;

fs.writeFileSync(cssPath, cssContent);
console.log('✅ globals.css updated from theme/colors.json');
