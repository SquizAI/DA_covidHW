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
    
    // Check if map is already initialized to prevent duplicate initialization
    if (mapInitialized && covidMap) {
        console.log('Map already initialized, skipping initialization');
        return;
    }
    
    try {
        // Clean up any existing map instance
        if (covidMap) {
            covidMap.remove();
            covidMap = null;
        }
        
        // Set the map container height
        mapContainer.style.height = '400px';
        
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            console.error('Leaflet is not available');
            provideFallbackMapView();
            return;
        }
        
        // Initialize the map centered at [20, 0] with zoom level 2
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
    // Skip if map isn't initialized yet
    if (!mapInitialized || !covidMap) {
        // Try to initialize map again
        if (typeof L !== 'undefined' && !mapInitialized) {
            initLeafletMap();
        } else {
            provideFallbackMapView();
        }
        return;
    }
    
    // Clear existing markers but keep the base map
    covidMap.eachLayer(function(layer) {
        if (layer._url === undefined) { // Not the tile layer
            covidMap.removeLayer(layer);
        }
    });
    
    // Get the latest data for each country
    const countryData = {};
    
    filteredData.forEach(row => {
        if (row.location && row.total_cases) {
            // Only update if we don't have data for this country yet or if this data is newer
            if (!countryData[row.location] || new Date(row.date) > new Date(countryData[row.location].date)) {
                countryData[row.location] = row;
            }
        }
    });
    
    // Country coordinates (sample - for major countries)
    const coordinates = {
        "United States": [37.0902, -95.7129],
        "China": [35.8617, 104.1954],
        "India": [20.5937, 78.9629],
        "Brazil": [-14.2350, -51.9253],
        "Russia": [61.5240, 105.3188],
        "United Kingdom": [55.3781, -3.4360],
        "France": [46.2276, 2.2137],
        "Italy": [41.8719, 12.5674],
        "Germany": [51.1657, 10.4515],
        "Japan": [36.2048, 138.2529],
        "South Korea": [35.9078, 127.7669],
        "Spain": [40.4637, -3.7492],
        "Mexico": [23.6345, -102.5528],
        "Indonesia": [-0.7893, 113.9213],
        "Canada": [56.1304, -106.3468],
        "Australia": [-25.2744, 133.7751],
        "South Africa": [-30.5595, 22.9375],
        "Turkey": [38.9637, 35.2433],
        "Argentina": [-38.4161, -63.6167],
        "Saudi Arabia": [23.8859, 45.0792]
    };
    
    // Add markers for countries with data
    Object.values(countryData).forEach(country => {
        // Skip if no coordinates or no cases
        if (!coordinates[country.location] || !country.total_cases) return;
        
        const [lat, lng] = coordinates[country.location];
        
        // Calculate circle size based on cases (logarithmic scale)
        const casesLog = Math.log(country.total_cases) / Math.log(10);
        const radius = Math.max(5, Math.min(20, casesLog * 3));
        
        // Calculate fatality rate for color
        const fatalityRate = country.total_deaths && country.total_cases ? 
            (country.total_deaths / country.total_cases) * 100 : 0;
            
        // Color scale from green to red based on fatality rate
        const color = fatalityRate > 5 ? '#e74c3c' : // Very high (>5%)
                     fatalityRate > 3 ? '#e67e22' : // High (3-5%)
                     fatalityRate > 1 ? '#f1c40f' : // Medium (1-3%)
                     '#2ecc71'; // Low (<1%)
        
        // Create circle marker
        const marker = L.circleMarker([lat, lng], {
            radius: radius,
            fillColor: color,
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(covidMap);
        
        // Format numbers
        const casesFormatted = new Intl.NumberFormat().format(country.total_cases || 0);
        const deathsFormatted = new Intl.NumberFormat().format(country.total_deaths || 0);
        const vaccinationsFormatted = new Intl.NumberFormat().format(country.people_vaccinated || 0);
        
        // Add popup with country data
        marker.bindPopup(
            `<div class="map-tooltip">
                <h4>${country.location}</h4>
                <div><b>Total Cases:</b> ${casesFormatted}</div>
                <div><b>Total Deaths:</b> ${deathsFormatted}</div>
                <div><b>Case Fatality Rate:</b> ${fatalityRate.toFixed(2)}%</div>
                ${country.people_vaccinated ? `<div><b>Vaccinated:</b> ${vaccinationsFormatted}</div>` : ''}
            </div>`,
            { className: 'covid-popup' }
        );
    });
    
    // Add a legend to the map
    const legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `
            <div class="map-legend">
                <h4>Case Fatality Rate</h4>
                <div><span style="background-color: #e74c3c"></span> &gt;5%</div>
                <div><span style="background-color: #e67e22"></span> 3-5%</div>
                <div><span style="background-color: #f1c40f"></span> 1-3%</div>
                <div><span style="background-color: #2ecc71"></span> &lt;1%</div>
                <p>Circle size represents total cases</p>
            </div>
        `;
        return div;
    };
    
    // Remove any existing legends
    document.querySelectorAll('.legend').forEach(el => el.remove());
    
    // Add the legend to the map
    legend.addTo(covidMap);
}

// Helper function to format numbers
function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
}
