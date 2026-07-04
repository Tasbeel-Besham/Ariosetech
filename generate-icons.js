const fs = require('fs');
const lucide = require('lucide');

const iconsUsed = ['AlertCircle', 'ArrowLeft', 'ArrowRight', 'BarChart2', 'Briefcase', 'Calendar', 'Check', 'ChevronDown', 'ChevronRight', 'ChevronUp', 'Clock', 'Copy', 'ExternalLink', 'Eye', 'EyeOff', 'FileText', 'Globe', 'GripVertical', 'ImageIcon', 'Layers', 'LayoutDashboard', 'Loader', 'LogOut', 'Mail', 'MapPin', 'Menu', 'MessageCircle', 'MessageSquare', 'Navigation', 'Palette', 'Pencil', 'Phone', 'Plus', 'Redo2', 'RefreshCw', 'Save', 'Search', 'Settings', 'Settings2', 'Star', 'Trash2', 'Undo2', 'Upload', 'Users', 'X'];

let out = `// Generated Icons replacing lucide-react\n`;
out += `import React from 'react';\n\n`;
out += `export interface IconProps extends React.SVGProps<SVGSVGElement> { size?: number | string; color?: string; }\n\n`;

for (const name of iconsUsed) {
  const lookupName = name === 'ImageIcon' ? 'Image' : name;
  const matchEntry = Object.entries(lucide.icons).find(([k]) => k.toLowerCase() === lookupName.toLowerCase());
  const iconData = lucide.icons[lookupName] || (matchEntry && matchEntry[1]);

  if (!iconData) {
    console.log("Missing data for", name, lookupName);
    continue;
  }
  
  const children = Array.isArray(iconData) ? iconData : [];
  const renderedChildren = children.map(([tag, attrs]) => {
    const props = Object.entries(attrs).map(([k, v]) => {
      const reactKey = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `${reactKey}="${v}"`;
    }).join(' ');
    return `<${tag} ${props} />`;
  }).join('\n    ');
  
  out += `export const ${name} = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, color = 'currentColor', ...props }, ref) => (\n`;
  out += `  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>\n`;
  out += `    ${renderedChildren}\n`;
  out += `  </svg>\n`;
  out += `));\n`;
  out += `${name}.displayName = '${name}';\n\n`;
}

// Add Brand Icons manually
out += `export const Facebook = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, color = 'currentColor', ...props }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
));
Facebook.displayName = 'Facebook';

export const Instagram = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, color = 'currentColor', ...props }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
));
Instagram.displayName = 'Instagram';

export const Linkedin = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, color = 'currentColor', ...props }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
));
Linkedin.displayName = 'Linkedin';

export const Twitter = React.forwardRef<SVGSVGElement, IconProps>(({ size = 24, color = 'currentColor', ...props }, ref) => (
  <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
));
Twitter.displayName = 'Twitter';
`;

fs.writeFileSync('components/ui/Icons.tsx', out);
console.log("Generated components/ui/Icons.tsx with Brand Icons");
