<?php

$GLOBALS['log']->fatal('readMenuFilters.php called');

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

include 'custom/include/tabConfig.php';
include 'include/portability/module_name_map.php';
require_once("modules/MySettings/TabController.php");

$controller = new TabController();
$tabs = $controller->get_tabs_system();
$excludedModules = array_keys($tabs[1]);

//$GLOBALS['log']->fatal('Tabs: ' . print_r($tabs, true));
//$GLOBALS['log']->fatal("txt: " . print_r($GLOBALS['tabStructure'], true));

header('Content-Type: application/json');

$response = [];

foreach ($GLOBALS['tabStructure'] as $groupLabel => $groupData) {
    $modules = [];

    foreach ($groupData['modules'] as $moduleName) {
        if (in_array($moduleName, $excludedModules)) {
            continue; // skip this module
        }

        $routeName = $module_name_map[$moduleName]['frontend'] ?? null;
        if (!$routeName) {
            $modules[] = [
                'link' => [
                    'label' => $GLOBALS['app_list_strings']['moduleList'][$moduleName],
                    'route' => '/' . $moduleName,
                ]
            ];
        } else {
            $modules[] = [
                'link' => [
                    'label' => $GLOBALS['app_list_strings']['moduleList'][$moduleName],
                    'route' => '/' . $routeName,
                ]
            ];
        }
    }

    $response[] = [
        'icon' => $groupData['icon'],
        'link' => [
            'label' =>  $groupData['label'],
            'labelValue' =>  $GLOBALS['app_strings'][$groupData['label']],
        ],
        'submenu' => $modules,
    ];
}

// $moduleNameP = $GLOBALS['app_list_strings']['moduleList']['Prospects'];
// $GLOBALS['log']->fatal("Module name for Prospects: " . $moduleNameP);

// $moduleNameQ = $GLOBALS['app_strings']['LBL_GROUPTAB6_1747235846'];
// $GLOBALS['log']->fatal("Module name for GroupTab6: " . $moduleNameQ);

// $moduleNamepl = $module_name_map['AOS_Product_Categories']['frontend'];
// $GLOBALS['log']->fatal("Module name for AOS_Product_Categories: " . $moduleNamepl);

echo json_encode($response);