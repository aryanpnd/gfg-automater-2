const startButton = document.getElementById('startButton');
const scripStartButton = document.getElementById('scriptStartButton');
const modulesDropdown = document.getElementById('modulesDropdown');
const modulesDropdownLabel = document.getElementsByClassName('modulesDropdownLabel');

document.addEventListener('DOMContentLoaded', function () {
  const targetUrl = "https://www.geeksforgeeks.org/batch/cip-batch-2-sp";

  chrome.tabs.query({}, function (tabs) {
    let targetTab = tabs.find(tab => tab.url.includes(targetUrl));

    const bodyElement = document.getElementById("body");
    const inactiveBodyElement = document.getElementById("inactive-body");
    const inactiveBodyTextElement = document.getElementById("inactive-body-text");
    const openWebsiteButton = document.getElementById("openWebsite");

    if (targetTab) {
      if (bodyElement) {
        bodyElement.style.display = "block";
      }
      if (inactiveBodyElement) {
        inactiveBodyElement.style.display = "none";
      }
      return
    } else {
      if (bodyElement) {
        bodyElement.style.display = "none";
      }
      if (inactiveBodyElement) {
        inactiveBodyElement.style.display = "block";
      }
      if (inactiveBodyTextElement) {
        inactiveBodyTextElement.textContent = "Website not open. Click to open.";
      }

      if (openWebsiteButton) {
        openWebsiteButton.style.display = "block";
        openWebsiteButton.addEventListener("click", function () {
          chrome.tabs.create({ url: targetUrl, active: true }, function (newTab) {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === newTab.id && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                alert('Website loaded, please open the videos you want to automate');
              }
            });
          });
        });
      }
    }
  });

});


if (startButton) {
  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'StartScript' }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log(response.status);
          if (response.status === "started" && response.requiredModules) {
            const modules = response.requiredModules;
            modulesDropdown.innerHTML = ''; // Clear existing options
            localStorage.setItem('requiredModules', JSON.stringify(modules)); // Store modules in localStorage
            modules.aTags.forEach((module, index) => {
              const option = document.createElement('option');
              option.value = index; // Use index to identify the module
              option.textContent = modules.titles[index];
              modulesDropdown.appendChild(option);
            });
          }
        }
      });
    });
    startButton.style.display = "none"
    scripStartButton.style.display = "block"
  });
}

if (scripStartButton) {
  scripStartButton.addEventListener('click', function () {
    console.log("clicked scriptStartButton");
    const selectedIndex = modulesDropdown.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'ClickFirstLink',
        index: selectedIndex,
      });
    });
  });
}
