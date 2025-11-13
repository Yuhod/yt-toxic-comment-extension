console.log("YouTube Toxic Classifier content script loaded.");

// Hàm kiểm tra xem có phải là live chat không
function isLiveChatFrame() {
  return window.location.pathname.includes('/live_chat') || 
         document.querySelector('yt-live-chat-app') !== null;
}

// Hàm chờ cho đến khi live chat frame được tải
async function waitForLiveChatAccess() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

// Hàm gọi background để phân loại comment hoặc live chat
function classifyCommentNode(commentEl, text, isLiveChat = false) {
  try {
    chrome.runtime.sendMessage({ type: "classify", text }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("SendMessage failed:", chrome.runtime.lastError.message);
        return;
      }

      if (response?.success) {
        const badge = document.createElement("span");
        badge.innerText = response.label;

        // Đổi màu theo nhãn, chỉ cho phép Clean, Offensive, Toxic
        if (response.label.includes("Clean")) {
          badge.style.background = "#4caf50"; // xanh lá
        } else if (response.label.includes("Offensive")) {
          badge.style.background = "#ff9800"; // cam
        } else if (response.label.includes("Toxic")) {
          badge.style.background = "#f44336"; // đỏ
        } else {
          // Nếu không phải 3 nhãn trên thì không hiển thị badge
          return;
        }

        badge.style.cssText += `
          margin-left: 8px;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: ${isLiveChat ? '10px' : '12px'};
          color: #fff;
        `;

        if (isLiveChat) {
          // Chèn badge vào live chat message
          const messageContainer = commentEl.closest('yt-live-chat-text-message-renderer');
          if (messageContainer) {
            const messageContent = messageContainer.querySelector('#message');
            if (messageContent) {
              messageContent.appendChild(badge);
            }
          }
        } else {
          // Chèn badge vào comment thông thường
          commentEl.parentElement.appendChild(badge);
        }
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
  if (isLiveChatFrame()) {
    // Xử lý live chat messages
    const chatMessages = document.querySelectorAll("yt-live-chat-text-message-renderer #message");
    chatMessages.forEach((messageEl) => {
      if (messageEl.dataset.checked === "true") return;
      messageEl.dataset.checked = "true";

      const text = messageEl.innerText;
      classifyCommentNode(messageEl, text, true);
    });
  } else {
    // Xử lý comments thông thường
    const comments = document.querySelectorAll("#content-text");
    comments.forEach((commentEl) => {
      if (commentEl.dataset.checked === "true") return;
      commentEl.dataset.checked = "true";

      const text = commentEl.innerText;
      classifyCommentNode(commentEl, text, false);
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });
