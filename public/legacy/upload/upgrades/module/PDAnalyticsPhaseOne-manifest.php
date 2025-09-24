<?php
$manifest = array(
    'key' => 'MyCustomModulesPackage',
    'name' => 'Analytics Modules Package',
    'description' => 'A package containing custom modules and customizations.',
    'author' => 'Your Name',
    'version' => '1.0',
    'is_uninstallable' => true,
    'published_date' => '2024-12-10',
    'type' => 'module',
    'acceptable_sugar_versions' => array(
       array (
	      0 => '6.5.25',
	    ),
    ),
);

$installdefs = array(
    'id' => 'MyCustomModulesPackage',
    'copy' => array(
        array(
            'from' => '<basepath>/modules/pd_analytics',
            'to' => 'modules/pd_analytics',
        ),
        array(
            'from' => '<basepath>/modules/pd_collections',
            'to' => 'modules/pd_collections',
        ),
        array(
            'from' => '<basepath>/modules/pd_dashboard',
            'to' => 'modules/pd_dashboard',
        ),
        array(
            'from' => '<basepath>/modules/pd_reports',
            'to' => 'modules/pd_reports',
        ),
        array(
            'from' => '<basepath>/modules/pd_users_preferences',
            'to' => 'modules/pd_users_preferences',
        ),
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/Include/Prodata_Analytics_pkg.php',
            'to' => 'custom/Extension/application/Ext/Include/Prodata_Analytics_pkg.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/Include/Prodata_User_Prefernces_pkg.php',
            'to' => 'custom/Extension/application/Ext/Include/Prodata_User_Prefernces_pkg.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/Language/en_us.Prodata_Analytics_pkg.php',
            'to' => 'custom/Extension/application/Ext/Language/en_us.Prodata_Analytics_pkg.php',
        ),
        array(
            'from' => '<basepath>/custom/Extension/application/Ext/Language/en_us.Prodata_User_Prefernces_pkg.php',
            'to' => 'custom/Extension/application/Ext/Language/en_us.Prodata_User_Prefernces_pkg.php',
        ),
    ),
    'post_execute' => array (
    	0 => '<basepath>/scripts/post_execute.php',
    ),
);
?>

