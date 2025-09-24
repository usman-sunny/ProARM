<?php

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

require_once 'modules/ModuleBuilder/MB/ModuleBuilder.php';

$module_label = $_REQUEST['module_label'];

if (empty($module_label)) {
    echo json_encode(['error' => 'Module name is required']);
    exit;
}

//$GLOBALS['log']->fatal('lalala module_label: ' . $module_label);

try {
    $moduleBuilder = new ModuleBuilder();
    $packages = $moduleBuilder->getPackageList();

    //$GLOBALS['log']->fatal('lalala 6754v packages: ' . print_r($packages, true));

    $packageKey = false;
    
    foreach ($packages as $packageName) {
        $package = $moduleBuilder->getPackage($packageName);

        $GLOBALS['log']->fatal('lalala 6754v package: ' . print_r($package, true));

        foreach ($package->modules as $moduleKey => $module) {
            $label = $module->config['label'];
            //echo "Module: $moduleKey, Label: $label\n";

            if ($label == $module_label) {
                $packageKey = $package->key;
                break;
            }
        }
    }

    //$GLOBALS['log']->fatal('lalala 6754v packageKey: ' . $packageKey);
    
    if ($packageKey) {
        echo json_encode(['package_key' => $packageKey]);
    } else {
        echo json_encode(['package_key' => null, 'message' => 'Module not found in any package']);
    }
    
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to get package key: ' . $e->getMessage()]);
}

