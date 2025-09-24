<!-- detailview.tpl -->
{$resources}
<div>
<input type="hidden" id="site_url" value="{$siteURL}"></input>
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <h2>{$report->name}</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div id="echarts-container" style="height:500px; width:100%;"></div>
            <!-- Chart Container -->
        </div>
    </div>
</div>
