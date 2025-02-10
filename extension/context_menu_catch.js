document.addEventListener('contextmenu', function(event) {
    chrome.runtime.sendMessage({
      action: "contextMenuClicked",
      x: event.pageX,
      y: event.pageY
    });
  });