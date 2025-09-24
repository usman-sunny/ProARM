{$resources}
<script src='modules/pd_analytics/js/echarts.js'>  </script>
<div class="row row-margin-bottom">
    <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
        <input type="text" id="dashboard-name" placeholder="Enter Dashboard Name" style="font-size:20px; margin-top:2.1%;" value="{$dashboard->name}"></input>
    </div>
    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
        <button id="saveDashboard" class="create-dashboard-design-button" module-id="{$dashboard->id}" module-name="{$dashboard->module_dir}">Save Dashboard</button>
    </div>
</div>
<div class="row">
    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 main-div">
          <div class="left-panel">
            <div class="row">
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <button id="addNewCanvas" class="btn btn-primary new-canvas-btn">Add New Canvas</button>
                </div>
            </div>
            <h2>Available Visualizations</h2>
            {foreach from=$CollectionData item=data}
                <div draggable="true" class="report-item" module-id="{$data.id}" module-name="{$data.module}">{$data.name}</div>
            {/foreach}
        </div>

        <div class="right-panel">
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
            <div class="canvas" module-id="" draggable="true">
                <div class="canvas-content" module-id="">Drop visualization here</div>
            </div>
        </div>
    </div>
</div>
<div id="create_dahsboard_modal" class="modal" tabindex="-1" style="display:none;">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <input type="hidden" id="dashboard-id"></input>
            <div class="row modal-select-label">
                <label class="col-md-12">Select Workspace</label>
            </div>
            <div class="row modal-selection-box">
                <select id="dashboard-collection-select" class="col-md-12">
                    {foreach from=$collections key=id item=label}
                        <option value="{$id}">{$label}</option>
                    {/foreach}
                </select>
            </div>
            
            <div class="modal-select-buttons">
                <button type="button" id="close_dashboard_modal" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="saveDashboard" class="btn btn-primary">Create Dashboard</button>
            </div>

        </div>
    </div>
</div>    