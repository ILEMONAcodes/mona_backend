chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "open_recorder") {
    const existingContexts = await chrome.runtime.contexts.matchAll({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length === 0) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Recording screen stream for Mona recorder.'
      });
    }

    chrome.runtime.sendMessage({ action: "start_offscreen_recording" });
    sendResponse({ status: "started" });
  }
});