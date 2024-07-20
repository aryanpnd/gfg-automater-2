// background.js

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'AllLinksProcessed') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title: 'All Problems and Quizzes Ended',
      message: 'Click to open the site.',
      // Add the URL you want to open
      buttons: [
        { title: 'Open Site' }
      ],
      requireInteraction: true // Optional: Keep notification visible until user interacts
    }, function(notificationId) {
      // Add click event listener
      chrome.notifications.onButtonClicked.addListener(async function(notificationId, buttonIndex) {
        if (buttonIndex === 0) {
          const url = "https://www.geeksforgeeks.org/batch/cip-batch-2-sp"; // Replace with your URL

          // Query existing tabs to find if the URL is already open
          chrome.tabs.query({ url: url }, function(tabs) {
            if (tabs.length > 0) {
              // If the URL is already open, focus on the existing tab
              chrome.tabs.update(tabs[0].id, { active: true });
            } else {
              // If the URL is not open, create a new tab
              chrome.tabs.create({ url: url });
            }
          });
        }
      });
    });
  }
});