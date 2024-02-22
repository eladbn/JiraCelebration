let debounceTimer = null;
let debounceTimer2 = null;
let isPopupShown = false;
let currentValue = null;
let previousValue = null;
let firstActionsDivFind = true;
let doneItems = null;
let tempDoneItems = -1;
let debug = false;

let isPopupInProgress = false;
const appId = chrome.runtime.id;

// Function to create and show the image popup
const showImagePopup = () => {
    // Check if the popup is already in progress
    if (isPopupInProgress) {
      if (debug){console.log("celeb: Popup already in progress. Skipping...");}
      return;
    }
  
    // Set flag to indicate that the popup is in progress
    isPopupInProgress = true;
  
    // Create an image element
    const img = document.createElement('img');
  
    // Generate a random number between 1 and 8 to select the image
    const randomImageNumber = Math.floor(Math.random() * 8) + 1;
    // Set the image source
    img.src = `chrome-extension://__MSG_@@${appId}/images/image${randomImageNumber}.png`; //production liecpphadjpakilbmffpdghjahdgaaje
    
    var randomSide = Math.ceil(Math.random() * 4); // 1 - bottom, 2 - top, 3 - right down, 4 right up
   
    // Set the onload event handler to ensure we get the image's width and height after it's loaded
    img.onload = function() {
        // Get the original width and height of the image
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate the scale factor to ensure the width is 500px or less
        const scaleFactor = Math.min(500, window.innerWidth*0.2) / imgWidth;

        // Calculate the scaled width and height of the image
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = imgHeight * scaleFactor;
        if (debug){console.log("celeb: image scaled size:", scaledWidth, scaledHeight);}
        // randomSide = 4;
        var startX = 0;
        var startY = 0;
        // Calculate the image's initial position at the bottom left corner
        if(randomSide == 1){
        startX = window.innerWidth * (Math.floor(Math.random()*60))/100;
        startY = 0; // bottom start
        } else if(randomSide == 2){
        startX = window.innerWidth * (Math.floor(Math.random()*60)+40)/100;
        startY = window.innerHeight; //+200; // Top start
        } else if(randomSide == 3){
        startX = window.innerWidth;
        startY = window.innerHeight * (Math.floor(Math.random()*60)+30)/100; // Right side down
        } else {
        startX = window.innerWidth;
        startY = window.innerHeight * (Math.floor(Math.random()*40))/100; // Right side up
        }
        if(debug){
        console.log("celeb: window size: ", window.innerWidth, window.innerHeight);
        console.log("celeb: starts:", startX, startY);}

        // Set image position and size
        img.style.position = 'fixed';
        img.style.width = scaledWidth + 'px';
        img.style.height = scaledHeight + 'px';
        img.style.left = startX + 'px';
        img.style.bottom = startY + 'px';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s, transform 1s';
        img.style.zIndex = '9999';

        // Append the image to the body
        document.body.appendChild(img);

        // Trigger reflow
        img.offsetHeight;

        // Apply animation to move towards the middle and rotate
        if (randomSide == 1){
        var newX = (window.innerWidth-startX)/2;
        var newY = - (window.innerHeight * (Math.floor(Math.random()*50)+10)/100);
        } else if (randomSide == 2){
        var newX = -(startX)/2;
        var newY = (window.innerHeight * (Math.floor(Math.random()*50)+40)/100);
        } else if (randomSide == 3){
        var newX = -(window.innerWidth * (Math.floor(Math.random()*40+Math.random()*35)+20)/100);
        var newY = startY * (Math.floor(Math.random()*50)+10)/100;
        } else {
        var newX = -(window.innerWidth * (Math.floor(Math.random()*40+Math.random()*35)+20)/100);
        var newY = - (window.innerHeight - startY) * (Math.floor(Math.random()*50)+10)/100;
        }
        if(debug){console.log("celeb: new: ", newX, newY);}
        img.style.opacity = '1';
        img.style.transform = `translate(${newX}px , ${newY}px)`; // Move to middle and rotate
        
        if (randomSide == 1){
        if(debug){console.log("celeb: option 1");}
        newX = newX + (window.innerWidth-startX)/2;
        newY = -newY;
        } else if (randomSide == 2){
            if(debug){console.log("celeb: option 2");}
            newX = 2*newX;
            newY = -newY;
        } else if (randomSide == 3){
            if(debug){console.log("celeb: option 3");}
            var newX = -newX;
            var newY = newY*2;
        } else {
            if(debug){console.log("celeb: option 4");}
            var newX = -newX;
            var newY = newY*2;
        }
        if(debug){console.log("celeb: new2: ", newX, newY);}
        // Set timeout to animate the image exiting towards the bottom right corner
        setTimeout(() => {
            img.style.opacity = '0.5';
            img.style.transform = `translate(${newX}px, ${newY}px) rotate(-35deg)`; // Exit to bottom right
            setTimeout(() => {
                img.remove();
                isPopupInProgress = false;
            }, 1000);
        }, 1000);
    };
  };
  


// Function to extract the value from the specified section
const extractValue = () => {
    let newDoneItems = 0;
    const section = document.querySelector('div[data-onboarding-observer-id="board-wrapper"] > div > section > div > div > div:last-child');
    if (section) {
        const parentSpan = section.querySelector('span[style="white-space: pre;"]');
        if (parentSpan) {
            // Select all child spans within the parent span
            const childSpans = parentSpan.querySelectorAll('span[style="position: relative; display: inline-block;"]');
            if(debug){console.log("celeb: childs span:", childSpans);}
            for (let i = 0; i < childSpans.length; i++) {
                const singleSpan = childSpans[i];
                
                // Get the last child span
                let foundNumber = singleSpan[singleSpan.length - 1];
                foundNumber = singleSpan.innerText.trim();
                if (newDoneItems){newDoneItems = parseInt(newDoneItems, 10)*10 + parseInt(foundNumber, 10);}
                else{newDoneItems=parseInt(foundNumber, 10);}
            }
            if(debug){console.log("celeb: done items: ", newDoneItems);}
            return newDoneItems;
        }
        else{
            if(debug){console.log("celeb: done items: 0");}
            return 0;
        }
    } else {
        if(debug){console.log("celeb: didn't find div");}
    }
    return null;
};




// Callback function to execute when mutations are observed
const mutationCallback = function(mutationsList, observer) {
    // Debounce the execution of the logic
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        mutationsList.forEach(mutation => {
            // console.log("celeb: Target element:", mutation.target);
            // Check if the target element starts with the specified span style
            if (doneItems == null) {
                if (mutation.target.outerHTML.startsWith('<div class="atlaskit-portal-container"')) {
                    doneItems = extractValue();
                    if (doneItems !== null) {
                        if(debug){console.log("celeb: Initial done items on page load:", doneItems);}
                    }
                }
            }

            if (mutation.target.outerHTML.startsWith('<span style="position: relative; display: inline-block;">')) {
                // Check if the board value section exists
                if (tempDoneItems !== doneItems && tempDoneItems >-1){ 
                    doneItems = tempDoneItems;
                    if(debug){console.log("celeb: temp done items were synced: ", doneItems);}
                    tempDoneItems = -1;
                }
                const newDone = extractValue();
                if (newDone !== null) {
                    if (doneItems !== null){
                        // If the previous value is null or the current value is greater than the previous value, show the image
                        if (newDone > doneItems){
                            // Log the found span value
                            if(debug){console.log("celeb: Done items increased to:", newDone);}
                            showImagePopup();
                        }
                    }
                    // Store the new value
                    doneItems = newDone;
                }
            }
        });

    
        const actionsDiv = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.actions-wrapper"]');
        if (actionsDiv){
            const statusDiv = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.resolution"]');
            if (firstActionsDivFind){
                if (statusDiv){
                    isPopupShown = true;
                }
                firstActionsDivFind = false;
            }
            if (statusDiv) {
                if(debug){console.log("celeb: Status div found.");}
            } else {
                if(debug){console.log("celeb: Status div not found.");}
                isPopupShown = false;
            }

            if (!isPopupShown && statusDiv) {
                if(debug){console.log("celeb: Popup not shown. Showing now...");}
                // Show the image popup
                showImagePopup();
                isPopupShown = true;
            }
        }
    }, 300); // Adjust the debounce time as needed
};

const resetFirstActions = () =>{
    const actionsDiv = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.actions-wrapper"]');
        if (!actionsDiv){
            if(debug){console.log("celeb: Resetting firstActionsDivFind.");}
            firstActionsDivFind = true;
        }
}

// Create a new observer object
const observer = new MutationObserver(mutationCallback);

if(debug){console.log("celeb: document ended");}
const resetDoneItems = (time=5000, reset = false) =>{

    setTimeout(() => {
        if (doneItems == null || reset) {
            tempDoneItems = extractValue();
            if (tempDoneItems !== null) {
                if (!reset){
                    doneItems = tempDoneItems;
                    if(debug){console.log("celeb: Stored initial Done Items after:", time, "sec ,done:", doneItems);}
                }
                else{
                    if(debug){console.log("celeb: Reset Temp Done Items after:", time, "sec ,done:", doneItems);}
                }
            }
        }
    }, time); // 3000 milliseconds = 3 seconds
}

resetDoneItems(3000);

// Start observing the target node for configured mutations
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.urlChanged) {
      // URL has changed, reset your status and data based on your needs
      if(debug){console.log("celeb: URL changed.");}
      resetFirstActions();
      resetDoneItems(2000, true);
    }
  });