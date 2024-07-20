const startButton = document.getElementById('startButton');
const scripStartButton = document.getElementById('scriptStartButton');
const modulesDropdown = document.getElementById('modulesDropdown');

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
