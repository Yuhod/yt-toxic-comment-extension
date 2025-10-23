console.log("YouTube Toxic Classifier content script loaded.");

// Hàm gọi background để phân loại comment
function classifyCommentNode(commentEl, text) {
  try {
    chrome.runtime.sendMessage({ type: "classify", text }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("SendMessage failed:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.success) {
        const badge = document.createElement("span");
        badge.innerText = response.label;

        // Đổi màu theo nhãn
        if (response.label.includes("Clean")) {
          badge.style.background = "#4caf50"; // xanh lá
        } else if (response.label.includes("Offensive")) {
          badge.style.background = "#ff9800"; // cam
        } else if (response.label.includes("Toxic")) {
          badge.style.background = "#f44336"; // đỏ
        } else {
          badge.style.background = "#9e9e9e"; // xám
        }

        badge.style.cssText += `
          margin-left: 8px;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 12px;
          color: #fff;
        `;

        commentEl.parentElement.appendChild(badge);
      } else {
        console.error("Classification failed:", response?.error);
      }
    });
  } catch (err) {
    console.error("Extension context invalidated:", err);
  }
}

// Theo dõi sự thay đổi DOM trên trang YouTube
const observer = new MutationObserver(() => {
  const comments = document.querySelectorAll("#content-text");
  comments.forEach((commentEl) => {
    if (commentEl.dataset.checked === "true") return;
    commentEl.dataset.checked = "true";

    const text = commentEl.innerText;
    classifyCommentNode(commentEl, text);
  });
});

observer.observe(document.body, { childList: true, subtree: true });
