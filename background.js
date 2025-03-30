chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text) {
        fetch(`http://localhost:5000/api/fact-check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: request.text }),
        })
            .then(response => response.json())
            .then(data => sendResponse({ result: data }))
            .catch(error => console.error("Error:", error));
        
        return true; // Keep message channel open for async response
    }
});
