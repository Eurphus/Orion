if (!window.tested) {
    window.tested = 'UNTESTED'
}

console.log(`Test Boolean: ${window.tested}`)

if (window.tested === 'UNTESTED') {
    /*
    Checking for insecure connection start
    */
    if (!window.isSecureContext) {
        chrome.runtime.sendMessage({
            package: "getInsecure"
        })
    } else {
        console.log("Testing")
        chrome.runtime.sendMessage({
            package: "detect",
            secure: window.isSecureContext,
            url: window.location.href,
            html: document.documentElement
        })

        window.tested = 'TESTED'
    }
} else if (window.tested === 'TESTED') {
    console.log("Change Ignored, site already detected.")
}
