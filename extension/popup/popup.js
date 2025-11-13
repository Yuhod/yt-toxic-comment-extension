document.getElementById("scan").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //reload lại trang
    chrome.tabs.reload(tabs[0].id);
    
    // gọi lại model
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        console.log("Page reloaded and rescan triggered");
      }
    });
  });
});

document.getElementById("hideToxic").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                func: () => {
                    // Tìm tất cả comment
                    const comments = document.querySelectorAll("ytd-comment-thread-renderer");
                    let hiddenCount = 0;

                    comments.forEach(comment => {
                        // Tìm nhãn Toxic (màu nền đỏ)
                        const toxicLabel = comment.querySelector('span[style*="background: rgb(244, 67, 54)"]');
                        if (toxicLabel) {
                            comment.style.display = "none";
                            hiddenCount++;
                        }
                    });

                    // Trả lại kết quả cho popup
                    return hiddenCount;
                }
            },
            (results) => {
                // Nhận kết quả trả về từ trang web
                if (results && results[0] && typeof results[0].result === "number") {
                    const hiddenCount = results[0].result;
                    document.getElementById("result").textContent =
                        `Đã ẩn ${hiddenCount} bình luận Toxic.`;
                } else {
                    document.getElementById("result").textContent =
                        "Không tìm thấy bình luận Toxic nào.";
                }
            }
        );
    });
});

document.getElementById("toggleExtension").addEventListener("change", (event) => {
    const isChecked = event.target.checked;
    const scanButton = document.getElementById("scan");
    const hideButton = document.getElementById("hideToxic");
    const statusText = document.getElementById("status"); // Get the status element

    if (isChecked) {
        // Show buttons when toggled on
        scanButton.style.display = "block";
        hideButton.style.display = "block";
        statusText.textContent = "Running"; // Update status to Running

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    const labels = document.querySelectorAll('span[style*="background:"]'); // Select all span elements with background
                    labels.forEach(label => {
                        label.style.display = "inline"; // Show all labels
                    });
                }
            });
        });
    } else {
        // Hide buttons when toggled off
        scanButton.style.display = "none";
        hideButton.style.display = "none";
        
        // Execute script to hide all labels on the webpage
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                    const labels = document.querySelectorAll('span[style*="background:'); // Select all span elements
                    labels.forEach(label => {
                        label.style.display = "none"; // Hide all labels
                    });
                }
            });
        });

        statusText.textContent = "Sleeping"; // Update status to Sleeping
    }
});

