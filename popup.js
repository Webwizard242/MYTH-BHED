document.getElementById("checkFact").addEventListener("click", () => {
    let query = document.getElementById("query").value.trim();
    let resultsDiv = document.getElementById("results");

    if (query.length === 0) {
        resultsDiv.innerHTML = "⚠️ Please enter a claim.";
        return;
    }

    resultsDiv.innerHTML = "⏳ Checking...";

    fetch(`https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=AIzaSyD9FGIH1CzFZ1Gs7aBnkN_t0H7RXN0wG7E`)
        .then(response => response.json())
        .then(data => {
            resultsDiv.innerHTML = ""; 

            if (data.claims && data.claims.length > 0) {
                data.claims.forEach((claim) => {
                    let review = claim.claimReview[0];

                    let factDiv = document.createElement("div");
                    factDiv.className = "fact-item";
                    factDiv.innerHTML = `
                        <b>Fact-Check:</b> ${review.text}<br>
                        <b>Source:</b> <a href="${review.url}" target="_blank">${review.publisher.name}</a>
                    `;
                    resultsDiv.appendChild(factDiv);
                });
            } else {
                resultsDiv.innerHTML = "❌ No fact-check found.";
            }
        })
        .catch(error => {
            console.error("Error fetching fact check data:", error);
            resultsDiv.innerHTML = "⚠️ Error fetching data.";
        });
});
