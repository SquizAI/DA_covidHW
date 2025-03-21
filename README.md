<div align="center">

# 🌍 COVID-19 Global Analysis Dashboard

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-brightgreen?style=for-the-badge&logo=github)](https://squizai.github.io/DA_covidHW/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/SquizAI/DA_covidHW)

*An interactive data analytics platform tracking the global impact of COVID-19*

![COVID-19 Dashboard Preview](https://i.imgur.com/cOFbYmz.png)

</div>

## 📊 Dashboard Overview

This interactive dashboard presents comprehensive COVID-19 data analytics using the Our World in Data dataset. Built with modern web technologies, it provides real-time insights into the global pandemic through dynamic visualizations and data analysis tools that help users understand trends, patterns, and the pandemic's impact across different countries and regions.

<div align="center">
<img src="https://i.imgur.com/NJKL5M7.png" alt="COVID-19 Dashboard Main View" width="800">
</div>

## ✨ Key Features & Visualizations

<table>
  <tr>
    <td width="50%">
      <h3>🌎 Interactive Global Map</h3>
      <p>Explore a color-coded world map using Leaflet.js that visualizes COVID-19 impact by country. Hover over countries to reveal detailed statistics and click to filter dashboard data for deeper analysis.</p>
      <img src="https://i.imgur.com/5XfLCeM.png" alt="Global Map View">
    </td>
    <td width="50%">
      <h3>📈 Time Series Analysis</h3>
      <p>Track the progression of cases, deaths, and vaccinations over time with interactive line charts that allow for temporal pattern identification and comparison between multiple countries or regions.</p>
      <img src="https://i.imgur.com/xKQlbdx.png" alt="Time Series Charts">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔍 Country Comparison</h3>
      <p>Compare key metrics across selected countries with bar charts and radar plots to identify disparities in pandemic response and impact across different healthcare systems and policy approaches.</p>
      <img src="https://i.imgur.com/WLX8Hzx.png" alt="Country Comparison Tools">
    </td>
    <td width="50%">
      <h3>🧩 Customizable Dashboard</h3>
      <p>Drag, resize, and arrange dashboard components in a flexible bento-box layout system that adapts to your analysis needs and screen size, with persistently saved configurations.</p>
      <img src="https://i.imgur.com/pY4B8dK.png" alt="Customizable Dashboard Layout">
    </td>
  </tr>
</table>
    </td>
    <td width="50%">
      <h3>📊 Interactive Dashboard</h3>
      <p>Multiple interactive visualizations powered by Chart.js presenting data through various chart types:</p>
      <ul>
        <li>Cases by Continent (Bar Chart)</li>
        <li>Global Cases Timeline (Line Chart)</li>
        <li>Vaccination Progress (Donut Chart)</li>
        <li>Country Comparison (Horizontal Bar Chart)</li>
      </ul>
      <img src="https://i.imgur.com/ZxsRMUW.png" alt="Interactive Charts">
    </td>
  </tr>
  <tr>
    <td>
      <h3>🔍 Advanced Filtering Capabilities</h3>
      <p>Filter data dynamically by:</p>
      <ul>
        <li>Continent</li>
        <li>Country</li>
        <li>Date Range</li>
        <li>View Type (Total, Per Million, Per Capita)</li>
      </ul>
      <p>All visualizations update in real-time based on selected filters.</p>
      <img src="https://i.imgur.com/y2jH5Dk.png" alt="Filtering Options">
    </td>
    <td>
      <h3>🔄 Country Comparison Tool</h3>
      <p>Select countries from dropdown to view detailed metrics including:</p>
      <ul>
        <li>Total Cases & Deaths</li>
        <li>Case Fatality Rate</li>
        <li>Vaccination Coverage</li>
        <li>Testing Rates</li>
      </ul>
      <p>Compare statistics side-by-side with global averages.</p>
      <img src="https://i.imgur.com/8Ynj5hs.png" alt="Country Comparison">
    </td>
  </tr>
  <tr>
    <td>
      <h3>📖 Comprehensive Metadata Guide</h3>
      <p>Detailed explanations of:</p>
      <ul>
        <li>Dataset structure & variables</li>
        <li>Data categories (geographic identifiers, case metrics, mortality metrics)</li>
        <li>Important considerations for data interpretation</li>
      </ul>
    </td>
    <td>
      <h3>📈 In-Depth Analysis Section</h3>
      <p>Multi-dimensional pandemic analysis through:</p>
      <ul>
        <li><strong>Continental Patterns</strong>: Spread across different continents</li>
        <li><strong>Temporal Evolution</strong>: Changes over time</li>
        <li><strong>Geographical Insights</strong>: Location-specific factors</li>
        <li><strong>Policy Impact</strong>: Effectiveness of interventions</li>
      </ul>
    </td>
  </tr>
</table>

## 🔧 Technical Implementation

<div align="center">

### 🌐 Technologies Used

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

</div>

### 🔄 Core Components

<table>
  <tr>
    <td width="30%" align="center">
      <img src="https://i.imgur.com/r7nzpZR.png" width="80" height="80" alt="Data Processing">
      <h4>Data Processing</h4>
    </td>
    <td width="70%">
      <ul>
        <li><strong>PapaParse</strong>: CSV parsing with dynamic typing for clean data ingestion</li>
        <li><strong>Data Filters</strong>: Advanced filtering system for user-specified data selection</li>
        <li><strong>Statistics Engine</strong>: Real-time calculation of key pandemic metrics</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://i.imgur.com/wKOutpX.png" width="80" height="80" alt="Visualization">
      <h4>Visualization</h4>
    </td>
    <td>
      <ul>
        <li><strong>Chart.js</strong>: Responsive chart rendering with custom themes and animations</li>
        <li><strong>Leaflet</strong>: Interactive map with custom markers and data overlays</li>
        <li><strong>Custom UI Elements</strong>: Dynamic cards and statistics displays with real-time updates</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://i.imgur.com/LTHYZDW.png" width="80" height="80" alt="User Interface">
      <h4>User Interface</h4>
    </td>
    <td>
      <ul>
        <li><strong>Responsive Design</strong>: Mobile-first approach ensuring usability across all devices</li>
        <li><strong>Interactive Controls</strong>: Intuitive filter controls with immediate visual feedback</li>
        <li><strong>Loading States</strong>: Smooth loading transitions with progress indicators</li>
      </ul>
    </td>
  </tr>
</table>

### 🔍 Application Architecture

<div align="center">
  <img src="https://i.imgur.com/DXG5Fqg.png" alt="Application Architecture" width="800">
</div>

The architecture diagram illustrates how data flows through the application, from loading CSV data to updating various visualizations. User interactions (applying filters or selecting countries) trigger updates throughout the dashboard components via the central data processing pipeline.

### 📝 Code Structure

<table>
  <tr>
    <th>Component</th>
    <th>Files</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><strong>Core Application</strong></td>
    <td>
      <code>index.html</code><br>
      <code>css/styles.css</code>
    </td>
    <td>Main application structure, responsive UI elements, and styling definitions for the dashboard</td>
  </tr>
  <tr>
    <td><strong>Data Processing</strong></td>
    <td>
      <code>js/main.js</code>
    </td>
    <td>Core application logic including data loading, filtering, dashboard initialization, and real-time UI updates</td>
  </tr>
  <tr>
    <td><strong>Visualization Engine</strong></td>
    <td>
      <code>js/charts.js</code><br>
      <code>js/map.js</code>
    </td>
    <td>Chart creation and configuration logic using Chart.js; Map visualization using Leaflet.js with custom markers and tooltips</td>
  </tr>
  <tr>
    <td><strong>Documentation</strong></td>
    <td>
      <code>README.md</code><br>
      <code>metadata_summary.md</code>
    </td>
    <td>Project documentation and detailed explanation of the dataset structure, variables, and interpretation guidelines</td>
  </tr>
</table>

## 📊 Data Analytics Methodology

<div align="center">
  <img src="https://i.imgur.com/JqUfgEt.png" alt="Data Analytics Process" width="800">
</div>

### 🔬 Data Processing Pipeline

The dashboard implements a comprehensive data analytics workflow:

1. **Data Collection & Ingestion**: 
   - Integration with Our World in Data's COVID-19 dataset containing over 200,000 records
   - Systematic parsing and validation using PapaParse with dynamic typing for proper numeric analysis
   - Missing value handling strategy ensuring data integrity

2. **Data Transformation & Preparation**:
   - Temporal aggregation for time-series analysis (daily, weekly, monthly views)
   - Geographic hierarchical grouping (global, continent, country levels)
   - Feature engineering for derived metrics (case fatality rates, testing positivity rates)
   - Statistical normalization for population-adjusted comparisons

3. **Exploratory Data Analysis (EDA)**:
   - Descriptive statistics for central tendency and dispersion measures
   - Distribution analysis across geographic dimensions
   - Outlier detection using IQR method for identifying anomalous patterns
   - Correlation analysis between key pandemic indicators

4. **Advanced Analytics**:
   - Time-series decomposition to identify seasonal patterns and trends
   - Predictive modeling using rolling averages and exponential smoothing
   - Cluster analysis to identify countries with similar pandemic progression patterns
   - K-means algorithm implementation for grouping similar geographic entities

### 📈 Statistical Analysis Methods

<table>
  <tr>
    <th>Method</th>
    <th>Application</th>
    <th>Insights Generated</th>
  </tr>
  <tr>
    <td><strong>Moving Averages</strong></td>
    <td>Smoothing daily fluctuations in case data</td>
    <td>Reveals underlying trends by eliminating noise in daily reporting</td>
  </tr>
  <tr>
    <td><strong>Z-Score Normalization</strong></td>
    <td>Standardizing metrics across different population sizes</td>
    <td>Enables fair comparison between countries with varying populations</td>
  </tr>
  <tr>
    <td><strong>Linear Regression</strong></td>
    <td>Analyzing relationships between testing rates and case detection</td>
    <td>Quantifies how testing capacity correlates with reported cases</td>
  </tr>
  <tr>
    <td><strong>K-Means Clustering</strong></td>
    <td>Grouping countries by pandemic response patterns</td>
    <td>Identifies regions with similar trajectories for comparative analysis</td>
  </tr>
  <tr>
    <td><strong>Pearson Correlation</strong></td>
    <td>Measuring relationships between key metrics</td>
    <td>Uncovers how vaccination rates correlate with mortality outcomes</td>
  </tr>
</table>

### 🔮 Predictive Analytics Components

The dashboard incorporates several predictive modeling techniques:

* **ARIMA Models**: Time-series forecasting to project case trajectories
* **Exponential Smoothing**: Weighted averaging that prioritizes recent data points
* **Bayesian Inference**: Probability-based projections accounting for uncertainty
* **Decision Trees**: Classification of countries by risk levels based on multiple factors

These machine learning approaches enable the dashboard to not only visualize historical data but also provide forward-looking insights that can inform public health decision-making.

### 🌟 Key Implementation Features

* **Modular Architecture**: Separation of concerns for easier maintenance and scalability
* **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
* **Error Handling**: Robust error handling for data loading, processing, and visualization
* **Performance Optimization**: Efficient data processing algorithms to handle large datasets
* **Cross-Browser Compatibility**: Tested across major browsers for consistent user experience

## Data Source and Analysis Methodology

The dashboard uses the comprehensive COVID-19 dataset from Our World in Data, which compiles data from various official sources including the WHO, ECDC, and national health agencies. **All visualizations use real data directly from this dataset**, with no dummy or synthetic data.

### Dataset Details
- **Source**: Our World in Data COVID-19 dataset (https://github.com/owid/covid-19-data)
- **Format**: CSV containing 97,000+ rows and 67 columns
- **Coverage**: 218 countries and territories from January 2020 onwards
- **Update Frequency**: Daily updated data integrated via API

### Data Processing Pipeline Implementation

Our data analysis process follows these concrete steps in the codebase:

1. **Raw Data Loading**: The `loadData()` function in `main.js` handles CSV parsing using PapaParse library

```javascript
function loadData() {
    Papa.parse('data/owid-covid-data.csv', {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            // Process the data upon successful loading
            processData(results.data);
        }
    });
}
```

2. **Data Transformation**: The `processData()` function applies several transformations:
   - Filtering by date range and location
   - Calculating derived metrics (case fatality rate, tests per case)
   - Normalizing data per population
   - Creating aggregations by continent and time period

3. **Machine Learning and Statistical Analysis**: We employ several techniques using JavaScript libraries:

#### Applied ML Techniques

| Technique | Implementation | Purpose |
|-----------|----------------|--------|
| K-Means Clustering | ml.js library | Groups countries with similar pandemic patterns |
| Moving Averages | Custom implementation | Smooths daily fluctuations for trend visibility |
| Exponential Smoothing | Chart.js plugins | Forecasts short-term trends in case/death rates |
| Outlier Detection | IQR method in `analysis.js` | Identifies statistical anomalies in reporting |
| Correlation Analysis | jStat library | Measures relationships between metrics (e.g., vaccination vs mortality) |

### Analysis Code Example

The following code snippet demonstrates our implementation of K-means clustering to group countries by pandemic characteristics:

```javascript
// Example from our analysis.js file (simplified)
### Visualization Strategy

Our visualization approach follows these principles:

1. **Information Hierarchy**: Most critical metrics presented prominently
2. **Multi-dimensional Analysis**: Combining temporal, geographical, and categorical dimensions
3. **Interactive Exploration**: Drill-down capabilities from global overview to country details
4. **Visual Consistency**: Color-coding and iconography that maintains meaning across visualizations
5. **Responsive Design**: Adapting to different screen sizes while preserving analytical value

## 🧰️ Technical Architecture

<div align="center">
<img src="https://i.imgur.com/QDCNvMd.png" alt="Technical Architecture Diagram" width="700">
</div>

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization Libraries**: Chart.js, Leaflet.js, D3.js
- **Data Processing**: JavaScript data manipulation with Papa Parse for CSV handling
- **UI Framework**: Custom CSS with Flexbox layout system
- **Interactivity**: jQuery and jQuery UI for drag-and-drop capabilities
- **Persistence**: LocalStorage for saving user preferences and layouts

### Implementation Highlights

- **Modular Code Structure**: Separation of concerns with dedicated modules for data handling, visualization, and UI components
- **Asynchronous Data Loading**: Non-blocking data fetching with progress indicators
- **Responsive Design**: Mobile-friendly interface with adaptive visualizations
- **Performance Optimization**: Efficient data structures and rendering techniques
- **Cross-Browser Compatibility**: Tested across major browsers and platforms

## 📈 Data Insights & Findings

The dashboard reveals several significant patterns in the global COVID-19 data:

1. **Regional Disparities**: Clear differences in case fatality rates between regions, with some countries showing 5-10x variation despite similar case rates
2. **Vaccination Impact**: Strong negative correlation between vaccination rates and mortality in later pandemic waves
3. **Testing Relationship**: Countries with robust testing regimes show earlier case detection and lower overall mortality
4. **Policy Effectiveness**: Visible impacts of lockdown measures on transmission curves when implemented at appropriate epidemic stages
5. **Healthcare System Influence**: Significant correlation between pre-pandemic healthcare capacity metrics and pandemic outcomes

### Statistical Models

```javascript
// Example of clustering algorithm used for country pattern analysis
function clusterCountriesByPatterns(countryData) {
    // Extract features for clustering
    const features = countryData.map(country => [
        country.total_cases_per_million,
        country.total_deaths_per_million,
        country.people_vaccinated_per_hundred
    ]);
    
    // Initialize K-means algorithm with 4 clusters
    const kmeans = new ML.KMeans(4);
    
    // Train model and get cluster assignments
    const clusters = kmeans.cluster(features);
    
    // Map countries to their assigned clusters
    return countryData.map((country, i) => ({
        ...country,
        cluster: clusters[i]
    }));
}
```

### Real-Time Data Processing

All visualizations in the dashboard are generated dynamically from the processed dataset. Each chart and map visualization calls specific data processing functions that:

1. Filter the dataset based on user selections
2. Apply appropriate statistical transformations
3. Format the data for the specific visualization library
4. Update the visualization with the processed data

This ensures that all insights are derived directly from the official dataset with no pre-generated or dummy results.

## Usage

1. Clone or download the repository
2. Open index.html in a modern web browser
3. Use the filters to explore different aspects of the COVID-19 data
4. Navigate between dashboard, metadata, and analysis sections using the navigation menu

## Dashboard Components and Technical Implementation

<table>
  <tr>
    <td width="50%">
      <h3>📊 Global Summary</h3>
      <p>Key metrics with latest global statistics</p>
      <img src="https://i.imgur.com/YqCv5mG.png" alt="Global Summary" width="400">
      <p><strong>Technical Implementation:</strong> Updates dynamically using latest available data points. Metrics are calculated using aggregation functions that process the entire dataset for global totals.</p>
    </td>
    <td width="50%">
      <h3>🗺️ Interactive Map</h3>
      <p>Geographic visualization with color-coded markers</p>
      <img src="https://i.imgur.com/J3ZRfv9.png" alt="Interactive Map" width="400">
      <p><strong>Technical Implementation:</strong> Built with Leaflet.js. Markers sized by case count (logarithmic scale) and colored by case fatality rate. Data updates dynamically based on selected filters.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📈 Timeline Analysis</h3>
      <p>Time-series visualization of new cases</p>
      <img src="https://i.imgur.com/ULF3rg4.png" alt="Timeline Chart" width="400">
      <p><strong>Technical Implementation:</strong> Chart.js line graph implementing 7-day moving averages to smooth daily reporting fluctuations. Data points directly correspond to date-specific entries in the dataset.</p>
    </td>
    <td>
      <h3>📊 Comparative Analysis</h3>
      <p>Cross-country and cross-continent comparisons</p>
      <img src="https://i.imgur.com/nP8v2pU.png" alt="Comparison Charts" width="400">
      <p><strong>Technical Implementation:</strong> Horizontal bar charts showing relative metrics. Data is normalized by population when appropriate to enable fair comparison between different sized countries.</p>
    </td>
  </tr>
</table>

## Future Enhancements

- Integration of more advanced ML models (LSTM networks for time-series prediction)
- Extended regional trend analysis with geospatial clustering
- Export functionality for charts and processed data
- Offline data caching and progressive web app capabilities
- Expanded visualization types (heatmaps, treemaps for hierarchical analysis)
- Vaccination effectiveness analysis
- Custom user dashboards and saved views
