const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { exec } = require('child_process');
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Phone connected!');

  // Handle Swipe/App Switching
  socket.on('switch-app', (direction) => {
    const key = direction === 'right' ? '^!{Right}' : '^!{Left}';
    // This calls your AutoHotkey script via command line
    exec(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${key}')"`);
  });

  // Handle Terminal Commands
  socket.on('terminal-cmd', (cmd) => {
    exec(cmd, (error, stdout, stderr) => {
      socket.emit('terminal-res', stdout || stderr);
    });
  });
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`\n[+] Dashboard is LIVE!`);
  console.log(`[!] On your phone, go to: http://YOUR-LAPTOP-IP:${PORT}`);
});
