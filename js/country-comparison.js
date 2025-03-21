// Country selection and comparison functionality

// Initialize country selection dropdown
function initCountrySelection() {
    const countrySelect = document.getElementById('country-select');
    if (!countrySelect) return;
    
    // Clear existing options
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    
    // Get unique countries from the data
    const countries = {};
    
    filteredData.forEach(row => {
        if (row.location && row.iso_code && !countries[row.location] && row.continent) {
            // Only add actual countries (with continent value)
            countries[row.location] = {
                name: row.location,
                iso: row.iso_code
            };
        }
    });
    
    // Sort countries alphabetically
    const sortedCountries = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));
    
    // Add countries to dropdown
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.iso;
        option.textContent = country.name;
        countrySelect.appendChild(option);
    });
    
    // Add event listener for country selection
    countrySelect.addEventListener('change', updateCountryData);
}

// Update country data based on selection
function updateCountryData() {
    const countrySelect = document.getElementById('country-select');
    const countryCard = document.getElementById('country-statistics');
    
    if (!countrySelect || !countryCard) return;
    
    const selectedIso = countrySelect.value;
    
    if (!selectedIso) {
        countryCard.style.display = 'none';
        return;
    }
    
    // Get the latest data for the selected country
    let countryData = null;
    
    filteredData.forEach(row => {
        if (row.iso_code === selectedIso) {
            if (!countryData || new Date(row.date) > new Date(countryData.date)) {
                countryData = row;
            }
        }
    });
    
    if (!countryData) {
        countryCard.style.display = 'none';
        return;
    }
    
    // Show the country card
    countryCard.style.display = 'block';
    
    // Update country card header
    document.getElementById('country-name').textContent = countryData.location;
    
    // Format numbers with commas
    const formatNumber = (num) => {
        return num ? new Intl.NumberFormat().format(Math.round(num)) : 'N/A';
    };
    
    // Update statistics
    document.getElementById('country-total-cases').textContent = formatNumber(countryData.total_cases);
    document.getElementById('country-total-deaths').textContent = formatNumber(countryData.total_deaths);
    document.getElementById('country-total-vaccinations').textContent = formatNumber(countryData.people_fully_vaccinated);
    
    // Calculate and display case fatality rate
    const cfr = countryData.total_cases && countryData.total_deaths 
        ? ((countryData.total_deaths / countryData.total_cases) * 100).toFixed(2) 
        : 'N/A';
    document.getElementById('country-cfr').textContent = cfr + '%';
    
    // Calculate and display vaccination rate
    const vacRate = countryData.people_fully_vaccinated_per_hundred 
        ? countryData.people_fully_vaccinated_per_hundred.toFixed(2) 
        : 'N/A';
    document.getElementById('country-vac-rate').textContent = vacRate + '%';
    
    // Update country chart if exists
    updateCountryTimeline(selectedIso);
}

// Update timeline chart for selected country
function updateCountryTimeline(countryIso) {
    const chartContainer = document.getElementById('country-timeline');
    if (!chartContainer) return;
    
    // Make sure the charts object exists
    if (typeof charts === 'undefined') {
        window.charts = {};
    }
    
    // Get all data for the selected country, sorted by date
    const countryTimeData = filteredData
        .filter(row => row.iso_code === countryIso)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Sample data points for the chart (to avoid overcrowding)
    const sampleFactor = Math.max(1, Math.floor(countryTimeData.length / 20));
    const sampledData = [];
    
    for (let i = 0; i < countryTimeData.length; i += sampleFactor) {
        sampledData.push(countryTimeData[i]);
    }
    
    // Prepare data for the chart
    const dates = sampledData.map(row => {
        const date = new Date(row.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    
    const newCases = sampledData.map(row => row.new_cases || 0);
    const newDeaths = sampledData.map(row => row.new_deaths || 0);
    
    // Create or update the chart
    if (charts.countryTimeline) {
        charts.countryTimeline.destroy();
    }
    
    const ctx = chartContainer.getContext('2d');
    charts.countryTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'New Cases',
                    data: newCases,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'New Deaths',
                    data: newDeaths,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Trends'
                }
            }
        }
    });
}
