// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "classify") {
    fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC5ROco6NcHJrLF_DPZzNiwa4-_wRlu8FI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Classify the following YouTube comment into one of three categories: 
                    1. Clean 
                    2. Offensive 
                    3. Toxic. 
                    Return only the label.\n\nComment: "${message.text}"`
                }
              ]
            }
          ]
        })
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const label =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Unknown";
        sendResponse({ success: true, label });
      })
      .catch((err) => {
        console.error("API error:", err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // giữ channel mở để sendResponse async
  }
});
