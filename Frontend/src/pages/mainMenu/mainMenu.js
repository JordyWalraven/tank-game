
const { remote } = require('electron');

document.getElementById('connectBtn').addEventListener('click', () => {
  const ipAddress = document.getElementById('ipAddress').value;
  const port = document.getElementById('port').value;
  const playerName = document.getElementById('playerName').value;

  if (!ipAddress || !port || !playerName) {
    alert('Please enter an IP address,port number and name');
    return;
  }
  sessionStorage.setItem('ipAddress', ipAddress);
  sessionStorage.setItem('port', port);
  sessionStorage.setItem('playerName', playerName);
  remote.getCurrentWindow().loadFile('src/pages/gamePage/gamePage.html');
});

