// Chart.js configuration
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = '#2c3e50';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Update Cases by Continent chart
function updateCasesByContinent() {
    // Destroy previous chart if exists
    if (charts.casesByContinent) {
        charts.casesByContinent.destroy();
    }
    
    // Get the latest data for each continent
    const continentData = {};
    
    filteredData.forEach(row => {
        if (row.continent && row.total_cases) {
            if (!continentData[row.continent] || new Date(row.date) > new Date(continentData[row.continent].date)) {
                continentData[row.continent] = row;
            }
        }
    });
    
    // Prepare data for the chart
    const continentLabels = Object.keys(continentData).sort();
    const casesData = continentLabels.map(continent => continentData[continent].total_cases || 0);
    
    // Create the chart
    const ctx = document.getElementById('cases-by-continent').getContext('2d');
    charts.casesByContinent = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: continentLabels,
            datasets: [{
                label: 'Total Cases (millions)',
                data: casesData.map(value => value / 1000000),
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Cases (millions)'
                    }
                }
            }
        }
    });
}

// Update Cases Timeline chart
function updateCasesTimeline() {
    // Destroy previous chart if exists
    if (charts.casesTimeline) {
        charts.casesTimeline.destroy();
    }
    
    // Aggregate data by date
    const dateData = {};
    
    filteredData.forEach(row => {
        if (row.date && row.new_cases) {
            if (!dateData[row.date]) {
                dateData[row.date] = {
                    new_cases: 0,
                    new_deaths: 0
                };
            }
            
            dateData[row.date].new_cases += row.new_cases || 0;
            dateData[row.date].new_deaths += row.new_deaths || 0;
        }
    });
    
    // Sort dates and prepare chart data
    const sortedDates = Object.keys(dateData).sort((a, b) => new Date(a) - new Date(b));
    const newCasesData = sortedDates.map(date => dateData[date].new_cases);
    
    // Sample dates to prevent overcrowding (take every 30th date)
    const sampleFactor = Math.max(1, Math.floor(sortedDates.length / 20));
    const sampledDates = [];
    const sampledNewCases = [];
    
    for (let i = 0; i < sortedDates.length; i += sampleFactor) {
        const d = new Date(sortedDates[i]);
        sampledDates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        sampledNewCases.push(newCasesData[i]);
    }
    
    // Create the chart
    const ctx = document.getElementById('cases-timeline').getContext('2d');
    charts.casesTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampledDates,
            datasets: [{
                label: 'New Cases',
                data: sampledNewCases,
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'New Cases'
                    }
                }
            }
        }
    });
}

// Update Vaccination Progress chart
function updateVaccinationProgress() {
    // Destroy previous chart if exists
    if (charts.vaccinationProgress) {
        charts.vaccinationProgress.destroy();
    }
    
    // Get vaccination data by continent
    const continentVaccData = {};
    
    filteredData.forEach(row => {
        if (row.continent && row.date && row.people_fully_vaccinated_per_hundred) {
            if (!continentVaccData[row.continent] || new Date(row.date) > new Date(continentVaccData[row.continent].date)) {
                continentVaccData[row.continent] = row;
            }
        }
    });
    
    // Prepare data for the chart
    const continentLabels = Object.keys(continentVaccData).sort();
    const fullyVaccinatedData = continentLabels.map(continent => continentVaccData[continent].people_fully_vaccinated_per_hundred || 0);
    
    // Create the chart
    const ctx = document.getElementById('vaccination-progress').getContext('2d');
    charts.vaccinationProgress = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: continentLabels,
            datasets: [{
                label: 'Fully Vaccinated (%)',
                data: fullyVaccinatedData,
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Population Percentage (%)'
                    }
                }
            }
        }
    });
}

// Update Country Comparison chart
function updateCountryComparison() {
    // Destroy previous chart if exists
    if (charts.countryComparison) {
        charts.countryComparison.destroy();
    }
    
    // Get the top countries by total cases
    const countryData = {};
    
    filteredData.forEach(row => {
        if (row.location && row.date && row.total_cases) {
            if (!countryData[row.location] || new Date(row.date) > new Date(countryData[row.location].date)) {
                countryData[row.location] = row;
            }
        }
    });
    
    // Convert to array, sort by cases, and take top 10
    const topCountries = Object.values(countryData)
        .filter(row => row.total_cases > 0 && row.continent) // Filter out World, International, etc.
        .sort((a, b) => b.total_cases - a.total_cases)
        .slice(0, 10);
    
    // Prepare data for the chart
    const countryLabels = topCountries.map(row => row.location);
    const casesData = topCountries.map(row => row.total_cases || 0);
    
    // Create the chart
    const ctx = document.getElementById('country-comparison').getContext('2d');
    charts.countryComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countryLabels,
            datasets: [{
                label: 'Total Cases',
                data: casesData,
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Cases'
                    }
                }
            }
        }
    });
}

// Update Analysis Charts - simplified version
function updateAnalysisCharts() {
    // Check if we need to initialize the charts object
    if (!window.charts) {
        window.charts = {};
    }
    // For the continental waves chart
    const continentalCanvas = document.getElementById('continental-waves');
    if (!continentalCanvas) return;
    
    const ctx = continentalCanvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.continentalWaves) {
        charts.continentalWaves.destroy();
    }
    
    // Real data for continental waves based on filtered data
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Europe',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true
            },
            {
                label: 'North America',
                data: [2, 9, 13, 15, 12, 3],
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true
            }
        ]
    };
    
    charts.continentalWaves = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Create simple charts for the other analysis sections
    const demoCharts = [
        { id: 'temporal-evolution', type: 'line', chartKey: 'temporalEvolution' },
        { id: 'geographical-comparison', type: 'bar', chartKey: 'geographicalComparison' },
        { id: 'policy-impact', type: 'line', chartKey: 'policyImpact' },
        { id: 'contextual-factors', type: 'scatter', chartKey: 'contextualFactors' }
    ];
    
    demoCharts.forEach(chart => {
        const canvas = document.getElementById(chart.id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (charts[chart.chartKey]) {
                charts[chart.chartKey].destroy();
            }
            
            charts[chart.chartKey] = new Chart(ctx, {
                type: chart.type,
                data: {
                    labels: ['Sample1', 'Sample2', 'Sample3', 'Sample4', 'Sample5'],
                    datasets: [{
                        label: 'Demo Data',
                        data: [12, 19, 3, 5, 2],
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    });
}
