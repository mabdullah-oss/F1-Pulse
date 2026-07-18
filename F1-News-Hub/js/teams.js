// ============================================
// F1 TEAMS - Using Jolpica API (Ergast replacement)
// ============================================

const teamsContainer = document.getElementById('teams-container');

async function fetchTeams() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json');
        const data = await response.json();
        
        const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
        
        if (standings.length === 0) {
            teamsContainer.innerHTML = '<p class="error-message">No team data available</p>';
            return;
        }

        let html = '';
        standings.forEach(team => {
            const name = team.Constructor.name || 'Unknown';
            const nationality = team.Constructor.nationality || 'Unknown';
            const points = team.points || 0;
            const wins = team.wins || 0;

            const color = stringToColor(name);

            html += `
                <div class="team-card">
                    <div class="team-color" style="background:${color}"></div>
                    <div class="team-info">
                        <h3>${name}</h3>
                        <p>🌍 ${nationality}</p>
                        <div class="team-stats">
                            <span>🏆 ${points} pts</span>
                            <span>🏁 ${wins} wins</span>
                        </div>
                    </div>
                </div>
            `;
        });
        teamsContainer.innerHTML = html;

    } catch (error) {
        console.error('Teams error:', error);
        teamsContainer.innerHTML = `<div class="error-message">⚠️ Error loading teams: ${error.message}</div>`;
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 45%)`;
}

fetchTeams();
setInterval(fetchTeams, 300000);