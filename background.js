console.log("Background script loaded!");

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);

    if (message.action === "open_dashboard") {
        const dashboardUrl = chrome.runtime.getURL("dashboard.html");
        console.log("Attempting to open:", dashboardUrl);
        
        chrome.tabs.create({ url: dashboardUrl }, (newTab) => {
            if (chrome.runtime.lastError) {
                console.error("Error creating tab:", chrome.runtime.lastError.message);
            } else {
                console.log("Tab created successfully:", newTab.id);
            }
        });
    }
});
