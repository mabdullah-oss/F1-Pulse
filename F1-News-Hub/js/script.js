// ===============================
// F1 NEWS HUB - LIVE VERSION
// ===============================

const NEWS_API_KEY = "a2b871b03d1b4c18aa1cf19a9ce24704";

// -------------------------------
// Driver Standings (Jolpica API)
// -------------------------------
async function loadDriverStandings() {
    try {
        const response = await fetch(
            "https://api.jolpi.ca/ergast/f1/current/driverStandings.json"
        );

        const data = await response.json();

        const standings =
            data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const table = document.getElementById("driverStandings");

        table.innerHTML = "";

        standings.forEach(driver => {

            table.innerHTML += `
                <tr>
                    <td>${driver.position}</td>
                    <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
                    <td>${driver.Constructors[0].name}</td>
                    <td>${driver.points}</td>
                </tr>
            `;

        });

    } catch (error) {
        console.error(error);
    }
}

// -------------------------------
// Constructor Standings
// -------------------------------
async function loadConstructorStandings() {

    try {

        const response = await fetch(
            "https://api.jolpi.ca/ergast/f1/current/constructorStandings.json"
        );

        const data = await response.json();

        const standings =
            data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

        const table = document.getElementById("constructorStandings");

        table.innerHTML = "";

        standings.forEach(team => {

            table.innerHTML += `
                <tr>
                    <td>${team.position}</td>
                    <td>${team.Constructor.name}</td>
                    <td>${team.points}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// -------------------------------
// Formula 1 News
// -------------------------------
async function loadNews() {

    try {

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=Formula%201&language=en&pageSize=6&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
        );

        const data = await response.json();

        const container = document.getElementById("newsContainer");

        container.innerHTML = "";

        data.articles.forEach(article => {

            container.innerHTML += `
                <div class="news-card">

                    ${
                        article.urlToImage
                            ? `<img src="${article.urlToImage}">`
                            : ""
                    }

                    <h3>${article.title}</h3>

                    <p>${article.description || ""}</p>

                    <p>
                        <a href="${article.url}" target="_blank">
                            Read Full Story →
                        </a>
                    </p>

                </div>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// -------------------------------
// Button
// -------------------------------
document.getElementById("newsBtn").addEventListener("click", () => {

    document.getElementById("newsContainer").scrollIntoView({
        behavior: "smooth"
    });

});

// -------------------------------
// Start Website
// -------------------------------
loadDriverStandings();
loadConstructorStandings();
loadNews();