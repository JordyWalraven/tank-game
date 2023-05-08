
const { remote } = require('electron');

document.getElementById('connectBtn').addEventListener('click', () => {
  const ipAddress = document.getElementById('ipAddress').value;
  const port = document.getElementById('port').value;
  const playerName = document.getElementById('playerName').value;

  if (!ipAddress || !port) {
    alert('Please enter an IP address and port number');
    return;
  }

  fetch(`http://${ipAddress}:${port}/canConnect`).then((response) => {
    if (response.status === 200) {
      sessionStorage.setItem('ipAddress', ipAddress);
      sessionStorage.setItem('port', port);
      sessionStorage.setItem('playerName', playerName);
      remote.getCurrentWindow().loadFile('src/pages/gamePage/gamePage.html');
    } else {
      alert('There is no WebSocket server running at that address');
    }
  });
});

