const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');

// Handle source selector clicks (Screen, Tab area, Camera UI toggle)
document.querySelectorAll('.source-option').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.source-option').forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
  });
});

// Handle top tab switching
document.getElementById('recordTab').addEventListener('click', (e) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
});

document.getElementById('videosTab').addEventListener('click', (e) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  statusDiv.innerText = "Saved recordings list coming soon.";
});

startBtn.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ action: "open_recorder" }, async () => {
    startBtn.style.display = "none";
    
    // Slick 3, 2, 1 Countdown matching the studio vibe
    for (let i = 3; i > 0; i--) {
      statusDiv.innerHTML = `<span style="color: #ff2d78; font-weight: bold;">Starting in ${i}s...</span>`;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    statusDiv.innerHTML = '<span style="color: #ff2d78; font-weight: bold;">● Recording Live</span>';
    stopBtn.style.display = "block";
  });
});

stopBtn.addEventListener('click', () => {
  statusDiv.innerText = "Saving recording...";
  stopBtn.style.display = "none";
  chrome.runtime.sendMessage({ action: "stop_offscreen_recording" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "recording_complete") {
    const a = document.createElement('a');
    a.href = message.videoDataUrl;
    a.download = `mona-recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    statusDiv.innerText = "Recording downloaded successfully!";
    startBtn.style.display = "block";
  }
});