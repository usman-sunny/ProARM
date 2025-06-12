<?php

$GLOBALS['log']->fatal('DeleteCustomNotes.php called');

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

// Check if data is received via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input'); // Get raw POST data
    $decodedData = json_decode($data, true); // Decode JSON data

    // Log the received data
    $GLOBALS['log']->fatal('Received delete id data in php: ' . print_r($decodedData, true));

    $notes = BeanFactory::newBean('Notes'); // Create a new Notes bean
    $notes->mark_deleted($decodedData['ID']);
    $notes->save(); // Save the note

    // Respond back to Angular
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Note deleted successfully']);
} else {
    // Handle other request methods or errors
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}