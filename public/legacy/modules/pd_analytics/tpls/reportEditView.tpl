{$resources}
<div>
    <div class="loader-container" id="analyticsLoader">
        <div class="analytics-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <input type="hidden" id="site_url" value="{$siteURL}"></input>
    <div class="row row-margin-bottom">
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
            <input type="text" id="graph-name" module-id="{$report->id}" module-name="{$report->module_dir}" placeholder="Enter Visualization Name" style="font-size:30px; margin-top:1.3%;" value="{$report->name}"></input>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
            <button id="redirectDetail" class="view-design-button" module-id="{$report->id}" module-name="{$report->module_dir}">View Design</button>
        </div>
    </div>
    {if $report->report_type ne 'tabular'}
    <div class="row row-margin-bottom">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div class="toolbar">
                <div class="toolbar-button-div">Visualization Type:</div>
                <div class="toolbar-icons">
                    <button class="icon-button type-button"  module-id="{$report->id}" module-name="{$report->module_dir}" report-type="pie">
                        <img src="modules/pd_analytics/images/pie.png" title="Pie Chart" alt="Pie Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="line">
                        <img src="modules/pd_analytics/images/line.png" title="Line Chart" alt="Line Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="bar">
                        <img src="modules/pd_analytics/images/bar.png" title="Bar Chart" alt="Bar Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="horizontal-bar">
                        <img src="modules/pd_analytics/images/horizontal-bar.png" title="Horizontal Bar Chart" alt="Horizontal Bar Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="scatter">
                        <img src="modules/pd_analytics/images/scatter.png" title="Scatter Chart" alt="Scatter Chart">
                    </button>
                </div>
            </div>
        </div>
    </div>
    {/if}
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div class="report-builder">
                <!-- Tabs -->
                <div class="tabs">
                    <button id="graph-btn" class="tab active" data-tab="graphTab">Graph</button>
                    <button id="filter-btn" class="tab" data-tab="ba-btns">Filters</button>
                    {if $report->data_query ne ''}
                    <a id="reset_chart" module-id="{$report->id}" module-name="{$report->module_dir}" class="reset-all" >Reset All</a>
                    {/if}
                </div>

                <!-- Basic/Advance filters buttons-->
                <div id="ba-btns" style="display:none;">
                    <button class="basic-btn active">Basic</button>
                    <button class="advance-btn" data-tab="filtersTab">Advance</button>
                </div>

                <!-- Tab Content -->
                <!-- Graph Tab -->
                <div id="graphTab" class="tab-content active-tab">
                    {if $report->report_type ne 'tabular'}
                        <div class="row">
                            <div class="column">
                                <div class="select-container">
                                    <label for="x-axis" style="padding-left: 1rem;"> {if $report->report_type == 'horizontal-bar'} Y-Axis {else} X-Axis{/if}</label>
                                    <div class="custom-select">
                                        <select class="drop-zone select-width" id="x-axis">
                                            <option value="" {if $report->x_axis_field == $label}selected{/if}>{if $report->report_type == 'horizontal-bar'} Select Y-Axis {else} Select X-Axis{/if}</option>
                                            {foreach from=$moduleFields key=id item=label}
                                                <option value="{$label}" {if $report->x_axis_field == $label}selected{/if}>{$id}</option>
                                            {/foreach}
                                        </select>
                                        <select id="x-axis-aggregate" class="drop-zone count-dropdown">
                                            <option value="" {if $report->x_axis_aggregate == ""}selected{/if}>{if $report->report_type == 'horizontal-bar'} Select Y-Axis-Aggregate {else} Select X-Axis-Aggregate{/if}</option>
                                            <option value="actual" {if $report->x_axis_aggregate == "actual"}selected{/if}>Actual</option>
                                            <option value="count" {if $report->x_axis_aggregate == "count"}selected{/if}>Count</option>
                                            <option value="sum" {if $report->x_axis_aggregate == "sum"}selected{/if}>Sum</option>
                                            <option value="average" {if $report->x_axis_aggregate == "average"}selected{/if}>Average</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="column">
                                <div class="select-container">

                                <label for="y-axis" style="padding-left: 1rem;">{if $report->report_type == 'horizontal-bar'} X-Axis {else} Y-Axis:{/if} </label>
                                <div class="custom-select">

                                <select class="drop-zone select-width" id="y-axis">
                                    <option value="" {if $report->y_axis_field == $label}selected{/if}>{if $report->report_type == 'horizontal-bar'} Select X-Axis {else} Select Y-Axis{/if}</option>
                                    {foreach from=$moduleFields key=id item=label}
                                        <option value="{$label}" {if $report->y_axis_field == $label}selected{/if}>{$id}</option>
                                    {/foreach}
                                </select>
                                <select class="drop-zone count-dropdown" id="y-axis-aggregate">
                                    <option value="" {if $report->y_axis_aggregate == ""}selected{/if}>{if $report->report_type == 'horizontal-bar'} Select X-Axis-Aggregate {else} Select Y-Axis-Aggregate{/if}</option>
                                    <option value="count" {if $report->y_axis_aggregate == "count"}selected{/if}>Count</option>
                                    <option value="sum" {if $report->y_axis_aggregate == "sum"}selected{/if}>Sum</option>
                                    <option value="average" {if $report->y_axis_aggregate == "average"}selected{/if}>Average</option>
                                </select>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="margin-bottom:unset !important;">
                            <div class="column">
                                <button id="saveReport" class="create-design-button" module-id="{$report->id}" module-name="{$report->module_dir}">Generate Graph</button>
                            </div>
                        </div>
                    {else}
                        <div class="row">
                            <div class="col-md-8 col-lg-8 col-xl-8">
                                <label style="font-size:18px; margin-bottom:1%;" for="sql-query">Write your SQL query:</label>
                                <textarea id="sql-query" name="sql_query" rows="25" cols="80" placeholder="Enter your SQL query here..." value="{$report->data_query}" style="width:100%">{$report->data_query}</textarea>
                            </div>
                            <div class="col-md-4 col-lg-4 col-xl-4">
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
                        <div class="row">
                            <div class="column">
                                <button type="button" id="execute-report-query" class="execute-query-button" module-id="{$report->id}" module-name="{$report->module_dir}">Execute Query</button>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Basic Filters Tab -->
                <input type="hidden" id="filter_type" value="basic"></input>
                <div class="basic-filters" style="display: none;">
                    <div class="basic-filters-tab" id="basic-filters-tab-unq">
                        {assign var="ctype" value=$report->filter_type}

                        <!-- Period Filter -->
                        {assign var="periodFilter" value=null}
                        {assign var="userFilter" value=null}
                        {assign var="dynamicFilters" value=[]}

                        {if isset($filterData[0].filters) && $ctype != 'advance'}
                            {foreach from=$filterData[0].filters item=filter name=filterLoop}
                                {if $filter.field == 'timeframe'}
                                    {assign var="periodFilter" value=$filter}
                                {elseif $filter.field == 'user'}
                                    {assign var="userFilter" value=$filter}
                                {else}
                                    {append var="dynamicFilters" value=$filter}
                                {/if}
                            {/foreach}
                        {/if}

                        <!-- Ensure at least one filter per section is displayed -->
                        {if !$periodFilter}
                            {assign var="periodFilter" value=["field" => "timeframe", "value" => "All Time"]}
                        {/if}

                        {if !$userFilter}
                            {assign var="userFilter" value=["field" => "user", "value" => []]}
                        {/if}

                        {if $dynamicFilters|@count le 0}
                            {append var="dynamicFilters" value=["field" => "", "operator" => "=", "value" => ""]}
                        {/if}

                        <!-- Render Period Filter -->
                        <div class="row">
                            <div class="column">
                                <label>By Period:</label>
                                <select id="filter_field_period" name="filter_field_period" class="filter_field_period drop-zone select-width">
                                    {foreach from=["All Time","Last 7 Days","Last 28 Days","This Month","This Year","Last Month","Last Year","Date Range"] item=period}
                                        <option value="{$period}" {if $periodFilter.value eq $period}selected{/if}>{$period}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>

                        <!-- Logical Operator between Period and User -->
                        <div class="row" style="margin-bottom:2%;">
                            <div class="column">
                                <label>Logical Operator:</label>
                                <select id ="filter_logical_operator_period" class="filter_logical_operator_period drop-zone select-width">
                                    {foreach from=["AND", "OR"] item=op}
                                        <option value="{$op}" {if isset($periodFilter.fieldlogicalOperator) && $periodFilter.fieldlogicalOperator eq $op}selected{/if}>{$op}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>

                        <!-- Render User Filter -->
                        <div class="row">
                            <div class="column">
                                <label>By User:</label>
                                <select id="filter_field_user" name="filter_field_user[]" class="filter_field_user drop-zone select-width" multiple>
                                    <option value="">Select User</option>
                                    {foreach from=$users key=user_id item=user_name}
                                        <option value="{$user_id}" {if in_array($user_id, $userFilter.value)}selected{/if}>{$user_name}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>

                        <!-- Logical Operator between User and First Field Filter -->
                            <div class="row" style="margin-bottom:2%;">
                                <div class="column">
                                    <label>Logical Operator:</label>
                                    <select id ="filter_logical_operator_user" class="filter_logical_operator_user drop-zone select-width">
                                        {foreach from=["AND", "OR"] item=op}
                                            <option value="{$op}" {if isset($userFilter.fieldlogicalOperator) && $userFilter.fieldlogicalOperator eq $op}selected{/if}>{$op}</option>
                                        {/foreach}
                                    </select>
                                </div>
                            </div>

                        <!-- Render Dynamic Filters with Correct Logical Operator Placement -->
                        {foreach from=$dynamicFilters item=filter key=idx name=filterLoop}
                            <div class="row filter-row">
                                <div class="column">
                                    <label>Field:</label>
                                    <select class="filter_field drop-zone select-width" name="filter_field_new">
                                        <option value="">Select Y-Axis</option>
                                        {foreach from=$moduleFields key=field_key item=field_value}
                                            <option value="{$field_value}" {if $filter.field eq $field_value}selected{/if}>{$field_key}</option>
                                        {/foreach}
                                    </select>
                                </div>
                                <div class="column">
                                    <label>Operator:</label>
                                    <select class="filter_operator drop-zone select-width" name="filter_operator_new">
                                        <option value="">Select Operator</option>
                                        {foreach from=["equals", "not_equals", "like", "not_like", "starts_with", "ends_with", "greater_than", "less_than", "greater_or_equal", "less_or_equal", "on", "before", "after", "is_true", "is_false", "is_empty", "is_not_empty"] item=operator}
                                            <option value="{$operator}" {if $filter.operator eq $operator}selected{/if}>{$operator}</option>
                                        {/foreach}
                                    </select>
                                </div>
                                <div class="column">
                                    <label>Value:</label>
                                    <input type="text" class="filter_value drop-zone select-width" name="filter_value_new" style="min-height: 50% !important;" placeholder="Enter Value" value="{$filter.value}" />
                                    <button class="filter-group-buttons remove_filter_two all-fields-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
                                </div>
                            </div>
                            {if $idx ge 0 && isset($dynamicFilters[$idx].fieldlogicalOperator)}
                            <div class="row" style="margin-bottom:2%;">
                                <div class="column">
                                    <label>Logical Operator:</label>
                                    <select id ="filter_logical_operator_{$idx}" class="filter_logical_operator drop-zone select-width">
                                        {foreach from=["AND", "OR"] item=op}
                                            <option value="{$op}" {if isset($filter.fieldlogicalOperator) && $filter.fieldlogicalOperator eq $op}selected{/if}>{$op}</option>
                                        {/foreach}
                                    </select>
                                </div>
                            </div>
                            {/if}
                        {/foreach}

                        
                    </div>

                    <div class="row">
                        <div class="column"  style="margin-top: 1%;">
                            <button class="filter-group-buttons all-fields-add-btn" id="add_fields_filter_two" name="Add Fields Filter" value="Add Fields Filter">Add Fields Filter</button>
                        </div>
                    </div>


                    <div class="row">
                        <div class="column">
                            <button class="filter-button" id="apply_filters" module-id="{$report->id}" module-name="{$report->module_dir}" name="Apply Filters" value="Apply Filters">Apply Filters </button>
                            <button class="filter-button" id="clear_filters" module-id="{$report->id}" module-name="{$report->module_dir}" name="Clear Filters" value="Clear Filters"> Clear Filters</button>
                        </div>
                    </div>
                </div>

                <!-- Advance Filters Tab -->
                <div id="filtersTab" class="tab-content" style="display: none;">
                    <div class="row">
                        <div class="column">
                            <button class="filter-button {if $filterData && $report->filter_type == 'advance'}disable-me{/if}" id="add_group" name="Add Group" value="Add Groups">Add Group</button>
                            <button style= "display: {if $filterData && $report->filter_type == 'advance'} block {else} none{/if};" class="filter-button" id="add_group_logical_operator" name="Add AND/OR Operator" value="Add AND/OR Operator">Add AND/OR Operator</button>
                        </div>
                    </div>
                    <div id="groups-div">
                        {if $filterData && $report->filter_type == 'advance'}
                            {assign var="glo" value="NA"}
                            {foreach from=$filterData key=group_id item=group name=groupLoop} <!-- start: iterate through groups in [filterData] -->
                                {if $glo ne "NA"} <!-- Group Logical Operator -->
                                    <div class="row" style="margin-bottom:2%;">
                                        <div class="column">
                                            <label>Logical Operator:</label>
                                            <select id ="group_logical_operator_select" class="group_logical_operator drop-zone select-width">
                                                <option value="AND" {if "AND" eq $glo}selected{/if}>AND</option>
                                                <option value="OR" {if "OR" eq $glo}selected{/if}>OR</option>
                                            </select>
                                            <button class="filter-group-buttons remove_group_logical_operator remove_filter disable-me" name="Remove Filter" value="Remove Filter"> - </button>
                                        </div>
                                    </div>
                                {/if}
                                <div class="group" id="group-filter">
                                    <div class="row">
                                        <div class="column">
                                            <span style="float:left; font-size:16px;font-weight:bold;">Group</span>
                                        </div>
                                        <div class="column">
                                            <button class="filter-group-buttons remove_whole_group {if $smarty.foreach.groupLoop.last}garbidge-cls{else}disable-me{/if}" id="remove_group" name="Remove Group" value="Remove Group">Remove Group</button>
                                        </div>
                                    </div>
                                    <div class="group-filters">
                                        {assign var="flo" value="NA"}
                                        {foreach from=$group.filters key=key_side item=value_side name=fieldLoop} <!-- start: iterate through fields in [filters] -->
                                            {if $flo ne "NA"} <!-- Field Logical Operator -->
                                                <div class="row">
                                                    <div class="column">
                                                        <label>Logical Operator:</label>
                                                        <select class="filter_logical_operator drop-zone select-width">
                                                            <option value="AND" {if "AND" eq $flo}selected{/if}>AND</option>
                                                            <option value="OR" {if "OR" eq $flo}selected{/if}>OR</option>
                                                        </select>
                                                        <button class="filter-group-buttons remove_filter fld-lo-rmv-btn disable-me" name="Remove Filter" value="Remove Filter"> - </button>
                                                    </div>
                                                </div>
                                            {/if}

                                            {if $value_side.field eq "user"} <!-- User filter -->
                                                <div class="row">
                                                    <div class="column">
                                                        <label>By User:</label>
                                                        <select id="filter_field_user" name="filter_field_user[]" class="drop-zone select-width" multiple>
                                                            <option value="">Select User</option>
                                                            {foreach from=$users key=user_id item=user_name}
                                                                <option value="{$user_id}" {if $user_id eq $value_side.value[0]}selected{/if}>{$user_name}</option>
                                                            {/foreach}
                                                        </select>
                                                        <button class="filter-group-buttons remove_filter all-fields-rmv-btn {if $smarty.foreach.fieldLoop.last}garbidge-cls{else}disable-me{/if}" name="Remove Filter" value="Remove Filter"> - </button>
                                                    </div>
                                                </div>
                                            {elseif $value_side.field eq "timeframe"} <!-- Time filter -->
                                                <div class="row">
                                                    <div class="column">
                                                        <label>By Period:</label>
                                                        <select id="filter_field_period" name="filter_field_period" class="drop-zone select-width">
                                                            <option value="All Time" {if "All Time" eq $value_side.value}selected{/if}>All Time</option>
                                                            <option value="Last 7 Days" {if "Last 7 Days" eq $value_side.value}selected{/if}>Last 7 Days</option>
                                                            <option value="Last 28 Days" {if "Last 28 Days" eq $value_side.value}selected{/if}>Last 28 Days</option>
                                                            <option value="This Month" {if "This Month" eq $value_side.value}selected{/if}>This Month</option>
                                                            <option value="This Year" {if "This Year" eq $value_side.value}selected{/if}>This Year</option>
                                                            <option value="Last Month" {if "Last Month" eq $value_side.value}selected{/if}>Last Month</option>
                                                            <option value="Last Year" {if "Last Year" eq $value_side.value}selected{/if}>Last Year</option>
                                                            <option value="Date Range" {if "Date Range" eq $value_side.value}selected{/if}>Custom Date Range</option>
                                                        </select>
                                                        <button class="filter-group-buttons field remove_filter all-fields-rmv-btn {if $smarty.foreach.fieldLoop.last}garbidge-cls{else}disable-me{/if}" name="Remove Filter" value="Remove Filter"> - </button>
                                                    </div>
                                                </div>
                                                <div id="custom_date_range" class="row" style="display:none !important;">
                                                    <div class="column">
                                                        <label>Start Date:</label>
                                                        <input type="date" id="date_filter_start" name="date_filter_start" class="drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['start']}" />
                                                    </div>
                                                    <div class="column">
                                                        <label>End Date:</label>
                                                        <input type="date" id="date_filter_end" name="date_filter_end" class="drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['end']}" />
                                                    </div>
                                                </div>
                                            {else} <!-- Field filter -->
                                                <div class="row filter-row">
                                                    <div class="column">
                                                        <label>Field:</label>
                                                        <select class="filter_field drop-zone select-width" name="filter_field_new">
                                                            <option value="">Select Y-Axis</option>
                                                            {foreach from=$moduleFields key=field_key item=field_value}
                                                                <option value="{$field_value}" {if $field_value eq $value_side.field}selected{/if}>{$field_key}</option>
                                                            {/foreach}
                                                        </select>
                                                    </div>
                                                    <div class="column">
                                                        <label>Operator:</label>
                                                        <select class="filter_operator drop-zone select-width" name="filter_operator_new">
                                                            <option value="">Select Operator</option>
                                                            {foreach from=["equals", "not_equals", "like", "not_like", "starts_with", "ends_with", "greater_than", "less_than", "greater_or_equal", "less_or_equal", "on", "before", "after", "is_true", "is_false", "is_empty", "is_not_empty"] item=operator}
                                                                <option value="{$operator}" {if $value_side.operator eq $operator}selected{/if}>{$operator}</option>
                                                            {/foreach}
                                                        </select>
                                                    </div>
                                                    <div class="column">
                                                        <label>Value:</label>
                                                        <input type="text" class="filter_value drop-zone select-width" name="filter_value_new" style="min-height: 67% !important;" placeholder="Enter Value" value="{$value_side.value}" />
                                                        <button class="filter-group-buttons remove_filter all-fields-rmv-btn {if $smarty.foreach.fieldLoop.last}garbidge-cls{else}disable-me{/if}" name="Remove Filter" value="Remove Filter"> - </button>
                                                    </div>
                                                </div>
                                            {/if}
                                            
                                            {assign var="flo" value=$value_side.fieldlogicalOperator} <!-- Assign field logical operator to $flo -->
                                        {/foreach} <!-- end: iterate through fields in [filters] -->
                                    </div>
                                    <div class="row">
                                        <div class="column">
                                            <button class="filter-group-buttons all-fields-add-btn disable-me" id="add_fields_filter" name="Add Fields Filter" value="Add Fields Filter">Add Fields Filter</button>
                                            <button class="filter-group-buttons all-fields-add-btn disable-me" id="add_time_filter" name="Add Period Filter" value="Add Period Filter">Add Period Filter</button>
                                            <button class="filter-group-buttons all-fields-add-btn disable-me" id="add_user_filter" name="Add User Filter" value="Add User Filter">Add User Filter</button>
                                            <button class="filter-group-buttons fld-lo-add-btn" id="add_fields_logical_operator" name="Fields Logical Operator" value="Fields Logical Operator">AND/OR Operator</button>
                                        </div>
                                    </div>
                                </div>
                                {assign var="glo" value=$group.grouplogicalOperator} <!-- Assign group logical operator to $glo -->
                            {/foreach} <!-- end: iterate through groups in [filterData] -->
                        {/if}
                    </div>
                    <select id="filter_field_user" name="filter_field_user" class="filter_field_user_dropDown drop-zone select-width" multiple style="display:none;">
                        <option value="">Select User</option>
                        {foreach from=$users key=id item=label}
                            <option value="{$id}">{$label}</option>
                        {/foreach}
                    </select>

                    <select id="filter_field" class="filter_field drop-zone select-width" style="display:none;">
                        <option value="">Select Y-Axis</option>
                        {foreach from=$moduleFields key=id item=label}
                            <option value="{$label}">{$id}</option>
                        {/foreach}
                    </select>
                    <div class="row">
                        <div class="column">
                            <button class="filter-button" id="apply_filters" module-id="{$report->id}" module-name="{$report->module_dir}" name="Apply Filters" value="Apply Filters">Apply Filters </button>
                            <button class="filter-button" id="clear_filters" module-id="{$report->id}" module-name="{$report->module_dir}" name="Clear Filters" value="Clear Filters"> Clear Filters</button>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div id="echarts-container" style="height:500px; width:100%;"></div>
            <!-- Chart Container -->
        </div>
    </div>
</div>
