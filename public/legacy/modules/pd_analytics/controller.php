<?php
/**
 *
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * SuiteCRM is an extension to SugarCRM Community Edition developed by SalesAgility Ltd.
 * Copyright (C) 2011 - 2018 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo and "Supercharged by SuiteCRM" logo. If the display of the logos is not
 * reasonably feasible for technical reasons, the Appropriate Legal Notices must
 * display the words "Powered by SugarCRM" and "Supercharged by SuiteCRM".
 */

require_once('include/MVC/Controller/SugarController.php');
require_once ('modules/pd_analytics/utils/utilities.php');


class pd_analyticsController extends SugarController {

    public function action_getReportsAndDashboards() {

        $GLOBALS['log']->fatal("In getReportsAndDashboards");
        ob_clean();
        $CollectionData = array();
        $collection_id=$_POST['collection_id'];
        global $current_user;
        $worspaceRes = manageUserWorkspacePreference($current_user->id, $collection_id);
        if($_POST['type'] == 'home'){
            $CollectionData = getCollectionData('pd_reports',$collection_id,$CollectionData);
            $CollectionData = getCollectionData('pd_dashboard',$collection_id,$CollectionData);
        }
        elseif($_POST['type'] == 'pd_reports'){
            $CollectionData = getCollectionData('pd_reports',$collection_id,$CollectionData);
        }
        elseif($_POST['type'] == 'pd_dashboard') {
            $CollectionData = getCollectionData('pd_dashboard',$collection_id,$CollectionData);
        }

        $GLOBALS['log']->fatal("In CollectionData: ".print_r($CollectionData,1));
        $smarty = new Sugar_Smarty();
        $smarty->assign('CollectionData',$CollectionData);

        $cardsView = $smarty->fetch('modules/pd_analytics/tpls/collection_card.tpl');
        $response = $cardsView;
        echo json_encode($response);
        exit;

    }


    public function action_getAllReports() {

        $GLOBALS['log']->fatal("In getAllReports");
        ob_clean();
        global $sugar_config, $current_user;
        $smarty = new Sugar_Smarty();
        $collections = getCollections();
        $GLOBALS['log']->fatal("Collecteiins: ".print_r($collections,1));
        $CollectionData = array();
        $worspaceRes = manageUserWorkspacePreference($current_user->id);
        $collection_id = $worspaceRes['workspace'];
        $CollectionData = getCollectionData('pd_reports',$collection_id,$CollectionData);

        $GLOBALS['log']->fatal("In CollectionData: ".print_r($CollectionData,1));
        
        $smarty->assign('CollectionData',$CollectionData);

        $smarty->assign('siteURL',$sugar_config['site_url']);

        $smarty->assign('collections',$collections);
        $smarty->assign('selectedCollectionID',$collection_id);

        $collectionViewTpl = $smarty->fetch('modules/pd_analytics/tpls/collection_view.tpl');

        $response = $collectionViewTpl;
        echo json_encode($response);
        exit;

    }


    public function action_getAllDashboards() {

        $GLOBALS['log']->fatal("In getAllDashboards");
        ob_clean();
        global $sugar_config, $current_user;
        $smarty = new Sugar_Smarty();
        $collections = getCollections();
        $GLOBALS['log']->fatal("Collecteiins: ".print_r($collections,1));
        $CollectionData = array();
        $worspaceRes = manageUserWorkspacePreference($current_user->id);
        $collection_id = $worspaceRes['workspace'];
        $CollectionData = getCollectionData('pd_dashboard',$collection_id,$CollectionData);

        $GLOBALS['log']->fatal("In CollectionData: ".print_r($CollectionData,1));
        
        $smarty->assign('CollectionData',$CollectionData);

        $smarty->assign('siteURL',$sugar_config['site_url']);

        $smarty->assign('collections',$collections);

        $smarty->assign('selectedCollectionID',$collection_id);

        $collectionViewTpl = $smarty->fetch('modules/pd_analytics/tpls/collection_view.tpl');

        $response = $collectionViewTpl;
        echo json_encode($response);
        exit;

    }


    public function action_getReportsEditView() {

        $GLOBALS['log']->fatal("In action_getReportsEditView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $moduleFields = getModuleFieldsAndLabels($bean->module_name);
        $GLOBALS['log']->fatal("moduleFields: ".print_r($moduleFields,1));
        $filterData = json_decode(html_entity_decode($bean->filter_data),1);
        if(!empty($filterData)){
            $smarty->assign('filterData',$filterData);

        }
        $users = getUsers();
        $smarty->assign('users',$users);
        $smarty->assign('moduleFields',$moduleFields);
        $smarty->assign('report', $bean); // Pass the report object for other fields like name
        $smarty->assign('siteURL',$sugar_config['site_url']);
        $chartData = "";
        if(!empty($bean->data_query) && $bean->report_type !='tabular'){
            $datasql= $bean->data_query;
            if(!empty($bean->filter_data)){
                $datasql = applyReportFilters(html_entity_decode($datasql),json_decode(html_entity_decode($bean->filter_data)),true);
            }
            $chartData = getChartData($datasql);
        }
        else{
            $repdata= $bean->data_query;
            if(!empty($bean->filter_data)){
                $repdata = applyReportFilters(html_entity_decode($repdata),json_decode(html_entity_decode($bean->filter_data)),true);
            }
            $GLOBALS['log']->fatal("In repdata: ".print_r($repdata,1));

            $chartData = generateTable(html_entity_decode($repdata));
        }

        $resources = "
            <script type='text/javascript'>  
                var charD = '".$chartData."';
                var reportType = '".$bean->report_type."';
            </script>
            <script src='modules/pd_analytics/js/echarts.js'>  </script>
            <script src='modules/pd_analytics/js/reportseditview.js'> </script>
            <link rel='stylesheet' href='modules/pd_reports/css/editview.css'>
        ";

        $smarty->assign('resources', $resources); // Pass the report object for other fields like name
        $editViewTpl = $smarty->fetch('modules/pd_analytics/tpls/reportEditView.tpl');

        $response = $editViewTpl;
        echo json_encode($response);
        exit;

    }


    public function action_getReportsDetailView() {

        $GLOBALS['log']->fatal("In action_getReportsDetailView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $moduleFields = getModuleFieldsAndLabels($bean->module_name);
        $GLOBALS['log']->fatal("moduleFields: ".print_r($moduleFields,1));
        // Pass the data to the view
        $smarty->assign('siteURL',$sugar_config['site_url']);
        $chartData = "";
        if(!empty($bean->data_query) && $bean->report_type !='tabular'){
            $datasql= $bean->data_query;
            if(!empty($bean->filter_data)){
                $datasql = applyReportFilters(html_entity_decode($datasql),json_decode(html_entity_decode($bean->filter_data)),true);
            }
            $chartData = getChartData($datasql);
        }
        else{
            $datasql= $bean->data_query;
            if(!empty($bean->filter_data)){
                $datasql = applyReportFilters(html_entity_decode($datasql),json_decode(html_entity_decode($bean->filter_data)),true);
            }
            $chartData = generateTable(html_entity_decode($datasql));
        }
         $smarty->assign('report', $bean); // Pass the report object for other fields like name
         $GLOBALS['log']->fatal("test".print_r($bean->char_data,1));
         $resources = "
            <script type='text/javascript'>  
             var charD = '".$chartData."';
             var reportType = '".$bean->report_type."';
            </script>
            <script src='modules/pd_analytics/js/echarts.js'>  </script>
            <script src='modules/pd_analytics/js/reportsdetailview.js'> </script>
            <link rel='stylesheet' href='modules/pd_reports/css/detailview.css'>
        ";

        $smarty->assign('resources', $resources); // Pass the report object for other fields like name

        $detailviewReport = $smarty->fetch('modules/pd_analytics/tpls/reportDetailView.tpl');
         

        $response = $detailviewReport;
        echo json_encode($response);
        exit;

    }


    public function action_generateReports() {

        $GLOBALS['log']->fatal("In Generate Reports");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        global $current_user;
        $worspaceRes = manageUserWorkspacePreference($current_user->id);
        $module = $bean->module_name; // Module name
        $bean->name = $data['graphName'];
        $xAxisField = $data['x-axis']; // Field to group by
        $xAxisAggregate = $data['x-axis-aggregate']; // Not processed for grouping
        $yAxisField = $data['y-axis']; // Field to count
        $yAxisAggregate = $data['y-axis-aggregate']; // Aggregate option
        $title = $bean->name;

        $result = generateReportQuery($module, $xAxisField, $xAxisAggregate, $yAxisField, $yAxisAggregate, $title);
        $GLOBALS['log']->fatal("generateReportQuery function output: " . print_r($result,1));

        if(!empty($result)){
            $bean->x_axis_field = $xAxisField;
            $bean->y_axis_field = $yAxisField;
            $bean->x_axis_aggregate = $xAxisAggregate;
            $bean->y_axis_aggregate = $yAxisAggregate;
            $bean->data_query = $result;
            $bean->collection_id = $worspaceRes['workspace'];
            $bean->save();
        }
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;

    }


    public function action_changeReportType() {

        $GLOBALS['log']->fatal("In changeReportType");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $bean->report_type = $data['reportType'];
        $bean->save();
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;

    }


    public function action_createNewReport() {

        $GLOBALS['log']->fatal("In action_createNewReport");
        ob_clean();
        $data =$_POST;
        $response = array();
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        global $current_user;
        $worspaceRes = manageUserWorkspacePreference($current_user->id);
        $reportbean = BeanFactory::newBean($data['moduleName']);
        $reportbean->report_type = $data['chartType'];
        $reportbean->module_name = $data['chartModule'];
        $reportbean->collection_id = $worspaceRes['workspace'];
        $reportID = $reportbean->save();
        $GLOBALS['log']->fatal("In reportID: ".print_r($reportID,1));

        // echo $result;
        if(!empty($reportID)){
            $response['success'] = true;
            $response['id'] = $reportID;
            $response['module'] = 'pd_reports';
        }
        $GLOBALS['log']->fatal("In response: ".print_r($response,1));
        
        echo json_encode($response);
        exit;
    }


    public function action_createDashboardView() {

        $GLOBALS['log']->fatal("In action_createDashboardView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $collections = getCollections();
        $GLOBALS['log']->fatal("Collecteiins: ".print_r($collections,1));
        $CollectionData = array();
        $collection_id = 'create_dashboard';
        $CollectionData = getCollectionData('pd_reports',$collection_id,$CollectionData);

        $GLOBALS['log']->fatal("In CollectionData: ".print_r($CollectionData,1));
        
        $smarty->assign('CollectionData',$CollectionData);
        $smarty->assign('collections',$collections);

        $smarty->assign('siteURL',$sugar_config['site_url']);

        $resources = "
            <script src='modules/pd_analytics/js/dragndrop.js'> </script>
            <script src='modules/pd_analytics/js/dashboard.js'> </script>
            <link rel='stylesheet' href='modules/pd_analytics/css/dragndrop.css'>
        ";

        $smarty->assign('resources', $resources); // Pass the report object for other fields like name
        $dashboardEditView = $smarty->fetch('modules/pd_analytics/tpls/dashboardEditView.tpl');

        $response = $dashboardEditView;
        echo json_encode($response);
        exit;

    }


    public function action_getReportsDetailViewDashboard() {

        $GLOBALS['log']->fatal("In action_getReportsDetailView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $moduleFields = getModuleFieldsAndLabels($bean->module_name);
        $GLOBALS['log']->fatal("moduleFields: ".print_r($moduleFields,1));
         // Pass the data to the view
         $smarty->assign('siteURL',$sugar_config['site_url']);
         
         $smarty->assign('report', $bean); // Pass the report object for other fields like name
         $GLOBALS['log']->fatal("test".print_r($bean->char_data,1));
        if(!empty($bean->data_query) && $bean->report_type !='tabular'){
            $chartData = getChartData(html_entity_decode($bean->data_query));
        }
        else{
            $chartData = generateTable(html_entity_decode($bean->data_query));
        }
         $resources = "
            <link rel='stylesheet' href='modules/pd_reports/css/detailview.css'>
        ";

        $smarty->assign('resources', $resources); // Pass the report object for other fields like name

        $detailviewReport = $smarty->fetch('modules/pd_analytics/tpls/dashboardReportDetailView.tpl');
         

        $response['html'] = $detailviewReport;
        $response['chartData'] = $chartData;
        $response['reporttype'] = $bean->report_type;

        echo json_encode($response);
        exit;

    }


    public function action_saveDashboard() {

        $GLOBALS['log']->fatal("In action_saveDashboard");
        ob_clean();
        global $sugar_config, $current_user;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $worspaceRes = manageUserWorkspacePreference($current_user->id);

        if(!empty($data['dashboardID'])){
            $dashboardBean = BeanFactory::getBean($data['moduleName'],$data['dashboardID']);
        }
        else {
            $dashboardBean = BeanFactory::newBean($data['moduleName']);
        }
        if (isset($_POST['layoutData'])) {
            // Decode the HTML entities in the JSON string

            // Apply `htmlspecialchars_decode` on content fields
            foreach ($data['layoutData'] as &$item) {
                if (isset($item['content'])) {
                    $item['content'] = htmlspecialchars_decode($item['content']);
                    $item['content'] = str_replace('"', "'", $item['content']);
                }
            }

            // Encode the array as a JSON string
            $jsonData = json_encode($data['layoutData'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

            // Convert double quotes to single quotes for JSON representation

            $GLOBALS['log']->fatal("In decodedLayoutData: ".print_r($jsonData, 1));

            // Save to the database
            $dashboardBean->name = $_POST['dashboardName'];
            $dashboardBean->layout_data = $jsonData; // Save the cleaned JSON
            $dashboardBean->collection_id = $worspaceRes['workspace'];
            $dashboardID = $dashboardBean->save();
        }

        echo $dashboardID;
        exit;

    }


    public function action_getDashboardDetailView() {

        $GLOBALS['log']->fatal("In action_getDashboardDetailView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $result = array();
        $result['name'] = $bean->name;
        $result['layoutdata'] = html_entity_decode($bean->layout_data);
        $GLOBALS['log']->fatal("moduleFields: ".print_r($result,1));
         
        echo $result['layoutdata'];
        exit;
    }


    public function action_getDashboardEditView() {

        $GLOBALS['log']->fatal("In action_getDashboardEditView");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleID']);
        $result = array();
        $collection_id = 'create_dashboard';
        $collections = getCollections();
        $CollectionData = getCollectionData('pd_reports',$collection_id,$CollectionData);
        
        $smarty->assign('CollectionData',$CollectionData);
        $smarty->assign('collections',$collections);


        $smarty->assign('dashboard', $bean); // Pass the report object for other fields like name

        $resources = "
        <script src='modules/pd_analytics/js/dragndrop.js'> </script>
        <script src='modules/pd_analytics/js/dashboard.js'> </script>
        <link rel='stylesheet' href='modules/pd_analytics/css/dragndrop.css'>
        ";

        $smarty->assign('resources', $resources); // Pass the report object for other fields like name

        $editViewDashboard = $smarty->fetch('modules/pd_analytics/tpls/dashboardEditView.tpl');
        $result['html'] = $editViewDashboard;
        $result['layoutdata'] = html_entity_decode($bean->layout_data);

        echo json_encode($result);
        exit;
    }


    public function action_getReportsData() {

        $GLOBALS['log']->fatal("In action_getReportsData");
        ob_clean();
        global $sugar_config;
        $smarty = new Sugar_Smarty();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        if($data['moduleId']){
            $bean = BeanFactory::getBean('pd_reports',$data['moduleId']);
            $chartData = "";
            if(!empty($bean->data_query) && $bean->report_type !='tabular'){
                $datasql= $bean->data_query;
                if(!empty($data['dashboardID'])){
                    $Dbean = BeanFactory::getBean('pd_dashboard',$data['dashboardID']);
                    if(!empty($Dbean->filter_data)){
                        $datasql = applyFilters(html_entity_decode($datasql),json_decode(html_entity_decode($Dbean->filter_data)),true);
                    }
                }else{
                    if(!empty($bean->filter_data)){
                        $datasql = applyFilters(html_entity_decode($datasql),json_decode(html_entity_decode($bean->filter_data)),true);
                    }
                }
                $chartData = getChartData($datasql);
            }
            else{
                $data_query = $bean->data_query;
                if(!empty($data['dashboardID'])){
                    $Dbean = BeanFactory::getBean('pd_dashboard',$data['dashboardID']);
                    if(!empty($Dbean->filter_data)){
                        $data_query = applyFilters(html_entity_decode($data_query),json_decode(html_entity_decode($Dbean->filter_data)),true);
                    }
                }else{
                    if(!empty($bean->filter_data)){
                        $data_query = applyFilters(html_entity_decode($data_query),json_decode(html_entity_decode($bean->filter_data)),true);
                    }
                }
                $GLOBALS['log']->fatal("In tab query modified: ".print_r($data_query,1));

                $chartData = generateTable(html_entity_decode($data_query));
            }
            $response['chartData'] = $chartData;
            $response['reporttype'] = $bean->report_type;
            $GLOBALS['log']->fatal("response: ".print_r($response,1));
    
            echo json_encode($response);
            exit;    
        }
    }


    public function action_saveFilter() {

        $GLOBALS['log']->fatal("In action_saveFilter Reports");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $bean->filter_data = $data['filter_data'];
        $bean->filter_type = $data['filterType'];
        $bean->save();
        // echo $result;
        if($data['moduleName'] == 'pd_reports'){
            $response['success'] = true;
            echo json_encode($response);     
        }else{
            echo html_entity_decode($bean->layout_data);
        }
        exit;

    }


    public function action_clearFilter() {

        $GLOBALS['log']->fatal("In action_clearFilter Reports");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $bean->filter_data = "";
        $bean->save();
        // echo $result;
        if($data['moduleName'] == 'pd_reports'){
            $response['success'] = true;
            echo json_encode($response);     
        }else{
            echo html_entity_decode($bean->layout_data);
        }
        exit;

    }


    public function action_changeFieldData() {

        $GLOBALS['log']->fatal("In action_changeFieldData");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $bean->name = $data['reportName'];
        $bean->save();
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;

    }


    public function action_saveNewCollection() {

        $GLOBALS['log']->fatal("In action_saveNewCollection");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::newBean($data['moduleName']);
        $bean->name = $data['collectionName'];
        $workspaceID = $bean->save();
        global $current_user;
        $worspaceRes = manageUserWorkspacePreference($current_user->id, $workspaceID);
        $GLOBALS['log']->fatal("In worspaceRes: ".print_r($worspaceRes,1));
        
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;

    }


    public function action_deleteRecord() {
        $GLOBALS['log']->fatal("In action_deleteRecord");
        ob_clean();
        $data = $_POST;
        $GLOBALS['log']->fatal("In data: " . print_r($data, 1));
        
        $response = array('success' => false);
        
        if (!empty($data['id']) && !empty($data['modulex'])) {
            $bean = BeanFactory::getBean($data['modulex'], $data['id']);
            if ($bean) {
                $bean->mark_deleted($data['id']);
                $response['success'] = true;
            }
        }
        
        echo json_encode($response);
        exit;
    }


    public function action_renderQueryTable() {
        $GLOBALS['log']->fatal("In action_renderQueryTable");
        ob_clean();
        $smarty = new Sugar_Smarty();
        $collections = getCollections();
        $smarty->assign('collections',$collections);
        $queryTableTpl = $smarty->fetch('modules/pd_analytics/tpls/query_table.tpl');
        $response = $queryTableTpl;
        
        echo json_encode($response);
        exit;
    }


    public function action_executeQuery() {
        $GLOBALS['log']->fatal("In action_executeQuery");

        global $db;
        // Get the SQL query from the AJAX request
        $sql = isset($_POST['sql_query']) ? trim($_POST['sql_query']) : '';
        $sql = html_entity_decode($sql);

        $GLOBALS['log']->fatal("sql:".print_r($sql,1));
        $result = generateTable($sql);
        echo $result;
        exit();
    }


    public function action_saveQueryTable() {
        $GLOBALS['log']->fatal("In action_saveQueryTable");
        $data = $_POST;
        // Get the SQL query from the AJAX request
        $sql = isset($_POST['sql_query']) ? trim($_POST['sql_query']) : '';
        $sql = html_entity_decode($sql);

        $reportbean = BeanFactory::newBean('pd_reports');
        $reportbean->name = $data['tab_name'];
        $reportbean->report_type = $data['reportType'];
        $reportbean->data_query = strtolower($sql);
        $reportbean->collection_id = $data['tab_collection'];
        $reportbean->save();
        
        echo json_encode(["success" => true]);
        exit();
    }


    public function action_saveModifiedQuery() {
        $GLOBALS['log']->fatal("In action_saveModifiedQuery");
        $data = $_POST;
        // Get the SQL query from the AJAX request
        $sql = isset($_POST['sql_query']) ? trim($_POST['sql_query']) : '';
        $sql = html_entity_decode($sql);
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));

        $reportbean = BeanFactory::getBean($data['moduleName'],$data['moduleID']);
        $reportbean->data_query = strtolower($sql);
        $reportbean->name = $data['graph_name'];
        $reportbean->save();
        $result = generateTable($sql);
        echo $result;;
        exit();
    }    


    public function action_getModulesAndFields() {

        $GLOBALS['log']->fatal("In action_getDashboardData");
        ob_clean();
    
        // Initialize the data array    
        $data = [];
    
        // Define the list of modules to exclude
        $excludedModules = [
            'acl_roles', 'acl_actions', 'prospect_lists', 'prospects', 'campaign_trkrs', 
            'releases', 'job_queue', 'schedulers', 'emailman', 'fields_meta_data', 
            'users', 'tracker', 'import_maps', 'users_last_import', 'config', 'vcals', 
            'roles', 'inbound_email', 'saved_search', 'user_preferences', 'email_addresses', 
            'emails_text', 'relationships', 'aobh_businesshours', 'sugarfeed', 'eapm', 
            'oauth_consumer', 'oauth_tokens', 'am_projecttemplates', 'am_tasktemplates', 
            'favorites', 'aok_knowledge_base_categories', 'aok_knowledgebase', 'reminders', 
            'reminders_invitees', 'fp_events', 'fp_event_locations', 'aop_case_events', 
            'aop_case_updates', 'aor_reports', 'aor_fields', 'aor_charts', 'aor_conditions', 
            'aor_scheduled_reports', 'aos_contracts', 'aos_invoices', 'aos_pdf_templates', 
            'aos_product_categories', 'aos_products', 'aos_products_quotes', 
            'aos_line_item_groups', 'aos_quotes', 'aow_actions', 'aow_workflow', 
            'aow_processed', 'aow_conditions', 'jjwg_maps', 'jjwg_markers', 'jjwg_areas', 
            'jjwg_address_cache', 'calls_reschedule', 'securitygroups', 'outbound_email', 
            'external_oauth_connections', 'external_oauth_providers', 'templatesectionline', 
            'oauth2tokens', 'oauth2clients', 'surveyresponses', 'surveys', 
            'surveyquestionresponses', 'surveyquestions', 'surveyquestionoptions'
        ];
    
        // Get all the available modules in SuiteCRM
        global $beanList;
        foreach ($beanList as $moduleName => $beanName) {
            if (!class_exists($beanName)) {
                continue; // Skip modules without valid beans
            }
    
            // Load the bean
            $bean = BeanFactory::newBean($moduleName);
            if (!$bean) {
                continue; // Skip if the bean can't be initialized
            }
    
            $tableName = $bean->table_name;
    
            // Skip the module if its table name is in the excluded list or if the table name is empty
            if (empty($tableName) || in_array($tableName, $excludedModules)) {
                continue;
            }
    
            // Retrieve the module fields
            $fields = [];
            foreach ($bean->field_defs as $fieldName => $fieldDef) {
                if (!empty($fieldName)) {
                    $fields[] = $fieldName;
                }
            }
    
            // Skip modules with no fields defined
            if (empty($fields)) {
                continue;
            }
    
            // Add module and fields to the data array
            $data[] = [
                'moduleName' => $tableName,
                'fields' => $fields,
            ];
        }
    
        echo json_encode($data);
        exit;
    }


    public function action_reset_charts() {
        $GLOBALS['log']->fatal("In action_reset_charts");
        ob_clean();
        $data = $_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $bean->data_query = "";
        $bean->filter_data = "";
        $bean->save();
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;
    }


    public function action_getFieldType() {
        $GLOBALS['log']->fatal("In action_getFieldType");
        $data = $_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data, 1));

        $reportbean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $dbType = getfieldType($reportbean->module_name, $data['filterField']);
        $GLOBALS['log']->fatal("In dbType: ".print_r($dbType, 1));

        $result = json_encode(["success" => true, "fieldType" => $dbType]);
        echo $result;;
        exit();
    }


    public function action_getAllModulesWithLabels() {
        //$GLOBALS['log']->fatal("API Hit: In action_getAllModulesWithLabels 6754 bzbzbz");
        $modules = getAllModulesWithLabels();
        $finalModules = [];

        foreach ($modules as $name => $label) {
            $finalModules[] = ['name' => (string)$name, 'label' => (string)$label];
        }
        
        //$GLOBALS['log']->fatal("In 6754 modules: " . print_r($finalModules, 1));
        echo json_encode($finalModules);
        exit();
    }


    public function action_getModuleFieldsAndLabels() {
        //$GLOBALS['log']->fatal("In action_getModuleFieldsAndLabels blblbl");
        $moduleName = $_GET['module_name'];
        $fields = getModuleFieldsAndLabels($moduleName);

        $finalFields = [];

        foreach ($fields as $label => $name) {
            $finalFields[] = ['name' => (string)$name, 'label' => (string)$label];
        }

        //$GLOBALS['log']->fatal("In blblbl out: " . print_r($finalFields, 1));
        echo json_encode($finalFields);
        exit();
    }
}