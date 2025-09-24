<!-- detailview.tpl -->
{$resources}
<div>
<input type="hidden" id="site_url" value="{$siteURL}"></input>
    <div class="row">
        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-8">
            <h2>{$report->name}</h2>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-4">
            <button id="redirectEdit" class="edit-design-button" module-id="{$report->id}" module-name="{$report->module_dir}">Edit Design</button>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div id="echarts-container" style="height:500px; width:100%;"></div>
            <!-- Chart Container -->
        </div>
    </div>
</div>
