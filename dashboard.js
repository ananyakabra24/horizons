//dashboard js


//migration - keeps reloading

//migration - updates old doubts to the latest version

function migrateDoubts() {
    chrome.storage.local.get(['doubts'], (result) => {
        const doubts = result.doubts || [];
        let changed = false;

        doubts.forEach(doubt => {

            if (doubt.id === undefined) {
                doubt.id = crypto.randomUUID();
                changed = true;
            }

            if (doubt.notes === undefined) {
                doubt.notes = "";
                changed = true;
            }

            if (doubt.deleted === undefined) {
                doubt.deleted = false;
                changed = true;
            }

            if (doubt.solved === undefined) {
                doubt.solved = false;
                changed = true;
            }

            if (doubt.folderId === undefined) {
                doubt.folderId = null;
                changed = true;
            }

        });

        if (changed) {
            chrome.storage.local.set({ doubts });
        }
    });
}

// USED TO DISPLAY DOUUBTS



//folders list function

function loadFolders() {
    //console.log("loadFolders running");
    const allFolders = document.getElementById('folders-list');
    chrome.storage.local.get(['folders'], (result) => {
        const folders = result.folders || []; 
        // console.log("Folders found:", folders); to test

        allFolders.innerHTML = ''; //so that it doesnt show suplicates, we clear ir everytime 
        folders.forEach(folder => { //repeats the steps inside for EACH folder in the array
            const folderBtn = document.createElement('button'); //creates a new button -> which is actually our new folder
            folderBtn.textContent = `📁 ${folder.name}`; //name is input
            folderBtn.className = 'folder-btn'; //to style
            allFolders.appendChild(folderBtn); //show it
        })
    })
}


//views




let currentView = 'all' 









function loadDoubts() {
    const emptyTrashBtn = document.getElementById('empty-trash-btn')
    if (currentView === 'deleted') {
    emptyTrashBtn.style.display = 'block'; //only display in the deleted view
}
    else {
    emptyTrashBtn.style.display = 'none';
}
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
            console.log(doubt);
console.log("ID:", doubt.id); //test
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
                    chrome.storage.local.get(['doubts'], (result) => {
                        const doubts = result.doubts || [];
                        const doubtToUpdate = doubts.find(
                            doubt => doubt.id === doubtId
                        );
                        if (doubtToUpdate) {
                            doubtToUpdate.notes = notesBox.value;
                            chrome.storage.local.set({ doubts }); 
                        }
                    });
                 }
                )

                const buttonContainer = document.createElement('div');//container so that all the buttons are nicely organised
                buttonContainer.className = 'button-container'; 

                    //1----delete button----
                    const deleteBtn = document.createElement('button'); //chrome blocks inline js
                    deleteBtn.className = 'delete-btn'; //class to style 
                    if (currentView === 'deleted') {
                        deleteBtn.textContent = 'Put back ⏪';
                    }
                    else {
                        deleteBtn.textContent = 'Delete ❌';

                    }
                    deleteBtn.addEventListener('click', () => { //addeventlistener calls the deletedoubt function
                    
                           console.log("Delete clicked:" , doubtId)

                        if (currentView === 'deleted') {
                                restoreDoubt(doubtId)

                            }
                            else {
                                deleteDoubt(doubtId);
                            }

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
                        chrome.storage.local.get(['doubts'], (result) => {
                            console.log("solved clicked:" , doubtId) //testin

                            const doubts = result.doubts || []; //emoty array line again
                            
                            const doubtToUpdate = doubts.find(
                                doubt => doubt.id === doubtId
                            );

                            if (doubtToUpdate) {
                                doubtToUpdate.solved = !doubtToUpdate.solved;

                                chrome.storage.local.set({ doubts }, () => {
                                    loadDoubts();
                                });
                            }
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
            if (doubtToDelete) {
                doubtToDelete.deleted = true;
                chrome.storage.local.set({doubts: doubts },() =>{ //sets new doubt array after we hv removed
                    loadDoubts(); //now the first function to show/load doubts on dashboard.html
                })
            }
        })
    }

    function restoreDoubt(id) {
        chrome.storage.local.get(['doubts'], (result) => {

        const doubts = result.doubts || [];

        const doubtToRestore = doubts.find(
            doubt => doubt.id === id //find the doubt w the same id
 
        );

        if (doubtToRestore) {
            doubtToRestore.deleted = false;

            chrome.storage.local.set({ doubts }, () => {
                loadDoubts();
            });
        }

    });
}

    function emptyTrash() {
        if (!confirm('Are you sure you want to permanently clear trash? Cannot be undone')) //new js unlocked - confirm popup before performing action
            return;

        chrome.storage.local.get(['doubts'], (result) => {

        const doubts = result.doubts || [];

        const remainingDoubts = doubts.filter(
            doubt => doubt.deleted !== true //only keep the card if it is not in deleted view, these list of cards = remaining doubts 
        );

        chrome.storage.local.set({ doubts: remainingDoubts }, () => {
            loadDoubts(); //which will be reloaded as the fresh set of doubts
        });

    });
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
    document.getElementById('empty-trash-btn').addEventListener('click',() => {
        emptyTrash();
    });

    document.getElementById('create-folder').addEventListener('click', () => {

        const folderName = prompt('What would you like to name your folder?');
        if (!folderName) return;

        chrome.storage.local.get(['folders'], (result) =>{
            const folders = result.folders || []; //find the already existing array or create a new array if none stays

            folders.push({ //pushes the folder into the array
                id: Date.now(), //unique id for each
                name: folderName //name we typed
            });

            chrome.storage.local.set({ folders }, () => {
                loadFolders(); //function runs to show updated list of folders
            }) //updated list saved in chrome storage
        });
    });



document.addEventListener('DOMContentLoaded', () => {
    migrateDoubts(); //first all new doubts added to the array so that indexing doesnt get messed

    setTimeout(() => { //waiting for 100 milliseconds since indexing gets messed up easily 
        loadDoubts();
        loadFolders();
    }, 100);
});

// the reason delete button has a seperate function instead of keeping it inline like revisit is bec it has much more steps involved compared to revisit (which is just opening a url)
// so it wouldnt make sense to have it inside load doubts or else the function would become hugee

