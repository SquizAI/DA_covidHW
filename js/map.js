// Map visualization functionality using Leaflet.js

// Global map object
let covidMap;
let mapInitialized = false;

// Initialize map when document is ready
$(document).ready(function() {
    // Wait for DOM to be fully loaded
    setTimeout(initLeafletMap, 500);
});

// Initialize the Leaflet map
function initLeafletMap() {
    const mapContainer = document.getElementById('map-chart');
    if (!mapContainer) return;
    
    try {
        // Set the map container height
        mapContainer.style.height = '400px';
        
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            console.error('Leaflet is not available');
            provideFallbackMapView();
            return;
        }
        
        // Initialize the map centered at [0, 0] with zoom level 2
        covidMap = L.map('map-chart').setView([20, 0], 2);
        
        // Add the base tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(covidMap);
        
        mapInitialized = true;
        console.log('Leaflet map initialized successfully');
    } catch (error) {
        console.error('Error initializing Leaflet map:', error);
        provideFallbackMapView();
    }
}

// Provide a fallback view when map isn't available
function provideFallbackMapView() {
    const mapContainer = document.getElementById('map-chart');
    if (!mapContainer) return;
    
    // Clear any existing content
    mapContainer.innerHTML = '';
    mapContainer.style.height = '400px';
    mapContainer.style.display = 'flex';
    mapContainer.style.flexDirection = 'column';
    mapContainer.style.alignItems = 'center';
    mapContainer.style.justifyContent = 'center';
    
    // Create fallback message and content
    const fallbackMessage = document.createElement('div');
    fallbackMessage.style.textAlign = 'center';
    fallbackMessage.style.padding = '20px';
    
    fallbackMessage.innerHTML = `
        <i class="fas fa-map-marked-alt" style="font-size: 2rem; color: #3498db; margin-bottom: 1rem;"></i>
        <h3>Map Visualization</h3>
        <p>The interactive map visualization is currently unavailable.</p>
        <p>Please check the country statistics section for detailed data.</p>
    `;
    
    // Add to container
    mapContainer.appendChild(fallbackMessage);
    
    // Add a link to view data in table format
    const viewDataButton = document.createElement('button');
    viewDataButton.className = 'btn';
    viewDataButton.innerHTML = '<i class="fas fa-table"></i> View Data in Table Format';
    viewDataButton.addEventListener('click', function() {
        // This would ideally show the data in a table format
        alert('Country data is available in the Country Selector section');
    });
    
    mapContainer.appendChild(viewDataButton);
}

// Update the Global Map View
function updateMapView() {
    // Skip if map functionality is not available
    if (!mapFunctionalityAvailable) {
        return; // Fallback view is already shown
    }
    // Get the latest data for each country
    const countryData = {};
    
    filteredData.forEach(row => {
        if (row.iso_code && row.location && row.total_cases) {
            // Convert ISO code to the format used by jVectorMap (lowercase)
            const iso = row.iso_code.toLowerCase();
            
            // Only update if we don't have data for this country yet or if this data is newer
            if (!countryData[iso] || new Date(row.date) > new Date(countryData[iso].date)) {
                countryData[iso] = row;
            }
        }
    });
    
    // Prepare the data for the map
    const mapData = {};
    
    // Format data for the map
    Object.entries(countryData).forEach(([iso, row]) => {
        // Skip entries without total_cases data
        if (!row.total_cases) return;
        
        // Add to map data
        mapData[iso] = row.total_cases;
    });
    
    // Initialize or update the map
    const mapChart = document.getElementById('map-chart');
    if (!mapChart) return;
    
    // Make sure the element is empty
    $(mapChart).empty();
    $(mapChart).css('height', '400px');
    
    // Create the map using jQuery
    try {
        $(mapChart).vectorMap({
        map: 'world_mill',
        backgroundColor: 'transparent',
        zoomOnScroll: true,
        series: {
            regions: [{
                values: mapData,
                scale: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
                legend: {
                    horizontal: true,
                    title: 'Total COVID-19 Cases'
                }
            }]
        },
        onRegionTipShow: function(e, el, code) {
            if (countryData[code]) {
                const country = countryData[code];
                const casesFormatted = new Intl.NumberFormat().format(country.total_cases || 0);
                const deathsFormatted = new Intl.NumberFormat().format(country.total_deaths || 0);
                const vaccinationsFormatted = new Intl.NumberFormat().format(country.total_vaccinations || 0);
                const cfrPercentage = country.total_cases > 0 ? ((country.total_deaths / country.total_cases) * 100).toFixed(2) : 'N/A';
                
                el.html(
                    '<div class="map-tooltip">' +
                    '<strong>' + country.location + '</strong><br>' +
                    'Total Cases: ' + casesFormatted + '<br>' +
                    'Total Deaths: ' + deathsFormatted + '<br>' +
                    'Case Fatality Rate: ' + cfrPercentage + '%<br>' +
                    'Total Vaccinations: ' + vaccinationsFormatted +
                    '</div>'
                );
            }
        }
    });
    
    } catch (error) {
        console.error('Error initializing map:', error);
        return;
    }
    
    // Add map controls if they don't exist
    if ($('.map-controls').length === 0) {
        $('#map-chart').after(
            '<div class="map-controls">' +
            '<button id="map-zoom-in" class="btn-icon"><i class="fas fa-plus"></i></button>' +
            '<button id="map-zoom-out" class="btn-icon"><i class="fas fa-minus"></i></button>' +
            '<button id="map-reset" class="btn-icon"><i class="fas fa-sync-alt"></i></button>' +
            '</div>'
        );
        
        // Add event listeners to the map controls
        $('#map-zoom-in').on('click', function() {
            const map = $('#map-chart').vectorMap('get', 'mapObject');
            map.setScale(map.scale * 1.5, map.width / 2, map.height / 2, false);
        });
        
        $('#map-zoom-out').on('click', function() {
            const map = $('#map-chart').vectorMap('get', 'mapObject');
            map.setScale(map.scale / 1.5, map.width / 2, map.height / 2, false);
        });
        
        $('#map-reset').on('click', function() {
            const map = $('#map-chart').vectorMap('get', 'mapObject');
            map.setScale(1, 0, 0, false);
            map.setFocus({scale: 1, x: 0.5, y: 0.5});
        });
    }
}
