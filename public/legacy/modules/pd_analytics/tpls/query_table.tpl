<div class="query-table-container">
    <div class="row">
        <div class="col-lg-8 col-md-8 col-xl-8 col-sm-8">
            <input type="hidden" id="tab-type" value="">
            <h2>Query Table</h2>
            <div id="sql-header" class="row row-margin-bottom" style="display:none;">
                <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                    <input type="text" id="sql-tab-name" module-id="{$report->id}" module-name="{$report->module_dir}" placeholder="Enter Visualization Name" style="font-size:20px;" value="{$report->name}"></input>
                </div>
                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                    <select id="query-collection-select" class="col-md-12">
                        <option value="">Please Select Workspace</option>
                        {foreach from=$collections key=id item=label}
                            <option value="{$id}">{$label}</option>
                        {/foreach}
                    </select>
                </div>
            </div>
            <form id="query-form" style="margin-top:3.4%">
                <div class="form-group">
                    <label for="sql-query">Write your SQL query:</label>
                    <textarea id="sql-query" name="sql_query" rows="19" cols="80" placeholder="Enter your SQL query here..."></textarea>
                </div>
                <button type="button" id="execute-query" class="execute-query-button">Execute Query</button>
                <button type="button" id="save-query" style="display:none;" class="execute-query-button">Save Query Report</button>
            </form>
        </div>
        <div class="col-lg-4 col-md-4 col-xl-4 col-sm-4">
            <div class="dictionary-header">Click to Insert Table/Column</div>
            <div class="dictionary-tabs">
                <div class="dictionary-tab active">Tables/Columns</div>
            </div>
            <div class="dictionary-search">
                <input type="text" placeholder="Search" id="searchBar">
            </div>
            <div class="dictionary-list-container" id="modulesList">
                <!-- Modules and Fields will be dynamically inserted here -->
            </div>
        </div>
    </div>  
    <div id="query-result" class="query-result">
        <!-- Query results will be displayed here -->
    </div>
</div>


