const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync('git grep -l "from \'lucide-react\'"').toString().split('\n').filter(Boolean);

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/from\s+'lucide-react'/g, "from '@/components/ui/Icons'");
  fs.writeFileSync(f, content);
  console.log("Updated", f);
});
