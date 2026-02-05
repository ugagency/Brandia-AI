
import React from 'react';

export const SYSTEM_LOGO_SVG = `
<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="60" letter-spacing="8" fill="#39FF6A">STRATYX</text>
</svg>
`;

// This is a stylized version of the logo provided in the image
// Using React.createElement instead of JSX to fix syntax errors in a .ts file
export const LogoComponent = ({ className = "h-8" }: { className?: string }) => (
  React.createElement('div', { className: className },
    React.createElement('svg', { 
      className: "w-full h-full", 
      viewBox: "0 0 530 100", 
      fill: "none", 
      xmlns: "http://www.w3.org/2000/svg" 
    },
      React.createElement('text', { 
        x: "0", 
        y: "75", 
        fill: "#39FF6A", 
        style: { font: 'bold 85px Inter, sans-serif', letterSpacing: '0.1em' } 
      }, 'STRATYX')
    )
  )
);
