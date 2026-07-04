const fs = require('fs');
const cp = require('child_process');
const files = cp.execSync('git grep -l "Image as ImageIcon"').toString().split('\n').filter(Boolean);
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/Image as ImageIcon/g, 'ImageIcon');
  fs.writeFileSync(f, content);
  console.log('Updated', f);
});
