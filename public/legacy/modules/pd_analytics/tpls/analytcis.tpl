
    <link rel="stylesheet" type="text/css" href="modules/pd_analytics/css/analytics.css">
    <script src="modules/pd_analytics/js/analytics.js"></script>
    <link rel='stylesheet' href='modules/pd_analytics/css/dragndrop.css'>
    <script src='modules/pd_analytics/js/echarts.js'>  </script>
    <div class="loader-container" id="analyticsLoader">
        <div class="analytics-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div id="create_modal" class="modal" tabindex="-1" style="display:none;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h3 class="modal-title">Select Data Module</h3>
                </div>
                <input type="hidden" id="moduleName" value="pd_reports"></input>
                <div class="row modal-select-label">
                    <label class="col-md-12">Select Module</label>
                </div>
                <div class="row modal-selection-box">
                    <select id="chart-module" class="col-md-12">
                        {foreach from=$modules key=modulevalue item=modulelabel}
                            <option value="{$modulevalue}">{$modulelabel}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="row modal-select-label">
                    <label class="col-md-12">Select Chart Type</label>
                </div>
                <div class="row modal-selection-box">
                    <select id="chart_type" class="col-md-12">
                        <option value="pie">Pie Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="horizontal-bar">Horizontal Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="scatter">Scatter Chart</option>
                        <option value="tabular">Query Table</option>
                    </select>
                </div>
                
                <div class="modal-select-buttons">
                    <button type="button" id="close_modal" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="create_report" class="btn btn-primary">Create Visualization</button>
                </div>

            </div>
        </div>
    </div>
    <div class="analytics-container">
        <input type="hidden" id="site_url" value="{$siteURL}"></input>

        <div class="left-container">
            <div id="data-source-btn" class="sidebar-item">
                <img src="modules/pd_analytics/images/data_sources.svg" alt="Icon" width="25" height="25">
                <span class="text-padd">Data Sources</span></div>
            <div class="sidebar-item"><img src="modules/pd_analytics/images/export_reports.svg" alt="Icon"
                    width="25" height="25"><span class="text-padd">Export Reports</span></div>
            <div class="sidebar-item"><img src="modules/pd_analytics/images/ai_assistants.svg" alt="Icon" width="25"
                    height="25"><span class="text-padd">AI Assistants</span></div>
        </div>

        <div id="right-container-content" class="right-container">
            <div class="row dropdown-padding" style="margin-bottom:unset;">
                <div class="col-md-8 custom-input-style">
                    <p class="analytics_header">Analytics</p>
                </div>
                <div class="col-md-2 custom-input-style">
                    <div class="input-container" style="float:right;">
                        <input id="search-collections" type="text" placeholder="Search" style="font-size:18px">
                    </div>
                </div>
                <div class="col-md-2">
                    <select id="collections-dropdown" class="custom-collection-select" style="float:right; width:100% !important; padding:1rem; padding-right: 3rem; max-width:100% !important;">
                        <option value="add_workspace"> Add Workspace </option>
                        <hr></hr>
                        {foreach from=$collections key=id item=label}
                            <option value="{$id}" {if $selectedCollectionID == $id}selected{/if}>{$label}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <div id="right-container-inner-content">
                <div class="row">
                    <div class="col-xl-6 col-lg-6 col-sm-6 col-md-6 create-button-pairs">
                        <button class="custom-button" id="create_visualization">
                            <img src="modules/pd_analytics/images/new_report.svg"alt="Icon" width="25" height="25"> Create New Visualization
                        </button>
                    </div> 
                    <div class="col-xl-6 col-lg-6 col-sm-6 col-md-6 create-button-pairs">
                        <button class="custom-button" id="create_dashboard">
                            <img src="modules/pd_analytics/images/dashboard.svg"alt="Icon" width="25" height="25"> Create New Dashboard
                        </button>
                    </div> 
                </div>
                <div class="row button-group-row">
                    <div class="col-xl-4 col-lg-4 col-sm-4 col-md-4 create-button-pairs">
                            <div class="button-group">
                                <button class="view-all-reports" style="border-right:1px solid #ccc">Visualization</button>
                                <button class="view-all-dashboards">Dashboards</button>
                            </div>
                    </div> 
                    <div class="col-xl-8 col-lg-8 col-sm-8 col-md-8 create-button-pairs">
                    </div> 
                </div>
                <div id="home-dasboard-data">
                {$collectionViewTpl}
                </div>
            </div>
        </div>
    </div>

    <!-- Right pop-up menu for Data Sources option -->
    <div id="data-source-menu" class="right-dropdown-menu">
        <p class="ds-menu-title">Data Source</p>
        <div class="ds-menu-options">
            <div class="ds-menu-items">
                <img src="modules/pd_analytics/images/db.png" alt="Icon" width="30" height="30">
                <div>
                    <p class="right-menu-items-text-title">Query Table</p>
                    <p class="right-menu-items-text-body">Perform advanced transformations 
                        on your data in any database 
                        dialect, using SQL SELECT queries.
                    </p>
                </div>
            </div>
        </div>
        <div class="ds-menu-btn">Create New Data</div>
    </div>

        <div id="filter_modal" class="modal" tabindex="-1" style="display:none;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <div class="row">
                        <div class="col-lg-9 col-md-9 col-sm-9">
                            <h3 class="modal-title">Apply Dashboard Filters</h3>
                        </div>
                        
                        <div class="col-lg-3 col-md-3 col-sm-3">
                            <span id="close_dashboard_filter" style="font-size:20px; float:right; cursor:pointer;">X</span>
                        </div>
                    </div>
                </div>
                <input type="hidden" id="Dashboard-name" value=""></input>
                <input type="hidden" id="Dashboard-moduleId" value=""></input>
                <input type="hidden" id="Dashboard-moduleName" value="pd_dashboard"></input>
                <div class="row modal-select-label" style="font-size:15px;">
                    <label class="col-md-12">By Period:</label>
                </div>
                <div class="row modal-selection-box">
                    <select id="dashboard_filter_field_period" name="dashboard_filter_field_period" class="drop-zone select-width" style="width:100%;">
                        <option value="All Time">All Time</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 28 Days">Last 28 Days</option>
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Last Year">Last Year</option>
                        <option value="Date Range">Custom Date Range</option>
                    </select>
                </div>
                <div id="dashboard_date_range" style="display:none;">
                    <div class="row modal-select-label" style="font-size:15px;">
                        <label class="col-md-12">Date Range:</label>
                    </div>
                    <div class="row modal-selection-box">
                        <input type="date" id="dashboard_date_filter_start" name="dashboard_date_filter_start" class="col-md-11 drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['start']}" />
                    </div>
                    <div class="row modal-selection-box">
                        <input type="date" id="dashboard_date_filter_end" name="dashboard_date_filter_end" class="col-md-11 drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['end']}" />                    
                    </div>
                </div>
                <div class="row modal-select-label" style="font-size:15px;">
                    <label class="col-md-12">Logical Operator:</label>
                </div>
                <div class="row modal-selection-box">
                    <select id="dashboard_filter_period_operator" name="dashboard_filter_field_user" class="drop-zone select-width" style="width:100%;">
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                </div>
                <div class="row modal-select-label" style="font-size:15px;">
                    <label class="col-md-12">By User:</label>
                </div>
                <div class="row modal-selection-box">
                    <select id="dashboard_filter_field_user" name="dashboard_filter_field_user" class="drop-zone select-width" style="width:100%;" multiple>
                        <option value="">Select User</option>
                        {foreach from=$users key=id item=label}
                            <option value="{$id}">{$label}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="modal-select-buttons">
                    <button type="button" id="clear_filters" class="btn btn-secondary" data-bs-dismiss="modal">Clear Filters</button>
                    <button type="button" id="clear_filter_fields" class="btn btn-secondary">Clear</button>
                    <button type="button" id="applyfilters" class="btn btn-primary">Apply Filters</button>

                </div>

            </div>
        </div>
    </div>

    <div id="new_collection_modal" class="modal" tabindex="-1" style="display:none;">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h3 class="modal-title">Add New Workspace</h3>
                </div>
                <div class="row modal-select-label">
                    <label class="col-md-12">New Workspace Name</label>
                </div>
                <div class="row modal-selection-box">
                    <input id="new_collection_name" name="collection-name" class="" value="" style="width:92% !important"></input>
                </div>
                
                <div class="modal-select-buttons">
                    <button type="button" id="close_collection_modal" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" id="create_new_collection" class="btn btn-primary">Create New Workspace</button>
                </div>

            </div>
        </div>
    </div>