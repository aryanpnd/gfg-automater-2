# GFG Automater

**GFG Automater** is a Chrome extension designed to automate the process of interacting with problems and quizzes on the GeeksforGeeks website. It helps users navigate through problems and quizzes by automating clicks, submissions, and interactions.

## Features

- **Automate Problem and Quiz Navigation**: Automatically navigate through and interact with problems and quizzes on GeeksforGeeks.
- **Manage Modules**: Load and select different modules from a dropdown in the extension popup.
- **Notifications**: Receive notifications when all problems and quizzes have been processed.
- **Tab Management**: Open a specific URL in a new or existing tab based on user interaction.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/gfg-automater.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd gfg-automater
   ```

3. **Load the extension in Chrome:**

   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" (toggle switch at the top right).
   - Click "Load unpacked" and select the project directory.

## Files

- **`manifest.json`**: Contains metadata about the extension and its permissions.
- **`popup.html`**: The HTML file for the extension's popup UI.
- **`popup.js`**: JavaScript file that handles the popup logic and user interactions.
- **`contentScript.js`**: Handles interactions with the GeeksforGeeks website and automates tasks.
- **`background.js`**: Manages background tasks and notifications.
- **`assets/icon128.png`**: The icon used for notifications.

## Usage

1. **Open the GeeksforGeeks website** in a tab.

2. **Click the extension icon** in the Chrome toolbar to open the popup.

3. **Load Sections**:
   - Click the "Load Sections" button to populate the dropdown with available modules.

4. **Start Automation**:
   - Select a module from the dropdown.
   - Click the "StartScript" button to begin automation. The extension will navigate through the selected module's links, interact with problems, and submit code.

5. **Notifications**:
   - Receive notifications when all problems and quizzes are processed.

## Development

### Adding New Features

1. **Update `contentScript.js`** to handle new interactions or modify existing ones.
2. **Update `popup.js`** to add new UI elements or functionality.
3. **Modify `background.js`** to manage additional background tasks or notifications.

### Building the Extension

1. **Ensure all changes are made** and tested.
2. **Reload the extension** in Chrome by clicking the reload icon on the `chrome://extensions/` page.

## Contributing

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your changes.
3. **Make your changes** and test them.
4. **Submit a pull request** with a description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com).

---

Feel free to adjust the README content based on your specific needs and preferences!