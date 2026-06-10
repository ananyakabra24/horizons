// USED TO DISPLAY DOUUBTS


function loadDoubts() {
    const container = document.getElementById('doubtsList'); //container to show doubts
    
    chrome.storage.local.get(['doubts'], (result) => {
        const doubts = result.doubts || []; //fetching existing doubt array or e,pty array if it doesnt already exist
        
        if (doubts.length === 0) {
            container.innerHTML = '<p>No doubts yet!</p>';
            return; //if no doubts, then
        }
        
        container.innerHTML = ''; //clear container before adding doubts
        
        for (let i = 0; i < doubts.length; i++) { //loop to repeat this for all doubts
            const doubt = doubts[i]; 
            const card = document.createElement('div'); //card doubt will hv video title, timestamp, doubt, and a button to delete it
            card.className = 'doubt-card';
            card.innerHTML = `
                <div>${doubt.videoTitle}</div>
                <div>⏰ ${doubt.timestampDisplay}</div>
                <div>❓ ${doubt.doubt}</div>
                <button onclick="deleteDoubt(${i})">Delete</button>
            `;
            container.appendChild(card); //append the cards to the doubt list container
        }

    });
}


document.addEventListener('DOMContentLoaded', loadDoubts);
