// ============================================
// F1 DRIVERS - Using Jolpica API (Ergast replacement)
// ============================================

const driversContainer = document.getElementById('drivers-container');

async function fetchDrivers() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        const data = await response.json();
        
        const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
        
        if (standings.length === 0) {
            driversContainer.innerHTML = '<p class="error-message">No driver data available</p>';
            return;
        }

        let html = '';
        standings.forEach(driver => {
            const givenName = driver.Driver.givenName || '';
            const familyName = driver.Driver.familyName || '';
            const code = driver.Driver.code || 'N/A';
            const number = driver.Driver.permanentNumber || 'N/A';
            const team = driver.Constructors[0]?.name || 'N/A';
            const nationality = driver.Driver.nationality || 'Unknown';
            const points = driver.points || 0;
            const wins = driver.wins || 0;

            const color = stringToColor(givenName + familyName);

            html += `
                <div class="driver-card">
                    <div class="driver-number" style="background:${color}">${number}</div>
                    <div class="driver-info">
                        <h3>${givenName} ${familyName}</h3>
                        <p class="driver-code">${code}</p>
                        <p>🏢 ${team}</p>
                        <p>🌍 ${nationality}</p>
                        <div class="driver-stats">
                            <span>🏆 ${points} pts</span>
                            <span>🏁 ${wins} wins</span>
                        </div>
                    </div>
                </div>
            `;
        });
        driversContainer.innerHTML = html;

    } catch (error) {
        console.error('Drivers error:', error);
        driversContainer.innerHTML = `<div class="error-message">⚠️ Error loading drivers: ${error.message}</div>`;
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
}

fetchDrivers();
setInterval(fetchDrivers, 300000);