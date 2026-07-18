// ============================================
// F1 STANDINGS - Using Jolpica API (Ergast replacement)
// ============================================

const driverBody = document.getElementById('driver-standings-body');
const constructorBody = document.getElementById('constructor-standings-body');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        document.getElementById('drivers-standings').style.display = tab === 'drivers' ? 'block' : 'none';
        document.getElementById('constructors-standings').style.display = tab === 'constructors' ? 'block' : 'none';
    });
});

// Fetch Driver Standings
async function fetchDriverStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
        const data = await response.json();
        
        const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
        
        if (standings.length === 0) {
            driverBody.innerHTML = '<tr><td colspan="5" class="error-message">No standings data available</td></tr>';
            return;
        }

        let html = '';
        standings.forEach(driver => {
            const givenName = driver.Driver.givenName || '';
            const familyName = driver.Driver.familyName || '';
            html += `
                <tr>
                    <td><strong>${driver.position}</strong></td>
                    <td>${givenName} ${familyName}</td>
                    <td>${driver.Constructors[0]?.name || 'N/A'}</td>
                    <td><strong>${driver.points}</strong></td>
                    <td>${driver.wins || 0}</td>
                </tr>
            `;
        });
        driverBody.innerHTML = html;
    } catch (error) {
        console.error('Driver standings error:', error);
        driverBody.innerHTML = `<tr><td colspan="5" class="error-message">⚠️ Error loading standings: ${error.message}</td></tr>`;
    }
}

// Fetch Constructor Standings
async function fetchConstructorStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        const data = await response.json();
        
        const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
        
        if (standings.length === 0) {
            constructorBody.innerHTML = '<tr><td colspan="4" class="error-message">No standings data available</td></tr>';
            return;
        }

        let html = '';
        standings.forEach(team => {
            html += `
                <tr>
                    <td><strong>${team.position}</strong></td>
                    <td>${team.Constructor.name}</td>
                    <td><strong>${team.points}</strong></td>
                    <td>${team.wins || 0}</td>
                </tr>
            `;
        });
        constructorBody.innerHTML = html;
    } catch (error) {
        console.error('Constructor standings error:', error);
        constructorBody.innerHTML = `<tr><td colspan="4" class="error-message">⚠️ Error loading standings: ${error.message}</td></tr>`;
    }
}

fetchDriverStandings();
fetchConstructorStandings();
setInterval(() => {
    fetchDriverStandings();
    fetchConstructorStandings();
}, 120000);