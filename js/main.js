// Global variables
let covidData = [];
let filteredData = [];
let continents = [];
let countries = [];
let startDate, endDate;
let charts = {};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show relevant section
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Initialize data and dashboard
    loadData();
    
    // Set up filter controls
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // Set up summary card filters toggle
    document.getElementById('summary-filter-toggle').addEventListener('click', function() {
        const filterSection = document.getElementById('summary-filters');
        filterSection.classList.toggle('visible');
    });
    
    // Set up summary card filter controls
    document.getElementById('summary-view').addEventListener('change', updateSummaryStats);
    document.getElementById('summary-data-type').addEventListener('change', updateSummaryStats);
});

// Load and process data
function loadData() {
    // Show loading indicator
    document.getElementById('loading-overlay').classList.remove('hidden');
    
    // Instead of directly loading the CSV file which can cause CORS issues, 
    // we'll use a fetch with text response and then parse it with Papa Parse
    console.log('Loading CSV data...');
    
    // IMPORTANT: Using actual CSV data from the repository
    // This works on GitHub Pages because it's served from same origin
    
    fetch('data/owid-covid-data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(csvText => {
            const results = Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });
            
            console.log('CSV data loaded successfully with ' + results.data.length + ' rows');
            if (results.data.length > 0) {
                processData(results.data);
                // Update all visualizations
                updateDashboard();
            } else {
                console.error('No data rows found in CSV');
                alert('Error: No data found in the CSV file.');
            }
            // Hide loading indicator
            document.getElementById('loading-overlay').classList.add('hidden');
        })
        .catch(error => {
            console.error('Error loading data:', error);
            // Hide loading indicator even on error
            document.getElementById('loading-overlay').classList.add('hidden');
            alert('Error loading data. Please try again later.');
        });
    
}

// Function to use sample data for demo purposes
function useSampleData() {
    // Sample COVID data that mimics the structure of the real data
    const sampleData = [
        { location: 'United States', continent: 'North America', date: '2023-01-01', total_cases: 100000000, total_deaths: 1100000, new_cases: 5000, new_deaths: 50, population: 331900000 },
        { location: 'United Kingdom', continent: 'Europe', date: '2023-01-01', total_cases: 24000000, total_deaths: 200000, new_cases: 3000, new_deaths: 20, population: 67200000 },
        { location: 'India', continent: 'Asia', date: '2023-01-01', total_cases: 44000000, total_deaths: 530000, new_cases: 4000, new_deaths: 10, population: 1380000000 },
        { location: 'Brazil', continent: 'South America', date: '2023-01-01', total_cases: 36000000, total_deaths: 690000, new_cases: 2000, new_deaths: 30, population: 212000000 },
        { location: 'France', continent: 'Europe', date: '2023-01-01', total_cases: 39000000, total_deaths: 160000, new_cases: 2500, new_deaths: 15, population: 67400000 },
        { location: 'Germany', continent: 'Europe', date: '2023-01-01', total_cases: 37000000, total_deaths: 166000, new_cases: 2200, new_deaths: 12, population: 83100000 },
        { location: 'Italy', continent: 'Europe', date: '2023-01-01', total_cases: 25000000, total_deaths: 188000, new_cases: 1800, new_deaths: 10, population: 60400000 },
        { location: 'Japan', continent: 'Asia', date: '2023-01-01', total_cases: 32000000, total_deaths: 68000, new_cases: 8000, new_deaths: 5, population: 126500000 },
        { location: 'South Korea', continent: 'Asia', date: '2023-01-01', total_cases: 30000000, total_deaths: 33000, new_cases: 4000, new_deaths: 3, population: 51700000 },
        { location: 'Canada', continent: 'North America', date: '2023-01-01', total_cases: 4500000, total_deaths: 50000, new_cases: 1000, new_deaths: 5, population: 37600000 },
        { location: 'Australia', continent: 'Oceania', date: '2023-01-01', total_cases: 11000000, total_deaths: 18000, new_cases: 3000, new_deaths: 2, population: 25400000 },
        { location: 'South Africa', continent: 'Africa', date: '2023-01-01', total_cases: 4100000, total_deaths: 102000, new_cases: 500, new_deaths: 8, population: 59300000 }
    ];
    
    // Process the sample data just like we would the real data
    processData(sampleData);
    
    // Update visualizations
    updateDashboard();
    
    // Hide loading indicator
    document.getElementById('loading-overlay').classList.add('hidden');
    
    console.log('Sample data loaded for demo purposes');
}

// Process the loaded data
function processData(data) {
    console.log('Data loaded successfully, processing...');
    // Store the data globally
    covidData = data;
    
    // Extract unique continents and countries
    const continentSet = new Set();
    const countrySet = new Set();
    
    covidData.forEach(row => {
        if (row.continent) continentSet.add(row.continent);
        if (row.location) countrySet.add(row.location);
    });
    
    continents = Array.from(continentSet).sort();
    countries = Array.from(countrySet).sort();
    
    // Populate filter dropdowns
    populateFilters();
    
    // Find date range
    const dates = covidData.map(row => new Date(row.date));
    startDate = new Date(Math.min.apply(null, dates));
    endDate = new Date(Math.max.apply(null, dates));
    
    // Set initial date range in the filter inputs
    document.getElementById('start-date').valueAsDate = new Date(startDate.getTime() + 60*24*60*60*1000); // Start 2 months after first date
    document.getElementById('end-date').valueAsDate = endDate;
    
    // Apply initial filters
    filteredData = covidData;
    
    // Initialize dashboard with all data
    updateDashboard();
}

// Populate filter dropdowns
function populateFilters() {
    const continentFilter = document.getElementById('continent-filter');
    const countryFilter = document.getElementById('country-filter');
    
    // Clear existing options
    continentFilter.innerHTML = '<option value="all">All Continents</option>';
    countryFilter.innerHTML = '<option value="all">All Countries</option>';
    
    // Add continent options
    continents.forEach(continent => {
        const option = document.createElement('option');
        option.value = continent;
        option.textContent = continent;
        continentFilter.appendChild(option);
    });
    
    // Add country options
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
    
    // Add event listener to update country dropdown when continent changes
    continentFilter.addEventListener('change', updateCountryOptions);
}

// Update country dropdown based on selected continent
function updateCountryOptions() {
    const continentFilter = document.getElementById('continent-filter');
    const countryFilter = document.getElementById('country-filter');
    const selectedContinent = continentFilter.value;
    
    // Reset country dropdown
    countryFilter.innerHTML = '<option value="all">All Countries</option>';
    
    if (selectedContinent === 'all') {
        // Add all countries
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    } else {
        // Add only countries from the selected continent
        const filteredCountries = [...new Set(
            covidData
                .filter(row => row.continent === selectedContinent)
                .map(row => row.location)
        )].sort();
        
        filteredCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }
}

// Apply filters to the data
function applyFilters() {
    const continentFilter = document.getElementById('continent-filter').value;
    const countryFilter = document.getElementById('country-filter').value;
    const startDateFilter = document.getElementById('start-date').valueAsDate;
    const endDateFilter = document.getElementById('end-date').valueAsDate;
    
    filteredData = covidData.filter(row => {
        // Check continent
        if (continentFilter !== 'all' && row.continent !== continentFilter) {
            return false;
        }
        
        // Check country
        if (countryFilter !== 'all' && row.location !== countryFilter) {
            return false;
        }
        
        // Check date range
        const rowDate = new Date(row.date);
        if (rowDate < startDateFilter || rowDate > endDateFilter) {
            return false;
        }
        
        return true;
    });
    
    updateDashboard();
}

// Reset all filters to default values
function resetFilters() {
    document.getElementById('continent-filter').value = 'all';
    document.getElementById('country-filter').value = 'all';
    document.getElementById('start-date').valueAsDate = new Date(startDate.getTime() + 60*24*60*60*1000);
    document.getElementById('end-date').valueAsDate = endDate;
    
    filteredData = covidData;
    updateDashboard();
}

// Update all dashboard components
function updateDashboard() {
    updateSummaryStats();
    updateCasesByContinent();
    updateCasesTimeline();
    updateVaccinationProgress();
    updateCountryComparison();
    updateMapView(); // Add the map view update
    initCountrySelection(); // Initialize country selector
    updateAnalysisCharts();
}

// Update summary statistics
function updateSummaryStats() {
    // Get filter values
    const viewMode = document.getElementById('summary-view').value;
    const dataType = document.getElementById('summary-data-type').value;
    
    // Calculate totals based on filter settings
    let results;
    
    if (dataType === 'latest') {
        results = calculateLatestStats(viewMode);
    } else if (dataType === 'peak') {
        results = calculatePeakStats(viewMode);
    } else if (dataType === 'average') {
        results = calculateAverageStats(viewMode);
    }
    
    // Update the DOM with the calculated results
    document.getElementById('total-cases').textContent = results.totalCasesFormatted;
    document.getElementById('total-deaths').textContent = results.totalDeathsFormatted;
    document.getElementById('total-vaccinations').textContent = results.totalVaccinationsFormatted;
    document.getElementById('cfr').textContent = results.cfrFormatted;
    
    // Update tests and positivity rate if available
    if (results.totalTests) {
        document.getElementById('tests-conducted').textContent = results.totalTestsFormatted;
        document.getElementById('positivity-rate').textContent = results.positivityRateFormatted;
    } else {
        document.getElementById('tests-conducted').textContent = 'N/A';
        document.getElementById('positivity-rate').textContent = 'N/A';
    }
    
    // Update change indicators
    updateChangeIndicators(results);
    
    // Update last updated and selection info
    const lastUpdatedSpan = document.querySelector('#summary-last-updated span');
    lastUpdatedSpan.textContent = results.lastUpdated ? new Date(results.lastUpdated).toLocaleDateString() : 'N/A';
    
    const selectionSpan = document.querySelector('#summary-selection span');
    const continent = document.getElementById('continent-filter').value;
    const country = document.getElementById('country-filter').value;
    
    if (country !== 'all') {
        selectionSpan.textContent = country;
    } else if (continent !== 'all') {
        selectionSpan.textContent = continent + ' (All Countries)';
    } else {
        selectionSpan.textContent = 'Global';
    }
}

// Calculate latest statistics
function calculateLatestStats(viewMode) {
    const latestData = {};
    let totalPopulation = 0;
    
    // Group by location and get the latest date for each
    filteredData.forEach(row => {
        if (!latestData[row.location] || new Date(row.date) > new Date(latestData[row.location].date)) {
            latestData[row.location] = row;
        }
    });
    
    // Calculate totals from the latest data for each location
    const latestEntries = Object.values(latestData);
    const totalCases = latestEntries.reduce((sum, row) => sum + (row.total_cases || 0), 0);
    const totalDeaths = latestEntries.reduce((sum, row) => sum + (row.total_deaths || 0), 0);
    const totalVaccinations = latestEntries.reduce((sum, row) => sum + (row.total_vaccinations || 0), 0);
    const totalTests = latestEntries.reduce((sum, row) => sum + (row.total_tests || 0), 0);
    totalPopulation = latestEntries.reduce((sum, row) => sum + (row.population || 0), 0);
    
    // Calculate changes from previous data points (7 days before)
    const changes = calculateChanges(latestData);
    
    // Format based on view mode
    const result = formatStatsByViewMode({
        totalCases, 
        totalDeaths, 
        totalVaccinations, 
        totalTests,
        totalPopulation,
        viewMode
    });
    
    // Add changes and last updated date
    result.casesChange = changes.casesChange;
    result.deathsChange = changes.deathsChange;
    result.vaccinationsChange = changes.vaccinationsChange;
    result.lastUpdated = getLastUpdatedDate(latestEntries);
    
    return result;
}

// Calculate peak statistics
function calculatePeakStats(viewMode) {
    // For peak values, we need to find the peak for each metric separately
    const peakCases = findPeakValue(filteredData, 'new_cases');
    const peakDeaths = findPeakValue(filteredData, 'new_deaths');
    const peakVaccinations = findPeakValue(filteredData, 'new_vaccinations');
    const peakTests = findPeakValue(filteredData, 'new_tests');
    
    // Get population data from the latest entries
    const latestData = {};
    filteredData.forEach(row => {
        if (!latestData[row.location] || new Date(row.date) > new Date(latestData[row.location].date)) {
            latestData[row.location] = row;
        }
    });
    const totalPopulation = Object.values(latestData).reduce((sum, row) => sum + (row.population || 0), 0);
    
    // Format based on view mode
    const result = formatStatsByViewMode({
        totalCases: peakCases.totalValue, 
        totalDeaths: peakDeaths.totalValue, 
        totalVaccinations: peakVaccinations.totalValue, 
        totalTests: peakTests.totalValue,
        totalPopulation,
        viewMode
    });
    
    // Since these are peak values, we don't calculate changes
    result.casesChange = { percent: 'Peak' };
    result.deathsChange = { percent: 'Peak' };
    result.vaccinationsChange = { percent: 'Peak' };
    result.lastUpdated = Math.max(
        new Date(peakCases.date || 0), 
        new Date(peakDeaths.date || 0), 
        new Date(peakVaccinations.date || 0)
    ).toISOString();
    
    return result;
}

// Calculate average statistics
function calculateAverageStats(viewMode) {
    // Group data by date to calculate daily averages
    const dateMap = new Map();
    filteredData.forEach(row => {
        if (!dateMap.has(row.date)) {
            dateMap.set(row.date, []);
        }
        dateMap.get(row.date).push(row);
    });
    
    // Calculate daily totals for each date
    const dailyTotals = [];
    dateMap.forEach((rows, date) => {
        const dailyNewCases = rows.reduce((sum, row) => sum + (row.new_cases || 0), 0);
        const dailyNewDeaths = rows.reduce((sum, row) => sum + (row.new_deaths || 0), 0);
        const dailyNewVaccinations = rows.reduce((sum, row) => sum + (row.new_vaccinations || 0), 0);
        const dailyNewTests = rows.reduce((sum, row) => sum + (row.new_tests || 0), 0);
        
        dailyTotals.push({
            date,
            newCases: dailyNewCases,
            newDeaths: dailyNewDeaths,
            newVaccinations: dailyNewVaccinations,
            newTests: dailyNewTests
        });
    });
    
    // Calculate averages
    const avgCases = dailyTotals.reduce((sum, day) => sum + day.newCases, 0) / dailyTotals.length;
    const avgDeaths = dailyTotals.reduce((sum, day) => sum + day.newDeaths, 0) / dailyTotals.length;
    const avgVaccinations = dailyTotals.reduce((sum, day) => sum + day.newVaccinations, 0) / dailyTotals.length;
    const avgTests = dailyTotals.reduce((sum, day) => sum + day.newTests, 0) / dailyTotals.length;
    
    // Get population for per capita calculations
    const latestData = {};
    filteredData.forEach(row => {
        if (!latestData[row.location] || new Date(row.date) > new Date(latestData[row.location].date)) {
            latestData[row.location] = row;
        }
    });
    const totalPopulation = Object.values(latestData).reduce((sum, row) => sum + (row.population || 0), 0);
    
    // Format based on view mode
    const result = formatStatsByViewMode({
        totalCases: avgCases * 7, // Weekly average 
        totalDeaths: avgDeaths * 7, 
        totalVaccinations: avgVaccinations * 7, 
        totalTests: avgTests * 7,
        totalPopulation,
        viewMode
    });
    
    // For averages, we don't show changes
    result.casesChange = { percent: 'Avg' };
    result.deathsChange = { percent: 'Avg' };
    result.vaccinationsChange = { percent: 'Avg' };
    
    // Get the last date in the dataset
    const dates = Array.from(dateMap.keys()).sort();
    result.lastUpdated = dates[dates.length - 1];
    
    return result;
}

// Helper function to find peak value for a given metric
function findPeakValue(data, metric) {
    // Group data by date
    const dateMap = new Map();
    data.forEach(row => {
        if (!dateMap.has(row.date)) {
            dateMap.set(row.date, []);
        }
        dateMap.get(row.date).push(row);
    });
    
    // Calculate daily totals for each date
    let peak = { totalValue: 0, date: null };
    dateMap.forEach((rows, date) => {
        const total = rows.reduce((sum, row) => sum + (row[metric] || 0), 0);
        if (total > peak.totalValue) {
            peak = { totalValue: total, date };
        }
    });
    
    return peak;
}

// Helper function to format stats based on view mode
function formatStatsByViewMode({ totalCases, totalDeaths, totalVaccinations, totalTests, totalPopulation, viewMode }) {
    let result = {
        totalCases,
        totalDeaths,
        totalVaccinations,
        totalTests
    };
    
    // Default to total numbers
    if (viewMode === 'total') {
        result.totalCasesFormatted = formatNumber(totalCases);
        result.totalDeathsFormatted = formatNumber(totalDeaths);
        result.totalVaccinationsFormatted = formatNumber(totalVaccinations);
        result.totalTestsFormatted = formatNumber(totalTests);
        result.cfrFormatted = (totalCases > 0 ? (totalDeaths / totalCases * 100) : 0).toFixed(2) + '%';
        result.positivityRateFormatted = (totalTests > 0 ? (totalCases / totalTests * 100) : 0).toFixed(2) + '%';
    } 
    // Per million calculations
    else if (viewMode === 'per-million' && totalPopulation > 0) {
        const millionFactor = 1000000 / totalPopulation;
        result.totalCasesFormatted = formatNumber(totalCases * millionFactor);
        result.totalDeathsFormatted = formatNumber(totalDeaths * millionFactor);
        result.totalVaccinationsFormatted = formatNumber(totalVaccinations * millionFactor);
        result.totalTestsFormatted = formatNumber(totalTests * millionFactor);
        result.cfrFormatted = (totalCases > 0 ? (totalDeaths / totalCases * 100) : 0).toFixed(2) + '%';
        result.positivityRateFormatted = (totalTests > 0 ? (totalCases / totalTests * 100) : 0).toFixed(2) + '%';
    } 
    // Per capita calculations (as percentages)
    else if (viewMode === 'per-capita' && totalPopulation > 0) {
        result.totalCasesFormatted = (totalCases / totalPopulation * 100).toFixed(4) + '%';
        result.totalDeathsFormatted = (totalDeaths / totalPopulation * 100).toFixed(4) + '%';
        result.totalVaccinationsFormatted = (totalVaccinations / totalPopulation * 100).toFixed(2) + '%';
        result.totalTestsFormatted = (totalTests / totalPopulation * 100).toFixed(2) + '%';
        result.cfrFormatted = (totalCases > 0 ? (totalDeaths / totalCases * 100) : 0).toFixed(2) + '%';
        result.positivityRateFormatted = (totalTests > 0 ? (totalCases / totalTests * 100) : 0).toFixed(2) + '%';
    }
    
    return result;
}

// Helper function to calculate changes from previous data points
function calculateChanges(latestData) {
    const changes = {
        casesChange: { value: 0, percent: '0%' },
        deathsChange: { value: 0, percent: '0%' },
        vaccinationsChange: { value: 0, percent: '0%' }
    };
    
    // Try to find data from 7 days ago for each location
    Object.entries(latestData).forEach(([location, latest]) => {
        // Find data from approximately 7 days before
        const latestDate = new Date(latest.date);
        const targetDate = new Date(latestDate);
        targetDate.setDate(targetDate.getDate() - 7);
        
        // Find the closest date to 7 days ago
        const previousData = filteredData.find(row => 
            row.location === location && 
            Math.abs(new Date(row.date) - targetDate) < 1000 * 60 * 60 * 24 * 2 // Within 2 days
        );
        
        if (previousData) {
            // Calculate changes
            const casesDiff = (latest.total_cases || 0) - (previousData.total_cases || 0);
            const deathsDiff = (latest.total_deaths || 0) - (previousData.total_deaths || 0);
            const vaccinationsDiff = (latest.total_vaccinations || 0) - (previousData.total_vaccinations || 0);
            
            changes.casesChange.value += casesDiff;
            changes.deathsChange.value += deathsDiff;
            changes.vaccinationsChange.value += vaccinationsDiff;
        }
    });
    
    // Calculate percentage changes
    const totalCases = Object.values(latestData).reduce((sum, row) => sum + (row.total_cases || 0), 0);
    const totalDeaths = Object.values(latestData).reduce((sum, row) => sum + (row.total_deaths || 0), 0);
    const totalVaccinations = Object.values(latestData).reduce((sum, row) => sum + (row.total_vaccinations || 0), 0);
    
    // Avoid division by zero
    if (totalCases > 0) {
        const casePercentChange = (changes.casesChange.value / (totalCases - changes.casesChange.value) * 100);
        changes.casesChange.percent = casePercentChange.toFixed(1) + '%';
    }
    
    if (totalDeaths > 0) {
        const deathPercentChange = (changes.deathsChange.value / (totalDeaths - changes.deathsChange.value) * 100);
        changes.deathsChange.percent = deathPercentChange.toFixed(1) + '%';
    }
    
    if (totalVaccinations > 0) {
        const vaccinationPercentChange = (changes.vaccinationsChange.value / (totalVaccinations - changes.vaccinationsChange.value) * 100);
        changes.vaccinationsChange.percent = vaccinationPercentChange.toFixed(1) + '%';
    }
    
    return changes;
}

// Helper function to get the last updated date from data
function getLastUpdatedDate(entries) {
    if (entries.length === 0) return null;
    
    // Find the most recent date
    return entries.reduce((latest, entry) => {
        const entryDate = new Date(entry.date);
        return entryDate > latest ? entryDate : latest;
    }, new Date(0)).toISOString();
}

// Update change indicators in the UI
function updateChangeIndicators(results) {
    // Update cases change
    const casesChangeEl = document.getElementById('cases-change');
    const casesChangeIcon = casesChangeEl.querySelector('i');
    const casesChangeText = casesChangeEl.querySelector('span');
    
    if (typeof results.casesChange.percent === 'string' && !results.casesChange.percent.includes('%')) {
        casesChangeText.textContent = results.casesChange.percent;
        casesChangeIcon.className = 'fas fa-minus';
        casesChangeEl.className = 'stat-change neutral';
    } else {
        casesChangeText.textContent = results.casesChange.percent;
        const changeValue = parseFloat(results.casesChange.percent);
        
        if (changeValue > 0) {
            casesChangeIcon.className = 'fas fa-arrow-up';
            casesChangeEl.className = 'stat-change negative';
        } else if (changeValue < 0) {
            casesChangeIcon.className = 'fas fa-arrow-down';
            casesChangeEl.className = 'stat-change positive';
        } else {
            casesChangeIcon.className = 'fas fa-minus';
            casesChangeEl.className = 'stat-change neutral';
        }
    }
    
    // Update deaths change
    const deathsChangeEl = document.getElementById('deaths-change');
    const deathsChangeIcon = deathsChangeEl.querySelector('i');
    const deathsChangeText = deathsChangeEl.querySelector('span');
    
    if (typeof results.deathsChange.percent === 'string' && !results.deathsChange.percent.includes('%')) {
        deathsChangeText.textContent = results.deathsChange.percent;
        deathsChangeIcon.className = 'fas fa-minus';
        deathsChangeEl.className = 'stat-change neutral';
    } else {
        deathsChangeText.textContent = results.deathsChange.percent;
        const changeValue = parseFloat(results.deathsChange.percent);
        
        if (changeValue > 0) {
            deathsChangeIcon.className = 'fas fa-arrow-up';
            deathsChangeEl.className = 'stat-change negative';
        } else if (changeValue < 0) {
            deathsChangeIcon.className = 'fas fa-arrow-down';
            deathsChangeEl.className = 'stat-change positive';
        } else {
            deathsChangeIcon.className = 'fas fa-minus';
            deathsChangeEl.className = 'stat-change neutral';
        }
    }
    
    // Update vaccinations change
    const vaccinationsChangeEl = document.getElementById('vaccinations-change');
    const vaccinationsChangeIcon = vaccinationsChangeEl.querySelector('i');
    const vaccinationsChangeText = vaccinationsChangeEl.querySelector('span');
    
    if (typeof results.vaccinationsChange.percent === 'string' && !results.vaccinationsChange.percent.includes('%')) {
        vaccinationsChangeText.textContent = results.vaccinationsChange.percent;
        vaccinationsChangeIcon.className = 'fas fa-minus';
        vaccinationsChangeEl.className = 'stat-change neutral';
    } else {
        vaccinationsChangeText.textContent = results.vaccinationsChange.percent;
        const changeValue = parseFloat(results.vaccinationsChange.percent);
        
        if (changeValue > 0) {
            vaccinationsChangeIcon.className = 'fas fa-arrow-up';
            vaccinationsChangeEl.className = 'stat-change positive';
        } else if (changeValue < 0) {
            vaccinationsChangeIcon.className = 'fas fa-arrow-down';
            vaccinationsChangeEl.className = 'stat-change negative';
        } else {
            vaccinationsChangeIcon.className = 'fas fa-minus';
            vaccinationsChangeEl.className = 'stat-change neutral';
        }
    }
    
    // Update CFR trend
    const cfrTrend = document.getElementById('cfr-trend');
    const cfrIcon = cfrTrend.querySelector('i');
    
    // For simplicity, we're not calculating actual CFR trends here
    // In a real implementation, you'd need to compare current CFR with previous periods
    cfrIcon.className = 'fas fa-minus';
}

// Format numbers with commas
function formatNumber(number) {
    return new Intl.NumberFormat().format(Math.round(number));
}
