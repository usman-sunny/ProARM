<?php

$GLOBALS['log']->fatal('readNotifications.php called');

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}


#if (isset($_GET['userId'])) {
if ($_SERVER['REQUEST_METHOD'] === 'GET'){
    #$userId = $_GET['userId'];
    #$GLOBALS['log']->fatal('User ID received: ' . $userId);

    $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 1;
    $offset = $offset * 2;
    $GLOBALS['log']->fatal('Offset number received: ' . $offset);

    global $current_user;
    $userId = $current_user->id;
    $GLOBALS['log']->fatal('Current user ID from session bbzz: ' . $userId);

    global $db;

    $userIdSafe = $db->quote($userId);

    $query = "SELECT id, name, description, date_entered 
              FROM alerts 
              WHERE deleted = 0 
              AND assigned_user_id = $userIdSafe
              ORDER BY date_entered DESC 
              LIMIT $offset";
    
    $result = $db->query($query);

    $notifications = [];
    while ($row = $db->fetchByAssoc($result)) {
        $notifications[] = $row;
    }

    $GLOBALS['log']->fatal('notifications[]: ' . print_r($notifications, true));
    
    header('Content-Type: application/json');
    echo json_encode($notifications);
    exit;

} else {
    $GLOBALS['log']->fatal('No userId provided in request');
}