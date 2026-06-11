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
                <div class="video-title">Video: ${doubt.videoTitle}</div>
                <div class="time-saved">🗓 ${new Date(doubt.dateSaved).toLocaleDateString()}</div>
                <div class="doubt-text"> Your question: ${doubt.doubt}</div>
                `; 

                const buttonContainer = document.createElement('div');//container so that all the buttons are nicely organised
                buttonContainer.className = 'button-container'; 

                    //1----delete button----
                    const deleteBtn = document.createElement('button'); //chrome blocks inline js
                    deleteBtn.className = 'delete-btn'; //class to style 
                    deleteBtn.textContent = 'Delete ❌';
                    deleteBtn.addEventListener('click', () => { //addeventlistener calls the deletedoubt function
                        deleteDoubt(i);
});


                    // 2------revisit button------
                    const revisitBtn = document.createElement('button');
                    revisitBtn.className = 'revisit-btn'; //class to style 
                    revisitBtn.textContent = `⏰ ${doubt.timestampDisplay}`;
                    revisitBtn.addEventListener('click', () => { //when clicked

                        const timestamp = Math.floor(doubt.timestampSeconds); //get the timestamp in seconds

                        window.open(
                            `${doubt.videoUrl}&t=${timestamp}s`, //open the video url with the timestamp 
                            '_blank' //open in a new tab
                        );
                    })


                    // 3----solvedbutton---- (moves the card to an archived/solved folder)
                    const solvedBtn = document.createElement('button');
                    solvedBtn.className = 'solved-btn'; //class to style
                    solvedBtn.textContent = 'Solved ✅';






                buttonContainer.appendChild(revisitBtn);
                buttonContainer.appendChild(solvedBtn);
                buttonContainer.appendChild(deleteBtn);

            card.appendChild(buttonContainer); //so each card gets its own 3 btn container

            container.appendChild(card); //append means add
        }

    });
}

// USED TO DELETE DOUBTS

    function deleteDoubt(index) {
        chrome.storage.local.get(['doubts'], (result) => { //fetch doubts

            const doubts = result.doubts || []; //get doubt array or empty array if no array
            doubts.splice(index, 1); //splice is used to remove contents of array, learnt smth new. index is position of doubt to be deleted, 1 is no of doubts to be deleted
            chrome.storage.local.set({doubts: doubts },() =>{ //sets new doubt array after we hv removed
                loadDoubts(); //now the first function to show/load doubts on dashboard.html
            })
        })
    }

document.addEventListener('DOMContentLoaded', loadDoubts);


// the reason delete button has a seperate function instead of keeping it inline like revisit is bec it has much more steps involved compared to revisit (which is just opening a url)
// so it wouldnt make sense to have it inside load doubts or else the function would become hugee