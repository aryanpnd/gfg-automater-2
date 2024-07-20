function waitForContentToLoad(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    function check() {
      let contentLoaded;

      if (selector.startsWith('//')) {
        // Handle XPath
        const xpathResult = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        contentLoaded = xpathResult.singleNodeValue;
      } else {
        // Handle class name (or other CSS selectors)
        contentLoaded = document.querySelector(selector);
      }

      if (contentLoaded) {
        resolve();
      } else if (Date.now() - start >= timeout) {
        reject(new Error('Content did not load within the timeout period.'));
      } else {
        setTimeout(check, 100); // Check every 100ms
      }
    }

    check();
  });
}


async function waitForSubmission(buttonClass, expectedText) {
  const timeout = 10000; // 10 seconds timeout
  const interval = 500; // Check every 500 ms
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkSubmission = () => {
      const buttonContainer = document.getElementsByClassName(buttonClass)[0];
      if (buttonContainer) {
        const buttons = buttonContainer.querySelectorAll("button");
        if (buttons.length > 1) {
          const secondButton = buttons[1];
          if (secondButton.innerText.trim().toLowerCase() === expectedText.toLowerCase()) {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(new Error("Timeout waiting for submission"));
          } else {
            setTimeout(checkSubmission, interval); // Check again after a short delay
          }
        } else {
          reject(new Error("Submit button not found"));
        }
      } else {
        reject(new Error("Button container not found"));
      }
    };

    checkSubmission(); // Start checking
  });
}