<input type="hidden" id="get_page_type" value="home"></input>
<div id="dashboard-grid-data" class="dashboard-grid">
    {if !empty($CollectionData)}
    {foreach from=$CollectionData item=data}
        <div class="dashboard-card" module-id="{$data.id}" module-name="{$data.module}">
            <img src="modules/pd_analytics/images/cross.png" class="delete-record" data-id="{$data.id}" modulex-name="{$data.module}" alt="Delete">
            <div class="dashboard-icon grid">
                {if $data.module eq 'pd_dashboard'}
                    <img src="modules/pd_analytics/images/dashboard.svg" alt="Icon" width="50"
                        height="50">
                {else}
                    {if $data.report_type eq 'line'}
                        <img src="modules/pd_analytics/images/line.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                    {if $data.report_type eq 'bar'}
                        <img src="modules/pd_analytics/images/bar.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                    {if $data.report_type eq 'pie'}
                        <img src="modules/pd_analytics/images/pie.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                    {if $data.report_type eq 'scatter'}
                        <img src="modules/pd_analytics/images/scatter.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                    {if $data.report_type eq 'tabular'}
                        <img src="modules/pd_analytics/images/cells.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                    {if $data.report_type eq 'horizontal-bar'}
                        <img src="modules/pd_analytics/images/horizontal-bar.png" alt="Icon" width="55"
                            height="55">
                    {/if}
                {/if}
            </div>
            <h3>{$data.name}</h3>
        </div>
    {/foreach}
    {else}
        <!-- Content to show if $CollectionData is empty -->
        <p class="no-data">No data to display</p>
    {/if}
</div>