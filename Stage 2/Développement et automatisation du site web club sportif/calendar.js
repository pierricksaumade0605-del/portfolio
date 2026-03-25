const SHEET_ID = '1qPkOon_3Ni1jB16YDclSfQLIHEth7Vqe99yx0Qxzwqs';
const SHEET_NAME = 'Matchs';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

const CACHE_KEY = 'vikings_calendar_data';
const CACHE_TIME_KEY = 'vikings_calendar_time';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchRows() {
    // Vérifie si un cache valide existe
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cached && cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_DURATION) {
        // Retourne les données en cache instantanément
        return JSON.parse(cached);
    }

    // Sinon fetch les données fraîches
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    // Sauvegarde en cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

    return rows;
}

async function loadFilteredMatches() {
    const container = document.getElementById('matches-container');
    if (!container) return;

    try {
        const rows = await fetchRows();

        if (typeof CATEGORIES_CIBLES === 'undefined') {
            console.error("CATEGORIES_CIBLES n'est pas défini.");
            return;
        }

        container.innerHTML = '';
        let matchFound = false;

        const showAll = typeof SHOW_ALL_EVENTS !== 'undefined' && SHOW_ALL_EVENTS === true;
        const MAX_EVENTS_INDEX = 10;
        let compteurEvents = 0;
        const categoriesAffichees = new Set();

        for (let i = 1; i < rows.length; i++) {
            // Stoppe la boucle principale dès que la limite est atteinte
            if (showAll && compteurEvents >= MAX_EVENTS_INDEX) break;

            const row = rows[i].c;
            if (!row || !row[0]) continue;

            const dateRaw = row[0]?.f || row[0]?.v || '';
            const info = row[1]?.v || '';
            const heure = row[2]?.v || '';
            const lieu = row[3]?.v || '';
            const categorieRaw = row[4]?.v || '';

            const listeDates = dateRaw.toString().split(',').map(d => d.trim());
            const listeCategories = categorieRaw.toString().split(',').map(c => c.trim());

            const categoriesCiblesPresentes = listeCategories.filter(cat => CATEGORIES_CIBLES.includes(cat));

            if (categoriesCiblesPresentes.length > 0) {

                if (!showAll) {
                    const aUneNouvelleCategorie = categoriesCiblesPresentes.some(cat => !categoriesAffichees.has(cat));
                    if (!aUneNouvelleCategorie) continue;
                    categoriesCiblesPresentes.forEach(cat => categoriesAffichees.add(cat));
                }

                listeDates.forEach(dateIndividuelle => {
                    if (showAll && compteurEvents >= MAX_EVENTS_INDEX) return;
                    matchFound = true;
                    compteurEvents++;
                    const matchCard = document.createElement('div');
                    matchCard.className = 'match-card';
                    matchCard.innerHTML = `
                        <div class="match-info-date">
                            <div class="match-date">${dateIndividuelle}</div>
                        </div>
                        <div class="match-info-content">
                            <div class="match-teams">${info}</div>
                            <div class="match-details">
                                <span class="match-location">📍 ${lieu}</span>
                            </div>
                        </div>
                        <div class="match-info-extra">
                            <div class="match-category-tag">${categorieRaw}</div>
                        </div>
                        <div class="match-info-time">
                            <div class="match-time">${heure}</div>
                        </div>
                    `;
                    container.appendChild(matchCard);
                });
            }
        }

        if (!matchFound) {
            container.innerHTML = '<div class="no-matches">Aucun événement prévu.</div>';
        }

    } catch (error) {
        console.error('Erreur :', error);
        container.innerHTML = '<div class="error-message">Erreur de chargement.</div>';
    }
}

loadFilteredMatches();