const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// File Transfer Setup
const uploadDir = path.join(__dirname, 'transfers');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/download', express.static(uploadDir));

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    res.json(files);
  });
});

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

  // Fetch active windows for visual switcher
  socket.on('get-windows', () => {
    const psCommand = `powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle} | Select-Object MainWindowTitle"`;
    exec(psCommand, (error, stdout, stderr) => {
      if (stdout) {
        const titles = stdout.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('MainWindowTitle') && !line.startsWith('---'));
        socket.emit('windows-list', titles);
      }
    });
  });
});

const PORT = 3000;
http.listen(PORT, '0.0.0.0', () => {
  console.log(`\n[+] Dashboard is LIVE!`);
  console.log(`[!] On your phone, go to: http://YOUR-LAPTOP-IP:${PORT}`);
});
