// background.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // if (request.action === 'nextVideo') {
  //   chrome.notifications.create({
  //     type: 'basic',
  //     iconUrl: 'assets/icon128.png',
  //     title: 'Next Video',
  //     message: 'Moving to the next video.'
  //   });
  // }

  if (request.message === 'allVideosEnded') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'All Videos and article Ended',
      message: 'All videos and articles have finished playing.'
    });

  }

  if (request.message === 'allArticlesEnded') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'All Videos and article Ended',
      message: 'All videos and articles have finished playing.'
    });
    // const audio = new Audio(chrome.runtime.getURL('./notification.mp3'));
    // audio.play();
  }
});
