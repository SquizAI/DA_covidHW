// Map visualization functionality

// Initialize map when document is ready
$(document).ready(function() {
    // Ensure jQuery and jVectorMap are properly loaded
    if (typeof jQuery.fn.vectorMap === 'undefined') {
        console.error('jVectorMap plugin is not available');
        return;
    }
    
    // Initialize an empty map on page load to avoid the jvm error
    initEmptyMap();
});

// Initialize an empty map
function initEmptyMap() {
    const mapChart = document.getElementById('map-chart');
    if (!mapChart) return;
    
    try {
        $(mapChart).empty();
        $(mapChart).css('height', '400px');
        $(mapChart).vectorMap({
            map: 'world_mill',
            backgroundColor: 'transparent'
        });
    } catch (error) {
        console.error('Error initializing empty map:', error);
    }
}

// Update the Global Map View
function updateMapView() {
    // Check if jQuery is available
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not available');
        return;
    }
    
    // Check if vectorMap is available on jQuery
    if (typeof jQuery.fn.vectorMap === 'undefined') {
        console.error('jVectorMap plugin is not available');
        return;
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
