// ============================================
// F1 CALENDAR - Using Jolpica API (Ergast replacement)
// ============================================

const calendarContainer = document.getElementById('calendar-container');

// Sample 2026 calendar data (fallback if API fails)
const sampleRaces = [
    { date: "2026-03-15", time: "15:00:00", raceName: "Bahrain Grand Prix", Circuit: { circuitName: "Bahrain International Circuit", Location: { locality: "Sakhir", country: "Bahrain" } } },
    { date: "2026-03-29", time: "15:00:00", raceName: "Saudi Arabian Grand Prix", Circuit: { circuitName: "Jeddah Corniche Circuit", Location: { locality: "Jeddah", country: "Saudi Arabia" } } },
    { date: "2026-04-12", time: "14:00:00", raceName: "Australian Grand Prix", Circuit: { circuitName: "Albert Park Circuit", Location: { locality: "Melbourne", country: "Australia" } } },
    { date: "2026-04-26", time: "15:00:00", raceName: "Japanese Grand Prix", Circuit: { circuitName: "Suzuka Circuit", Location: { locality: "Suzuka", country: "Japan" } } },
    { date: "2026-05-10", time: "14:00:00", raceName: "Chinese Grand Prix", Circuit: { circuitName: "Shanghai International Circuit", Location: { locality: "Shanghai", country: "China" } } },
    { date: "2026-05-24", time: "15:00:00", raceName: "Miami Grand Prix", Circuit: { circuitName: "Miami International Autodrome", Location: { locality: "Miami", country: "USA" } } },
    { date: "2026-06-07", time: "15:00:00", raceName: "Emilia Romagna Grand Prix", Circuit: { circuitName: "Imola Circuit", Location: { locality: "Imola", country: "Italy" } } },
    { date: "2026-06-21", time: "15:00:00", raceName: "Monaco Grand Prix", Circuit: { circuitName: "Circuit de Monaco", Location: { locality: "Monte Carlo", country: "Monaco" } } },
    { date: "2026-07-05", time: "14:00:00", raceName: "Canadian Grand Prix", Circuit: { circuitName: "Circuit Gilles Villeneuve", Location: { locality: "Montreal", country: "Canada" } } },
    { date: "2026-07-19", time: "15:00:00", raceName: "British Grand Prix", Circuit: { circuitName: "Silverstone Circuit", Location: { locality: "Silverstone", country: "UK" } } },
    { date: "2026-08-02", time: "15:00:00", raceName: "Hungarian Grand Prix", Circuit: { circuitName: "Hungaroring", Location: { locality: "Budapest", country: "Hungary" } } },
    { date: "2026-08-23", time: "15:00:00", raceName: "Belgian Grand Prix", Circuit: { circuitName: "Circuit de Spa-Francorchamps", Location: { locality: "Spa", country: "Belgium" } } },
    { date: "2026-09-06", time: "15:00:00", raceName: "Dutch Grand Prix", Circuit: { circuitName: "Circuit Zandvoort", Location: { locality: "Zandvoort", country: "Netherlands" } } },
    { date: "2026-09-13", time: "15:00:00", raceName: "Italian Grand Prix", Circuit: { circuitName: "Monza Circuit", Location: { locality: "Monza", country: "Italy" } } },
    { date: "2026-09-27", time: "14:00:00", raceName: "Singapore Grand Prix", Circuit: { circuitName: "Marina Bay Street Circuit", Location: { locality: "Singapore", country: "Singapore" } } },
    { date: "2026-10-11", time: "14:00:00", raceName: "United States Grand Prix", Circuit: { circuitName: "Circuit of the Americas", Location: { locality: "Austin", country: "USA" } } },
    { date: "2026-10-18", time: "14:00:00", raceName: "Mexican Grand Prix", Circuit: { circuitName: "Autodromo Hermanos Rodriguez", Location: { locality: "Mexico City", country: "Mexico" } } },
    { date: "2026-11-01", time: "16:00:00", raceName: "Brazilian Grand Prix", Circuit: { circuitName: "Interlagos Circuit", Location: { locality: "Sao Paulo", country: "Brazil" } } },
    { date: "2026-11-15", time: "18:00:00", raceName: "Las Vegas Grand Prix", Circuit: { circuitName: "Las Vegas Strip Circuit", Location: { locality: "Las Vegas", country: "USA" } } },
    { date: "2026-12-06", time: "17:00:00", raceName: "Abu Dhabi Grand Prix", Circuit: { circuitName: "Yas Marina Circuit", Location: { locality: "Abu Dhabi", country: "UAE" } } }
];

async function fetchCalendar() {
    try {
        // Try the new Jolpica API first
        const response = await fetch('https://api.jolpi.ca/ergast/f1/current.json');
        const data = await response.json();
        let races = data.MRData.RaceTable.Races || [];
        
        // If API returns no races, use sample data
        if (races.length === 0) {
            console.log('Using sample calendar data');
            races = sampleRaces;
        }

        renderCalendar(races);
        
        // Find and display next race
        const now = new Date();
        let nextRace = null;
        races.forEach(race => {
            const raceDate = new Date(race.date + 'T' + (race.time || '00:00:00'));
            if (raceDate > now && !nextRace) {
                nextRace = race;
            }
        });
        
        if (nextRace) {
            updateCountdown(nextRace);
        } else {
            document.getElementById('next-race-name').textContent = 'Season completed or no upcoming races';
        }

    } catch (error) {
        console.log('API error, using sample data:', error);
        renderCalendar(sampleRaces);
        
        // Find next race in sample data
        const now = new Date();
        let nextRace = null;
        sampleRaces.forEach(race => {
            const raceDate = new Date(race.date + 'T' + (race.time || '00:00:00'));
            if (raceDate > now && !nextRace) {
                nextRace = race;
            }
        });
        
        if (nextRace) {
            updateCountdown(nextRace);
        }
    }
}

function renderCalendar(races) {
    if (!races || races.length === 0) {
        calendarContainer.innerHTML = '<p class="error-message">No races available</p>';
        return;
    }

    let html = '';
    const now = new Date();
    
    races.forEach((race) => {
        const raceDate = new Date(race.date + 'T' + (race.time || '00:00:00'));
        const isPast = raceDate < now;
        const statusClass = isPast ? 'race-past' : 'race-next';
        const statusLabel = isPast ? '✅ Finished' : '🏁 UPCOMING';

        const formattedDate = new Date(race.date).toLocaleDateString('en-US', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        });

        html += `
            <div class="race-card ${statusClass}">
                <div class="race-status">${statusLabel}</div>
                <h3>${race.raceName || 'Unknown Race'}</h3>
                <p>🏟 ${race.Circuit?.circuitName || 'Unknown Circuit'}</p>
                <p>📍 ${race.Circuit?.Location?.locality || 'Unknown'}, ${race.Circuit?.Location?.country || 'Unknown'}</p>
                <p>📅 ${formattedDate}</p>
                ${race.time ? `<p>⏰ ${race.time}</p>` : ''}
            </div>
        `;
    });

    calendarContainer.innerHTML = html;
}

function updateCountdown(nextRace) {
    if (!nextRace) {
        document.getElementById('next-race-name').textContent = 'No upcoming races';
        return;
    }

    const raceDate = new Date(nextRace.date + 'T' + (nextRace.time || '00:00:00'));
    document.getElementById('next-race-name').textContent = 
        `${nextRace.raceName} - ${nextRace.Circuit?.circuitName}`;

    function tick() {
        const now = new Date();
        const diff = raceDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        document.getElementById('days').textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
}

fetchCalendar();
setInterval(fetchCalendar, 300000);