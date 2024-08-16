
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listeners                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Website Detector, listens for changes in tab information.
 * Primary listener to activate anti-phishing measures
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['scripts/webCheck.js']
    }).then(async () => {
        console.log("Script Injected Into page");
    }).catch(async (error) => {
        console.error(error)
    });
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.package === "getInsecure") {
        sendPopup('insecure', 0)
        return;
    } else if (message.package === ('score')) {
        sendResponse(chrome.storage.local.get(["confidence"]))
    } else if (message.package === "detect") {
        // API call here
        // let response...
        const postResponse = await fetch("https://orion--src-entrypoint-flask-app-dev.modal.run/check", {
            method: "POST",
            body: JSON.stringify({ content: , url: message.url })
        });
        //const response = await postResponse.json()
        // const response = {
        //     confidence: 75,
        //     reason: 'unsure'
        // }
        console.log(response)

        if (response.secure) {
            console.log('Website deemed secure');
        } else {
            if (response.reason === 'blacklist') {
                sendPopup('blacklist', 0);
            } else if (response.confidence >= 5) {
                sendPopup('unsure', response.confidence);
            } else {
                console.log('Website deemed secure');
            }
        }
    }
})

async function sendPopup(type, confidence) {
    let pageUrl;
    if (type === 'insecure') {
        pageUrl = '/pages/popups/insecure.html';
    } else if (type === 'blacklisted') {
        pageUrl = '/pages/popups/blacklisted.html'
    } else {
        await chrome.storage.local.set({ 'confidence': confidence })
        pageUrl = '/pages/popups/unsure.html'
    }

    chrome.windows.create({
        'url': chrome.runtime.getURL(pageUrl),
        'height': 600,
        'width': 673,//673px; height: 538p
        'type': 'popup',
        'focused': true
    })
}

console.log("Background obtained :D")