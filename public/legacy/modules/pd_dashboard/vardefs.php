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

$dictionary['pd_dashboard'] = array(
    'table' => 'pd_dashboard',
    'audited' => true,
    'inline_edit' => true,
    'duplicate_merge' => true,

    'fields' => array (

        'layout_data' => array(
            'name' => 'layout_data',
            'vname' => 'LBL_DASHBOARD_LAYOUT',
            'type' => 'text',
            'dbType' => 'longtext', // Allows storing large amounts of data
            'audited' => true,
            'required' => false,
            'reportable' => false,
            'comment' => 'Stores the JSON layout of the dashboard',
        ),

        'filter_data' => array(
            'inline_edit' => '0',
            'labelValue' => 'Filter Data',
            'required' => false,
            'name' => 'filter_data',
            'vname' => 'LBL_FILTER_DATA',
            'type' => 'text',
            'dbType' => 'longtext', // Allows storing large amounts of data
            'audited' => true,
            'required' => false,
            'reportable' => false,
            'comment' => 'Stores the Query of the reports',
        ),

        // One-to-Many relation between pd_dashboard and pd_reports - this (pd_dashboard) is the one side
        'dashboard_reports' => array(
            'name' => 'dashboard_reports',
            'type' => 'link',
            'relationship' => 'dashboard_reports',
            'module' => 'pd_reports',
            'bean_name' => 'pd_reports',
            'source' => 'non-db',
            'vname' => 'LBL_DASHBOARD_REPORTS',
        ),

        // start: One-to-Many relation between pd_collections and pd_dashboard - this (pd_dashboard) is the many side
        'collection_dashboards' => array(
            'name' => 'collection_dashboards',
            'type' => 'link',
            'relationship' => 'collection_dashboards',
            'module' => 'pd_collections',
            'bean_name' => 'pd_collections',
            'source' => 'non-db',
            'vname' => 'LBL_COLLECTION_DASHBOARDS',
        ),

        'collection_dashboards_relate' => array(
            'name'=>'collection_dashboards_relate',
            'type'=>'relate',
            'module'=>'pd_collections',
            'table'=>'pd_collections',
            'source' => 'non-db',
            'vname'=>'LBL_COLLECTION_DASHBOARDS_RELATE',
            'rname'=>'name',
            'id_name'=>'collection_id',
            'link'=>'collection_dashboards',
            'isnull'=>'true',
            'importable' => 'required',
            'required'=>false,
            'inline_edit'=>0,
        ),

        'collection_id' => array(
            'name'=>'collection_id',
            'type'=>'id',
            'module' => 'pd_collections',
            'table' => 'pd_collections',
            'vname'=>'LBL_COLLECTION_ID',
            'isnull' => 'true',
            'dbType' => 'id',
            'reportable' => false,
            'massupdate' => false,
            'duplicate_merge' => 'disabled',
        ), // end: One-to-Many relation between pd_collections and pd_dashboard - this (pd_dashboard) is the many side
    ),

    'relationships' => array (

        // One-to-Many relation between pd_dashboard and pd_reports
        'dashboard_reports' => array(
            'lhs_module' => 'pd_dashboard',
            'lhs_table' => 'pd_dashboard',
            'lhs_key' => 'id',
            'rhs_module' => 'pd_reports',
            'rhs_table' => 'pd_reports',
            'rhs_key' => 'dashboard_id',
            'relationship_type' => 'one-to-many',
        ),

        // One-to-Many relation between pd_collections and pd_dashboard
        'collection_dashboards' => array(
            'lhs_module' => 'pd_collections',
            'lhs_table' => 'pd_collections',
            'lhs_key' => 'id',
            'rhs_module' => 'pd_dashboard',
            'rhs_table' => 'pd_dashboard',
            'rhs_key' => 'collection_id',
            'relationship_type' => 'one-to-many',
        ),
    ),

    'optimistic_locking' => true,
    'unified_search' => true,
);
if (!class_exists('VardefManager')) {
        require_once('include/SugarObjects/VardefManager.php');
}
VardefManager::createVardef('pd_dashboard', 'pd_dashboard', array('basic','assignable','security_groups'));
