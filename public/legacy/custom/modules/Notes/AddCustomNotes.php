<?php

$GLOBALS['log']->fatal('Called AddCustomNotes.php');


// Check if data is received via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = file_get_contents('php://input'); // Get raw POST data
    $decodedData = json_decode($data, true); // Decode JSON data

    // Log the received data
    $GLOBALS['log']->fatal('Received data for create/update: ' . print_r($decodedData, true));

    if (isset($decodedData['ID']) && $decodedData['ID'] !== '') {
        // complete update logic
        $notes = BeanFactory::getBean('Notes', $decodedData['ID']); // Retrieve the existing Notes bean by ID
        if ($notes) {
            $notes->name = $decodedData['title']; // Update the name of the note
            $notes->description = $decodedData['description']; // Update the description
            $notes->label_c = encodeToMultiEnum($decodedData['labels']); // Update the custom field 'label_c'
            $notes->save(); // Save the updated note
        } else {
            // Handle case where note with given ID does not exist
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Note not found']);
            exit;
        } 
    } else {
        $notes = BeanFactory::newBean('Notes'); // Create a new Notes bean
        $notes->name = $decodedData['title']; // Set the name of the note
        $notes->description = $decodedData['description']; // Set the description
        $notes->label_c = encodeToMultiEnum($decodedData['labels']); // Set the custom field 'label_c'
        $notes->save(); // Save the note
    }

    // Respond back to Angular
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Data received successfully']);
} else {
    // Handle other request methods or errors
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}


function encodeToMultiEnum(array $values): string {
    // Wrap each value with carets
    $GLOBALS['log']->fatal('Encoding values: ' . print_r($values, true));
    $wrapped = array_map(function($val) {
        return '^' . $val . '^';
    }, $values);

    // Join all with commas
    return implode(',', $wrapped);
}

function decodeMultiEnum(string $multiEnum): array {
    $items = explode(',', $multiEnum);
    return array_map(function($item) {
        return trim($item, '^');
    }, $items);
}
