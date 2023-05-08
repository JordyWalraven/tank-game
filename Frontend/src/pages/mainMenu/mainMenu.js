
const { remote } = require('electron');

document.getElementById('connectBtn').addEventListener('click', () => {
  const ipAddress = document.getElementById('ipAddress').value;
  const port = document.getElementById('port').value;
  const playerName = document.getElementById('playerName').value;

  if (!ipAddress || !port || !playerName) {
    alert('Please enter an IP address,port number and name');
    return;
  }
  localStorage.setItem('ipAddress', ipAddress);
  localStorage.setItem('port', port);
  localStorage.setItem('playerName', playerName);
  remote.getCurrentWindow().loadFile('src/pages/gamePage/gamePage.html');
});

document.getElementById('recoverSettings').addEventListener('click', () => {
  document.getElementById('ipAddress').value = localStorage.getItem('ipAddress');
  document.getElementById('port').value = localStorage.getItem('port');
  document.getElementById('playerName').value = localStorage.getItem('playerName');
});

