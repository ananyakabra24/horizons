// USED TO CREATE DOUBTS

// making the page show the button if youtube.com is the current page, and if it has fully loaded

function showButton() {
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) return; // if no video player means we're on home or something so function does nothing
    if (document.querySelector('.doubt-btn') || document.querySelector('.doubt-view-btn')) return; // if both buttons already exist do nothing

    // first button, to mark doubt
    const button = document.createElement('button');
    button.textContent = 'Mark doubt 🤔';
    button.className = 'doubt-btn';
    button.style.cssText = ` 
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 16px;
        background-color: black;
        color: white;
        border: 2px solid white;
        border-radius: 18px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Roboto', Arial, sans-serif;
        transition: background-color 0.2s;
    `;

    button.onmouseenter = () => button.style.backgroundColor = '#2d8fdd';
    button.onmouseleave = () => button.style.backgroundColor = 'black';

    button.onclick = () => {
        // Get the current video element
        const video = document.querySelector('video');
        if (!video) {
            alert('No video found!');
            return;
        } //no video element visible so return (if some error)
        
        // Get current time in seconds for the timestamp
        const currentSeconds = video.currentTime;
        
        // convert to basic timestamp format 
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = Math.floor(currentSeconds % 60);
        const timestamp = `${minutes}:${seconds.toString().padStart(2, '0')}`; //new variable showing timestamp in basic timestamp format
        
        //ask (have to be converted into a better popup instead of system popup)
        const doubtText = prompt(`What's your doubt at ${timestamp}?`, '');
        
        //cancel is clicked anywhere else
        if (!doubtText) return;
        
        // doubt object - url, title, timestamp, text, date
        const doubtData = {
            videoUrl: window.location.href,
            videoTitle: document.title,
            timestampSeconds: currentSeconds,
            timestampDisplay: timestamp,
            doubt: doubtText,
            dateSaved: new Date().toISOString()
        };
        
        //chrome storage
        chrome.storage.local.get(['doubts'], (result) => { //existing doubts array fetched, or else if nothing is there then empty array begins
            const existingDoubts = result.doubts || []; 
            existingDoubts.push(doubtData); //existing
            
            chrome.storage.local.set({ doubts: existingDoubts }, () => {

    console.log("Saved doubts:", existingDoubts);

    chrome.storage.local.get(['doubts'], (result) => {
        console.log("Storage now contains:", result.doubts);
    });

    alert(`✅ Doubt saved at ${timestamp}! Click "View all doubts" to see them.`);
});
        });
    };

    // button to view all doubts
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View all doubts 👀';
    viewButton.className = 'doubt-view-btn';
    viewButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 9999;
        padding: 10px 16px;
        background-color: #3ea6ff;
        color: #0f0f0f;
        border: none;
        border-radius: 18px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Roboto', Arial, sans-serif;
        transition: background-color 0.2s;
    `;

    viewButton.onmouseenter = () => viewButton.style.backgroundColor = '#2d8fdd';
    viewButton.onmouseleave = () => viewButton.style.backgroundColor = '#3ea6ff';

    // When button is clicked, go to dashboard.html
    viewButton.onclick = () => {

    console.log("View button clicked");

    chrome.runtime.sendMessage({
        action: "open_dashboard"
    });

};

    //show both buttons on the page
    document.body.appendChild(button);
    document.body.appendChild(viewButton);
}

// Wait for YouTube to load before adding button
setTimeout(showButton, 3000);

// so YouTube doesn't fully reload when clicking new videos
// This watches for URL changes and re-adds the button
let lastUrl = location.href; 
new MutationObserver(() => {
    if (location.href !== lastUrl) { //if current ur is not equal to lasturl then update
        lastUrl = location.href; 
        setTimeout(showButton, 2000); //wait for reload
    }
}).observe(document, { subtree: true, childList: true }); 