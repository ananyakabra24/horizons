
//expanded js

const params = new URLSearchParams(window.location.search); //looks at the part after the ? in url, example if here it read id = 3, it'll be used next
const doubtId = parseInt(params.get('id')); //converts the 3 string to 3 text so that it can be read so now we hv the index of the doubt we want to open

chrome.storage.local.get(['doubts'], (result) => { //gets the doubt folder from chrome storage
    const doubts = result.doubts || []; //again, no doubts, emoty array
    const doubt = doubts.find(
        doubt => doubt.id === doubtId
    ); //gets the doubt student needs from the doubt index

    if (!doubt) {
        document.body.innerHTML = '<h2> oops, we cannot find your doubt </h2>'; //lol considering someone writes id = 100 manually, but no doubt exists, then error helps
        return;
    }

    document.getElementById('videoTitle').textContent = doubt.videoTitle;
    document.getElementById('question').textContent = doubt.doubt;
    //document.getElementById('fullnotes').textContent = doubt.fullnotes;

    //the auto save feayure
    const notesBox = document.getElementById('fullnotes');
    notesBox.value = doubt.notes || '';
    notesBox.addEventListener('input', () => { //if even one leter is updated/added code inside runs
        chrome.storage.local.get(['doubts'], (result) => { 
            const doubts = result.doubts || []; //no doubts empty array

            const doubtToUpdate = doubts.find(
                doubt => doubt.id === doubtId
            );

            if (!doubtToUpdate) return;

            doubtToUpdate.notes = notesBox.value; //autosaving feature
            chrome.storage.local.set({ doubts }); 
        });        
    });

  
});