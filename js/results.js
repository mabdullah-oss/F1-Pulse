// ============================================
// F1 RESULTS - Using Jolpica API (Ergast replacement)
// ============================================

const resultsContainer = document.getElementById('results-container');

async function fetchResults() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/last/results.json');
        const data = await response.json();
        
        const race = data.MRData.RaceTable.Races[0];
        
        if (!race) {
            resultsContainer.innerHTML = '<p class="error-message">No race results available yet</p>';
            return;
        }

        const results = race.Results || [];
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="error-message">No results available for this race</p>';
            return;
        }

        const raceName = race.raceName || 'Unknown Race';
        const circuitName = race.Circuit?.circuitName || 'Unknown Circuit';
        const date = new Date(race.date).toLocaleDateString('en-US', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        let html = `
            <div class="race-header">
                <h2>🏁 ${raceName}</h2>
                <p>🏟 ${circuitName} &bull; 📅 ${date}</p>
            </div>
            <div class="podium">
                <div class="podium-item gold">
                    <span class="podium-pos">🥇</span>
                    <span class="podium-name">${results[0]?.Driver?.givenName || ''} ${results[0]?.Driver?.familyName || ''}</span>
                    <span class="podium-team">${results[0]?.Constructor?.name || ''}</span>
                </div>
                ${results[1] ? `
                <div class="podium-item silver">
                    <span class="podium-pos">🥈</span>
                    <span class="podium-name">${results[1].Driver.givenName} ${results[1].Driver.familyName}</span>
                    <span class="podium-team">${results[1].Constructor.name}</span>
                </div>
                ` : ''}
                ${results[2] ? `
                <div class="podium-item bronze">
                    <span class="podium-pos">🥉</span>
                    <span class="podium-name">${results[2].Driver.givenName} ${results[2].Driver.familyName}</span>
                    <span class="podium-team">${results[2].Constructor.name}</span>
                </div>
                ` : ''}
            </div>
            <div class="full-results">
                <h3>Full Results</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Driver</th>
                            <th>Team</th>
                            <th>Time</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        results.forEach(result => {
            const time = result.Time?.time || result.FastestLap?.time || 'DNF';
            html += `
                <tr>
                    <td><strong>${result.position}</strong></td>
                    <td>${result.Driver.givenName} ${result.Driver.familyName}</td>
                    <td>${result.Constructor.name}</td>
                    <td>${time}</td>
                    <td><strong>${result.points}</strong></td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        resultsContainer.innerHTML = html;

    } catch (error) {
        console.error('Results error:', error);
        resultsContainer.innerHTML = `<div class="error-message">⚠️ Error loading results: ${error.message}</div>`;
    }
}

fetchResults();
setInterval(fetchResults, 120000);