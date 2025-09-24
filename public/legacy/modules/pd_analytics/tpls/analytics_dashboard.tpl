{* File: analytics_dashboard.tpl *}

{* Include the CSS file *}
{literal}
<style>
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
}

/* Sidebar styles */
.sidebar {
    width: 200px;
    background-color: #fff;
    height: 100vh;
    border-right: 1px solid #e0e0e0;
    padding: 20px 0;
}

.sidebar-item {
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.sidebar-item:hover {
    background-color: #f0f0f0;
}

.add-collection {
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    cursor: pointer;
}

/* Main content styles */
.main-content {
    flex-grow: 1;
}

/* Header styles */
.header {
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    padding: 20px;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.header h1 {
    font-size: 24px;
}

.search-filter {
    display: flex;
    gap: 10px;
}

.search-filter input {
    padding: 5px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.search-filter button {
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
}

.search-filter button:last-child {
    background-color: #6200ee;
    color: #fff;
}

.header-bottom h2 {
    font-size: 20px;
}

/* Dashboard grid styles */
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
}

.dashboard-card {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    transition: border-color 0.3s;
    cursor: pointer;
}

.dashboard-card:hover {
    border-color: #6200ee;
}

.dashboard-icon {
    margin-bottom: 10px;
}

.dashboard-icon.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    width: 50px;
    height: 50px;
    margin: 0 auto 10px;
}

.dashboard-icon.grid div {
    background-color: #3700b3;
    border-radius: 2px;
}

.dashboard-icon.grid.gray div {
    background-color: #9e9e9e;
}

.dashboard-icon.chart {
    width: 50px;
    height: 50px;
    margin: 0 auto 10px;
}

.pie-chart {
    background: conic-gradient(#3700b3 0deg 270deg, #e0e0e0 270deg 360deg);
    border-radius: 50%;
}

.bar-chart, .line-chart {
    background-color: #3700b3;
}
</style>
{/literal}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard</title>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-item">New Report</div>
        <div class="sidebar-item">New Dashboard</div>
        <div class="sidebar-item">View All Reports</div>
        <div class="sidebar-item">View Dashboards</div>
        <div class="sidebar-item">Data Sources</div>
        <div class="sidebar-item">Export Reports</div>
        <div class="sidebar-item">AI Assistants</div>
        <div class="add-collection">+ Add New Collection</div>
    </aside>
    <main class="main-content">
        <header class="header">
            <div class="header-top">
                <h1>ANALYTICS</h1>
                <div class="search-filter">
                    
                    <button>Filter</button>
                    <button>Insights</button>
                </div>
            </div>
            <div class="header-bottom">
                <h2>Prodata - Marketing Collection ▼</h2>
                <div>
                    <input type="text" placeholder="Search Reports">
                </div>
            </div>
        </header>
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="dashboard-icon grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3>Team Performance Dashboard</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon grid gray">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3>Campaign ROI Dashboard</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3>Email Marketing Insights</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon grid gray">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h3>Social Media Dashboard</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon chart pie-chart"></div>
                <h3>Marketing Channel Distribution</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon chart bar-chart"></div>
                <h3>SEO Keyword Volume</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon chart line-chart"></div>
                <h3>Website Analytics</h3>
            </div>
            <div class="dashboard-card">
                <div class="dashboard-icon chart bar-chart"></div>
                <h3>Lead Generation Report</h3>
            </div>
        </div>
    </main>
</body>
</html>