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
class pd_reportsController extends SugarController
{


    public function action_generateReports(){

        $GLOBALS['log']->fatal("In Generate Reports");
        ob_clean();
        $data =$_POST;
        $GLOBALS['log']->fatal("In data: ".print_r($data,1));
        $bean = BeanFactory::getBean($data['moduleName'],$data['moduleId']);
        $module = $bean->module_name; // Module name
        $bean->name = $data['graphName'];
        $xAxisField = $data['x-axis']; // Field to group by
        $xAxisAggregate = $data['x-axis-aggregate']; // Not processed for grouping
        $yAxisField = $data['y-axis']; // Field to count
        $yAxisAggregate = $data['y-axis-aggregate']; // Aggregate option
        $title = $bean->name;

        $result = generateReport($module, $xAxisField, $xAxisAggregate, $yAxisField, $yAxisAggregate, $title);
        $GLOBALS['log']->fatal("generateReport function output: " . print_r($result,1));

        if(!empty($result)){
            $bean->x_axis_field = $xAxisField;
            $bean->y_axis_field = $yAxisField;
            $bean->x_axis_aggregate = $xAxisAggregate;
            $bean->y_axis_aggregate = $yAxisAggregate;
            $bean->chart_data = $result;
            $bean->save();
        }
        // echo $result;
        $response['success'] = true;
        echo json_encode($response);
        exit;

    }

    public function action_changeReportType(){

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
    
}