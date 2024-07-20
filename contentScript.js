chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === 'StartScript') {
    console.log("Received StartScript message");
    const requiredModules = checkForSection();
    localStorage.setItem("requiredModules", JSON.stringify(requiredModules));
    sendResponse({ status: "started", requiredModules: requiredModules });
  } else if (request.action === 'ClickFirstLink') {
    const { index } = request;
    const requiredModules = JSON.parse(localStorage.getItem("requiredModules"));
    console.log("Received ClickFirstLink message", index, requiredModules);

    if (requiredModules.aTags[index] && requiredModules.aTags[index].hrefs.length > 0) {
      try {
        
        console.log('Anchor tags loaded.');
        
        for (let i = 0; i < requiredModules.aTags[index].hrefs.length; i++) {
          await waitForContentToLoad(`.left_content__contents`)
          const href = requiredModules.aTags[index].hrefs[i];
          const linkElement = Array.from(document.querySelectorAll('a')).find(a => a.href === href);

          if (linkElement) {
            console.log(`Clicking link with href: ${href}`);
            linkElement.click();

            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Starting the bot.');
            await startTheBot();
          } else {
            console.log('Link element not found for href:', href);
          }
        }

      } catch (error) {
        console.error('Error waiting for anchor tags:', error);
      }
    } else {
      console.log('No <a> tags found to click.');
    }
  }
});
