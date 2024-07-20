let currentVideoIndex = 0;
let videos = [];
let totalVideos = 0;
let updateInterval;
let currentArticleIndex = 0;
let totalArticles = 0;
let totalVideoDuration = 0;

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    throw new Error("Invalid duration value");
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    formatted += `${minutes}m `;
  }
  formatted += `${secs}s`;

  return formatted.trim();
}

function parseDuration(durationString) {
  const regex = /(\d+)\s*min\s*,?\s*(\d+)\s*sec|(\d+)\s*sec|(\d+)\s*min/;
  const match = regex.exec(durationString);

  if (!match) return 0;

  const minutes = parseInt(match[1] || 0) + parseInt(match[3] || 0);
  const seconds = parseInt(match[2] || 0) + parseInt(match[4] || 0);

  return minutes * 60 + seconds;
}

//Calculates the total duration of all videos and updates global variable.
function calculateTotalVideoDuration() {
  const sidebar = document.evaluate(
    '//*[@id="scrollableContainer"]/div/div[1]/div/div/div[3]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (sidebar) {
    const durationElements = sidebar.querySelectorAll('p');
    totalVideoDuration = 0;

    durationElements.forEach(p => {
      if (p.textContent.includes('Duration')) {
        const durationText = p.textContent.replace('Duration:', '').trim();
        totalVideoDuration += parseDuration(durationText);
      }
    });

    console.log("Total Duration:", formatDuration(totalVideoDuration));
  } else {
    console.error("Sidebar not found");
  }
}

// Function to update video details and send them to the popup
function updateDetails() {
  const video = document.querySelector('video');
  if (video) {
    const details = {
      status: video.paused ? 'Paused' : 'Playing',
      videoLength: video.duration ? formatDuration(video.duration) : 'N/A',
      // currentTime: video.currentTime ? video.currentTime.toFixed(2) : 'N/A',
      totalVideos: totalVideos,
      currentVideo: currentVideoIndex + 1,
      totalVideoDuration: formatDuration(totalVideoDuration) // Add total video duration here
    };
    chrome.runtime.sendMessage({ action: 'updateDetails', details });
  }
}


// Function to handle video end event
function handleVideoEnd() {
  currentVideoIndex++;
  if (currentVideoIndex < totalVideos) {
    videos[currentVideoIndex].click();
    setTimeout(addVideoEventListener, 1000); // Wait a second for the next video to load
    chrome.runtime.sendMessage({ action: 'nextVideo' });
  } else {
    checkForArticleTab();
    console.log("all videos ended");
  }
}

function checkForArticleTab() {
  const sidebar = document.evaluate(
    '//*[@id="__next"]/div/section[2]/section[1]/div[1]/div[2]/div[1]/div[1]/div[1]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (sidebar) {
    const articleTab = Array.from(sidebar.querySelectorAll('p')).find(p => p.textContent.trim().toLowerCase() === 'articles');
    if (articleTab) {
      articleTab.parentElement.click();
      setTimeout(selectAndNavigateArticles, 1000); // Wait a second for the new sidebar to load
    } else {
      chrome.runtime.sendMessage({ message: 'allVideosEnded' });
      const audio = new Audio(chrome.runtime.getURL('notification.mp3'));
      audio.play();
    }
  } else {
    chrome.runtime.sendMessage({ message: 'allVideosEnded' });
    const audio = new Audio(chrome.runtime.getURL('notification.mp3'));
    audio.play();
  }
}

function selectAndNavigateArticles() {
  const articleSidebar = document.evaluate(
    '//*[@id="scrollableContainer"]/div/div[1]/div/div/div[3]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (articleSidebar) {
    const articles = articleSidebar.querySelectorAll('div > a');
    if (articles.length > 0) {
      let currentArticleIndex = 0;

      function clickNextArticle() {
        if (currentArticleIndex < articles.length) {
          articles[currentArticleIndex].click();
          currentArticleIndex++;

          // Wait for the article to load before clicking the next one
          setTimeout(() => {
            // Wait for the "Next Article" button to appear
            const nextButton = document.querySelector('.ui.green.button');
            if (nextButton) {
              // Click the "Next Article" button
              nextButton.click();
              setTimeout(clickNextArticle, 1000); // Continue to next article
            } else {
              // If there's no "Next Article" button, continue with the next article in the sidebar
              clickNextArticle();
            }
          }, 1000); // Adjust the timeout as necessary to ensure articles load properly
        } else {
          // All articles processed
          chrome.runtime.sendMessage({ message: 'allArticlesEnded' });
          const audio = new Audio(chrome.runtime.getURL('notification.mp3'));
          audio.play();
        }
      }

      // Start the article processing
      clickNextArticle();
    } else {
      chrome.runtime.sendMessage({ message: 'allArticlesEnded' });
    }
  } else {
    chrome.runtime.sendMessage({ message: 'allArticlesEnded' });
  }
}

// Function to check and add event listener to video element
function addVideoEventListener() {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = 2.0; 
    video.play();
    video.removeEventListener('ended', handleVideoEnd); // Remove any existing listener to avoid duplicate calls
    video.addEventListener('ended', handleVideoEnd);
    clearInterval(updateInterval); // Clear any existing interval to avoid duplicates
    updateInterval = setInterval(updateDetails, 1000); // Update details every second
  }
}

// Function to start video playback and monitoring from the currently active video
function startVideos() {
  const sidebar = document.evaluate(
    '//*[@id="scrollableContainer"]/div/div[1]/div/div/div[3]',
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (sidebar) {
    videos = sidebar.querySelectorAll('a');
    totalVideos = videos.length;

    if (totalVideos > 0) {
      // Find the currently active video
      const activeVideoDiv = Array.from(sidebar.querySelectorAll('a')).find(div => div.className.includes('active'));
      
      if (activeVideoDiv) {
        currentVideoIndex = Array.from(videos).indexOf(activeVideoDiv);
        if (currentVideoIndex > -1) {
          videos[currentVideoIndex].click();
          setTimeout(addVideoEventListener, 1000); // Wait a second for the video to load
          calculateTotalVideoDuration()
        }
      }
    }
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'startVideos') {
    console.log("Received startVideos message");
    startVideos();
    sendResponse({ status: "started" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkVideo') {
    const video = document.querySelector('video');
    sendResponse({ videoExists: !!video });
  } 
  return true; 
});

// Observe DOM changes and keep updating video details
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes.length > 0) {
      updateDetails();
    }
  });
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial check in case the video element is already in the DOM
addVideoEventListener();

// Handle navigation and reinitialize the script
window.addEventListener('load', () => {
  currentVideoIndex = 0;
  clearInterval(updateInterval); // Clear the interval to avoid multiple intervals running
});
