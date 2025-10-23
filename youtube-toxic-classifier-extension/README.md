# YouTube Toxic Comment Classifier Extension

This Chrome extension classifies toxic comments on YouTube using the Gemini API. It provides visual feedback by inserting color-coded badges next to comments based on their classification.

## Features

- **Real-time Comment Classification**: Automatically classifies comments as clean, offensive, or toxic.
- **Color-Coded Badges**: 
  - Green for clean comments
  - Yellow for offensive comments
  - Red for toxic comments
- **User-Friendly Popup Interface**: Displays classification results and allows user interactions.

## Project Structure

```
youtube-toxic-classifier-extension
├── src
│   ├── content.js          # Logic for observing and classifying YouTube comments
│   ├── background.js       # Handles messages and interacts with the Gemini API
│   ├── popup
│   │   ├── popup.html      # HTML structure for the popup interface
│   │   ├── popup.js        # JavaScript logic for the popup interface
│   │   └── popup.css       # Styles for the popup interface
│   ├── styles
│   │   └── badge.css       # Styles for the classification badges
│   └── utils
│       └── geminiApi.js    # Utility functions for interacting with the Gemini API
├── manifest.json           # Configuration file for the Chrome extension
└── README.md               # Documentation for the project
```

## Setup Instructions

1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd youtube-toxic-classifier-extension
   ```

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click on "Load unpacked" and select the `youtube-toxic-classifier-extension` directory.

3. **Usage**:
   - Navigate to YouTube and start browsing comments.
   - The extension will automatically classify comments and display badges next to them.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.