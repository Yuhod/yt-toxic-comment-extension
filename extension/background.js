// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "classify") {
    // Gửi yêu cầu POST đến API Hugging Face Space của bạn
    fetch("https://babyboo04-toxic-yt-comments.hf.space/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API request failed");
        return res.json();
      })
      .then((data) => {
        if (data.label) {
          sendResponse({ success: true, label: data.label });
        } else {
          sendResponse({ success: false, error: "No label returned" });
        }
      })
      .catch((err) => {
        console.error("API error:", err);
        sendResponse({ success: false, error: err.message });
      });

    // Giữ channel mở để xử lý async response
    return true;
  }
});
