<?php
#[\AllowDynamicProperties]
class pd_reportsViewDetail extends ViewDetail
{
    public function display()
    {
        global $sugar_config;
        $this->smarty = new Sugar_Smarty();
        $bean = $this->bean;
 
         // Pass the data to the view
        $this->smarty->assign('siteURL',$sugar_config['site_url']);
         
        $this->smarty->assign('report', $bean); // Pass the report object for other fields like name
        $GLOBALS['log']->fatal("test".print_r($bean->char_data,1));
        echo "<script type='text/javascript'>  
            var charD = '".html_entity_decode($bean->chart_data)."';
            var reportType = '".$bean->report_type."';
        </script>";

        echo "<script src='modules/pd_analytics/js/echarts.js'>  </script>";
        echo "<script src='modules/pd_reports/js/detailview.js'> </script>";
        echo '<link rel="stylesheet" href="modules/pd_reports/css/detailview.css">';
        $this->smarty->display('modules/pd_reports/tpls/detailview.tpl');
        

    }
}
?>