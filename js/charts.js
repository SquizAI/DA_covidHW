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
    
    // Process real data for continental waves from the filtered data
    // Get monthly data for top continents
    const continentsToShow = ['Europe', 'North America', 'Asia', 'South America'];
    const continentDataByMonth = {};
    
    // Initialize data structure
    continentsToShow.forEach(continent => {
        continentDataByMonth[continent] = {};
    });

    // Process data by month for each continent
    filteredData.forEach(row => {
        if (row.continent && continentsToShow.includes(row.continent) && row.new_cases && row.date) {
            const date = new Date(row.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!continentDataByMonth[row.continent][monthYear]) {
                continentDataByMonth[row.continent][monthYear] = 0;
            }
            
            continentDataByMonth[row.continent][monthYear] += row.new_cases || 0;
        }
    });
    
    // Get all unique months across all continents
    const allMonths = new Set();
    Object.values(continentDataByMonth).forEach(continentData => {
        Object.keys(continentData).forEach(month => allMonths.add(month));
    });
    
    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort();
    
    // Format months for display (convert YYYY-MM to Mon YYYY)
    const monthLabels = sortedMonths.map(monthYear => {
        const [year, month] = monthYear.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    // Create datasets for each continent
    const continentDatasets = continentsToShow.map((continent, index) => {
        const colors = [
            { border: 'rgba(52, 152, 219, 1)', background: 'rgba(52, 152, 219, 0.1)' },  // blue
            { border: 'rgba(46, 204, 113, 1)', background: 'rgba(46, 204, 113, 0.1)' },  // green
            { border: 'rgba(231, 76, 60, 1)', background: 'rgba(231, 76, 60, 0.1)' },    // red
            { border: 'rgba(241, 196, 15, 1)', background: 'rgba(241, 196, 15, 0.1)' }   // yellow
        ];
        
        // Get data for each month for this continent
        const monthlyData = sortedMonths.map(month => {
            return continentDataByMonth[continent][month] || 0;
        });
        
        return {
            label: continent,
            data: monthlyData,
            borderColor: colors[index].border,
            backgroundColor: colors[index].background,
            fill: true
        };
    });
    
    const data = {
        labels: monthLabels,
        datasets: continentDatasets
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
    
    // Create analysis charts with real data
    const analysisCharts = [
        { 
            id: 'temporal-evolution', 
            type: 'line', 
            chartKey: 'temporalEvolution',
            title: 'Case Growth Rate Over Time',
            dataFunction: generateTemporalEvolutionData
        },
        { 
            id: 'geographical-comparison', 
            type: 'bar', 
            chartKey: 'geographicalComparison',
            title: 'Top 10 Countries by Case Fatality Rate',
            dataFunction: generateGeographicalComparisonData
        },
        { 
            id: 'policy-impact', 
            type: 'line', 
            chartKey: 'policyImpact',
            title: 'Vaccination Impact on Death Rate',
            dataFunction: generatePolicyImpactData
        },
        { 
            id: 'contextual-factors', 
            type: 'scatter', 
            chartKey: 'contextualFactors',
            title: 'Tests vs. Cases Correlation',
            dataFunction: generateContextualFactorsData
        }
    ];
    
    analysisCharts.forEach(chart => {
        const canvas = document.getElementById(chart.id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (charts[chart.chartKey]) {
                charts[chart.chartKey].destroy();
            }
            
            // Generate real data for this analysis chart
            const chartData = chart.dataFunction(filteredData);
            
            charts[chart.chartKey] = new Chart(ctx, {
                type: chart.type,
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: chart.title
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
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

// Generate data for temporal evolution chart (case growth rates)
function generateTemporalEvolutionData(data) {
    // Get monthly growth rates for global data
    const monthlyGrowth = {};
    let previousMonthCases = null;
    
    // Group data by month and calculate total cases
    data.forEach(row => {
        if (row.date && row.new_cases) {
            const date = new Date(row.date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!monthlyGrowth[monthYear]) {
                monthlyGrowth[monthYear] = { totalCases: 0, newCases: 0 };
            }
            
            monthlyGrowth[monthYear].newCases += row.new_cases || 0;
        }
    });
    
    // Calculate growth rates
    const sortedMonths = Object.keys(monthlyGrowth).sort();
    const growthRates = [];
    const monthLabels = [];
    
    sortedMonths.forEach((month, index) => {
        if (index > 0) {
            const previousMonth = sortedMonths[index - 1];
            const currentNewCases = monthlyGrowth[month].newCases;
            const previousNewCases = monthlyGrowth[previousMonth].newCases;
            
            if (previousNewCases > 0) {
                // Calculate percent change
                const growthRate = ((currentNewCases - previousNewCases) / previousNewCases) * 100;
                growthRates.push(parseFloat(growthRate.toFixed(2)));
                
                // Format month for display
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
                monthLabels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            }
        }
    });
    
    return {
        labels: monthLabels,
        datasets: [{
            label: 'Monthly Case Growth Rate (%)',
            data: growthRates,
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };
}

// Generate data for geographical comparison chart
function generateGeographicalComparisonData(data) {
    // Calculate CFR for each country
    const countryCFR = {};
    
    // Get latest data for each country
    const latestCountryData = {};
    
    data.forEach(row => {
        if (row.location && row.total_cases && row.total_deaths) {
            if (!latestCountryData[row.location] || new Date(row.date) > new Date(latestCountryData[row.location].date)) {
                latestCountryData[row.location] = row;
            }
        }
    });
    
    // Calculate CFR for each country
    Object.values(latestCountryData).forEach(country => {
        if (country.total_cases > 10000 && country.total_deaths > 0) { // Minimum threshold for meaningful CFR
            const cfr = (country.total_deaths / country.total_cases) * 100;
            countryCFR[country.location] = parseFloat(cfr.toFixed(2));
        }
    });
    
    // Sort and get top 10 countries by CFR
    const topCountries = Object.entries(countryCFR)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    return {
        labels: topCountries.map(country => country[0]),
        datasets: [{
            label: 'Case Fatality Rate (%)',
            data: topCountries.map(country => country[1]),
            backgroundColor: 'rgba(231, 76, 60, 0.7)',
            borderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 1
        }]
    };
}

// Generate data for policy impact chart (vaccination impact on death rate)
function generatePolicyImpactData(data) {
    // Group countries by vaccination rate and calculate average death rates
    const vaccinationBins = {
        'Under 20%': { deaths: 0, cases: 0, countries: 0 },
        '20-40%': { deaths: 0, cases: 0, countries: 0 },
        '40-60%': { deaths: 0, cases: 0, countries: 0 },
        '60-80%': { deaths: 0, cases: 0, countries: 0 },
        'Over 80%': { deaths: 0, cases: 0, countries: 0 }
    };
    
    // Get latest data for each country
    const latestCountryData = {};
    
    data.forEach(row => {
        if (row.location && row.people_vaccinated_per_hundred) {
            if (!latestCountryData[row.location] || new Date(row.date) > new Date(latestCountryData[row.location].date)) {
                latestCountryData[row.location] = row;
            }
        }
    });
    
    // Group countries by vaccination rate
    Object.values(latestCountryData).forEach(country => {
        if (country.people_vaccinated_per_hundred && country.total_cases > 10000 && country.total_deaths > 0) {
            const vacRate = country.people_vaccinated_per_hundred;
            let bin;
            
            if (vacRate < 20) bin = 'Under 20%';
            else if (vacRate < 40) bin = '20-40%';
            else if (vacRate < 60) bin = '40-60%';
            else if (vacRate < 80) bin = '60-80%';
            else bin = 'Over 80%';
            
            vaccinationBins[bin].deaths += country.total_deaths || 0;
            vaccinationBins[bin].cases += country.total_cases || 0;
            vaccinationBins[bin].countries++;
        }
    });
    
    // Calculate CFR for each vaccination bin
    const labels = Object.keys(vaccinationBins);
    const cfrByVaccination = labels.map(bin => {
        const data = vaccinationBins[bin];
        return data.cases > 0 ? parseFloat(((data.deaths / data.cases) * 100).toFixed(2)) : 0;
    });
    
    return {
        labels: labels,
        datasets: [{
            label: 'Case Fatality Rate by Vaccination Coverage (%)',
            data: cfrByVaccination,
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };
}

// Generate data for contextual factors chart (tests vs. cases correlation)
function generateContextualFactorsData(data) {
    // Find countries with both testing and case data
    const countryData = [];
    
    // Get latest data for each country
    const latestCountryData = {};
    
    data.forEach(row => {
        if (row.location && row.total_tests_per_thousand && row.total_cases_per_million) {
            if (!latestCountryData[row.location] || new Date(row.date) > new Date(latestCountryData[row.location].date)) {
                latestCountryData[row.location] = row;
            }
        }
    });
    
    // Format data for scatter plot
    Object.values(latestCountryData).forEach(country => {
        if (country.total_tests_per_thousand > 0 && country.total_cases_per_million > 0) {
            countryData.push({
                x: country.total_tests_per_thousand,
                y: country.total_cases_per_million,
                label: country.location
            });
        }
    });
    
    return {
        datasets: [{
            label: 'Tests vs. Cases by Country',
            data: countryData,
            backgroundColor: 'rgba(155, 89, 182, 0.7)',
            borderColor: 'rgba(155, 89, 182, 1)',
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
}
