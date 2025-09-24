<?php
require_once "modules/pd_analytics/utils/utilities.php";
#[\AllowDynamicProperties]
class pd_reportsViewEdit extends ViewEdit
{
    public function display()
    {
        global $sugar_config;
        $this->smarty = new Sugar_Smarty();
        $bean = $this->bean;
        // parent::display();
        $moduleFields = getModuleFieldsAndLabels($bean->module_name);
        $GLOBALS['log']->fatal("moduleFields: ".print_r($moduleFields,1));

        $this->smarty->assign('moduleFields',$moduleFields);
        $this->smarty->assign('report', $bean); // Pass the report object for other fields like name
        $this->smarty->assign('siteURL',$sugar_config['site_url']);
        echo "<script type='text/javascript'>  
            var charD = '".html_entity_decode($bean->chart_data)."';
            var reportType = '".$bean->report_type."';
        </script>";
        echo "<script src='modules/pd_analytics/js/echarts.js'>  </script>";
        echo "<script src='modules/pd_reports/js/editview.js'> </script>";
        echo '<link rel="stylesheet" href="modules/pd_reports/css/editview.css">';
        $this->smarty->display('modules/pd_reports/tpls/editview.tpl');
    }
}