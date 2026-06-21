// USED TO DISPLAY DOUUBTS


//views

let currentView = 'all' 



function loadDoubts() {
    const container = document.getElementById('doubtsList'); //container to show doubts
    
    chrome.storage.local.get(['doubts'], (result) => {
        const doubts = result.doubts || []; //fetching existing doubt array or e,pty array if it doesnt already exist
        
        let filteredDoubts = doubts;

        if (currentView === 'all') {
            filteredDoubts = doubts.filter(
                doubt => doubt.deleted !== true
            );
        }




        if (currentView === 'solved') {
            filteredDoubts = doubts.filter(
            doubt => doubt.solved === true && doubt.deleted !== true //both status should be true + shouldnt hv deleted statis
        )};
        if (currentView === 'unsolved') {
            filteredDoubts = doubts.filter(
            doubt => doubt.solved !== true && doubt.deleted !== true
        )};
        if (currentView === 'deleted') {
            filteredDoubts = doubts.filter(
            doubt => doubt.deleted === true
        )};
        
        



        if (filteredDoubts.length === 0) {
            container.innerHTML = '<p>No doubts yet!</p>';
            return; //if no doubts, then
        }
        
        container.innerHTML = ''; //clear container before adding doubts
        
        for (let i = 0; i < filteredDoubts.length; i++) { //loop to repeat this for all doubts
            const doubt = filteredDoubts[i]; 
            const doubtId = doubt.id;
            const card = document.createElement('div'); //card doubt will hv video title, timestamp, doubt, and a button to delete it
            
            card.className = 'doubt-card';
            
            card.innerHTML = `
                <div class="video-title">Video: ${doubt.videoTitle}</div>
                <div class="time-saved">🗓 ${new Date(doubt.dateSaved).toLocaleDateString()}</div>
                <div class="doubt-text"> Your question: ${doubt.doubt}</div>
                <div class="notes-section">
                    <textarea
                        class="notes-box"
                        placeholder="Add notes..."
                        >${doubt.notes || ""} </textarea> 
                </div>    
                `; 

                //notes box 
                 const notesBox = card.querySelector('.notes-box');
                 notesBox.addEventListener('input', () => {
                    const doubts = result.doubts || [];
                    // doubts[i].notes = notesBox.value; //update the notes in the doubt object
                    const doubtToUpdate = doubts.find(
                        doubt => doubt.id === doubtId
                    );
                    doubtToUpdate.notes = notesBox.value;
                    chrome.storage.local.set({ doubts }); 
                 }
                )

                const buttonContainer = document.createElement('div');//container so that all the buttons are nicely organised
                buttonContainer.className = 'button-container'; 

                    //1----delete button----
                    const deleteBtn = document.createElement('button'); //chrome blocks inline js
                    deleteBtn.className = 'delete-btn'; //class to style 
                    deleteBtn.textContent = 'Delete ❌';
                    deleteBtn.addEventListener('click', () => { //addeventlistener calls the deletedoubt function
                        deleteDoubt(doubtId);
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
                    if (doubt.solved===true) {
                        solvedBtn.textContent = "Doubt solved 🎉"
                    }
                    else {
                        solvedBtn.textContent = 'Unsolved doubt 😔'
                    }


                    solvedBtn.addEventListener('click', () => { //when solved is clicked
                        const doubts = result.doubts || []; //emoty array line again
                        //doubts[i].solved = !doubts[i].solved; //when the buttin is clicked it changes the status of the card - so basically if it was false then this becomes true (this helps also in viewing the solved view)
                        
                        const doubtToUpdate = doubts.find(
                            doubt => doubt.id === doubtId
                        );

                        doubtToUpdate.solved = !doubtToUpdate.solved;

                        chrome.storage.local.set({ doubts }, () => {
                            loadDoubts();
                        });
                    });


                    // 4-----expand-----
                    const openBtn = document.createElement('button');
                    // first basic if else lol

                    openBtn.textContent = 'Expand 🔓';
                    openBtn.className = 'open-btn';

                    openBtn.addEventListener('click', () => {
                        const url = chrome.runtime.getURL(`expanded.html?id=${doubtId}`); //get url of what doubt is expanded
                        window.open(url, '_blank');//page opened in new tab
                    });




                buttonContainer.appendChild(revisitBtn);
                buttonContainer.appendChild(solvedBtn);
                buttonContainer.appendChild(deleteBtn);
                buttonContainer.appendChild(openBtn);

            card.appendChild(buttonContainer); //so each card gets its own 3 btn container

            container.appendChild(card); //append means add
        }

    });
}

// USED TO DELETE DOUBTS

    function deleteDoubt(id) { //no longer index
        chrome.storage.local.get(['doubts'], (result) => { //fetch doubts

            const doubts = result.doubts || []; //get doubt array or empty array if no array
            // doubts.splice(index, 1); //splice is used to remove contents of array, learnt smth new. index is position of doubt to be deleted, 1 is no of doubts to be deleted edit - have to remove this since we arent officially removing this, only changing views
            //doubts[index].deleted = true;
            const doubtToDelete = doubts.find(
                doubt => doubt.id === id //find the doubt with the same id and then delete that
            );
            doubtToDelete.deleted = true;
            chrome.storage.local.set({doubts: doubts },() =>{ //sets new doubt array after we hv removed
                loadDoubts(); //now the first function to show/load doubts on dashboard.html
            })
        })
    }

    //views that show when button clicked
    document.getElementById('all-doubts').addEventListener('click',() => {
        currentView = 'all';
        loadDoubts();
    });
    document.getElementById('solved').addEventListener('click',() => {
        currentView = 'solved';
        loadDoubts();
    });
    document.getElementById('unsolved').addEventListener('click',() => {
        currentView = 'unsolved';
        loadDoubts();
    });
    document.getElementById('recently-del').addEventListener('click',() => {
        currentView = 'deleted';
        loadDoubts();
    });



document.addEventListener('DOMContentLoaded', loadDoubts);


// the reason delete button has a seperate function instead of keeping it inline like revisit is bec it has much more steps involved compared to revisit (which is just opening a url)
// so it wouldnt make sense to have it inside load doubts or else the function would become hugee