<?php
require_once ('modules/pd_analytics/utils/utilities.php');

#[\AllowDynamicProperties]
class pd_dashboardViewDetail extends ViewDetail
{
    public function display()
    {

        $this->smarty = new Sugar_Smarty();
        $bean = $this->bean;
        $reportsData = getReportsData('pd_reports',$bean->id);
         // Pass the data to the view
        $GLOBALS['log']->fatal("test".print_r($bean->char_data,1));
        foreach ($reportsData as &$report) {
            $report['chart_data'] = addslashes($report['chart_data']);  // Escape quotes in chart_data
        }
         $this->smarty->assign('report', $bean); // Pass the report object for other fields like name
        $GLOBALS['log']->fatal("reportsData: ".print_r($reportsData,1));
        echo "<script type='text/javascript'>  
            var reportsData = '".json_encode($reportsData)."';
        </script>";

        echo "<script src='modules/pd_analytics/js/echarts.js'>  </script>";
        echo "<script src='modules/pd_dashboard/js/detailview.js'> </script>";
        $this->smarty->display('modules/pd_dashboard/tpls/detailview.tpl');
        

    }
}
?>