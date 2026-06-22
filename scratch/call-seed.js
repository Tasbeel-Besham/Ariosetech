const http = require('http');

function call(url) {
  return new Promise((resolve, reject) => {
    console.log('Sending request to:', url);
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Data:', data);
        resolve();
      });
    }).on('error', (err) => {
      console.error('Request failed:', err.message);
      reject(err);
    });
  });
}

async function run() {
  try {
    await call('http://localhost:3000/api/seed-wordpress?secret=f7c345439c3e1362495faea1d545efd9992e85b09efe800919f5e6ea9d2795f5');
    await call('http://localhost:3000/api/seed?secret=f7c345439c3e1362495faea1d545efd9992e85b09efe800919f5e6ea9d2795f5');
    console.log('Both seed calls completed!');
    process.exit(0);
  } catch (e) {
    console.error('Error during seeds:', e);
    process.exit(1);
  }
}

run();
