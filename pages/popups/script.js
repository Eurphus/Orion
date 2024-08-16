function stringToRandomInt(str) {
    // Simple hash function to convert string to a number
    function stringToHash(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            const char = string.charCodeAt(i);
            hash = (hash << 5) - hash + char; // hash * 31 + char
        }
        return hash;
    }

    const hash = Math.abs(stringToHash(str)); // Get absolute value to ensure non-negative hash
    const randomInt = (hash % 100) + 1; // Convert to range 1-100

    return randomInt;

}

if(window.location.href.includes("temu")) {
    document.getElementById("confidence").innerText = `Confidence Score: 85`
} else {
    document.getElementById("confidence").innerText = `Confidence Score: ${stringToRandomInt(window.location.href)}`
}