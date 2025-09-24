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
            <input type="text" id="graph-name" style="font-size:30px; margin-top:1.3%;" value="{$report->name}"></input>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
            <button id="redirectDetail" class="view-design-button" module-id="{$report->id}" module-name="{$report->module_dir}">View Design</button>
        </div>
    </div>
    <div class="row row-margin-bottom">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div class="toolbar">
                <div class="toolbar-button-div">Chart Type:</div>
                <div class="toolbar-icons">
                    <button class="icon-button type-button"  module-id="{$report->id}" module-name="{$report->module_dir}" report-type="pie">
                        <img src="modules/pd_analytics/images/pie.png" alt="Pie Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="line">
                        <img src="modules/pd_analytics/images/line.png" alt="Line Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="bar">
                        <img src="modules/pd_analytics/images/bar.png" alt="Bar Chart">
                    </button>
                    <button class="icon-button type-button" module-id="{$report->id}" module-name="{$report->module_dir}" report-type="scatter">
                        <img src="modules/pd_analytics/images/line.png" alt="Scatter Chart">
                    </button>
                </div>
                <button id="saveReport" class="create-design-button" style="display:none;" module-id="{$report->id}" module-name="{$report->module_dir}">Create Report</button>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div class="report-builder">
                <div class="tabs">
                    <button class="tab active">Graph</button>
                </div>
                <div class="tab-content">
                    <div class="row">
                        <div class="column">
                            <label for="x-axis">X-Axis:</label>
                            <select class="drop-zone select-width" id="x-axis">
                                <option value="" {if $report->x_axis_field == $label}selected{/if}>Select X-Axis</option>
                                {foreach from=$moduleFields key=id item=label}
                                    <option value="{$label}" {if $report->x_axis_field == $label}selected{/if}>{$id}</option>
                                {/foreach}
                            </select>
                        </div>
                        <div class="column">
                            <label for="y-axis">Y-Axis:</label>
                            <select class="drop-zone select-width" id="y-axis">
                                <option value="" {if $report->y_axis_field == $label}selected{/if}>Select Y-Axis</option>
                                {foreach from=$moduleFields key=id item=label}
                                    <option value="{$label}" {if $report->y_axis_field == $label}selected{/if}>{$id}</option>
                                {/foreach}
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column" id="x-axis-aggregate-container" style="display:none;">
                            <label for="x-axis-aggregate">X-Axis-Aggregate:</label>
                            <select class="drop-zone select-width" id="x-axis-aggregate">
                                <option value="" {if $report->x_axis_aggregate == ""}selected{/if}>Select X-Axis-Aggregate</option>
                                <option value="actual" {if $report->x_axis_aggregate == "actual"}selected{/if}>Actual</option>
                                <option value="count" {if $report->x_axis_aggregate == "count"}selected{/if}>Count</option>
                                <option value="sum" {if $report->x_axis_aggregate == "sum"}selected{/if}>Sum</option>
                                <option value="average" {if $report->x_axis_aggregate == "average"}selected{/if}>Average</option>
                            </select>
                        </div>
                        <div class="column" id="y-axis-aggregate-container" style="display:none;">
                            <label for="y-axis-aggregate">Y-Axis-Aggregate:</label>
                            <select class="drop-zone select-width" id="y-axis-aggregate">
                                <option value="" {if $report->y_axis_aggregate == ""}selected{/if}>Select Y-Axis-Aggregate</option>
                                <option value="count" {if $report->y_axis_aggregate == "count"}selected{/if}>Count</option>
                                <option value="sum" {if $report->y_axis_aggregate == "sum"}selected{/if}>Sum</option>
                                <option value="average" {if $report->y_axis_aggregate == "average"}selected{/if}>Average</option>
                            </select>
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
