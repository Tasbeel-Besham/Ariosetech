const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync('git grep -l "from \'@/components/ui/Icons\'"').toString().split('\n').filter(Boolean);
const icons = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match ALL imports from our new location (which we just replaced)
  const matches = [...content.matchAll(/import\s+\{([^}]+)\}\s+from\s+'@\/components\/ui\/Icons'/g)];
  for (const match of matches) {
    match[1].split(',').forEach(i => {
      let icon = i.trim();
      if (icon.includes(' as ')) {
        // e.g., Image as ImageIcon, we just want the export name which is ImageIcon for our generated file
        icon = icon.split(' as ')[1].trim();
      }
      if (icon && icon !== 'type LucideIcon') icons.add(icon);
    });
  }
});

console.log([...icons].sort().join(', '));
