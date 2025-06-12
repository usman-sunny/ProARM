<?php

$GLOBALS['log']->fatal('GetCustomNotes.php called');

if (!defined('sugarEntry') || !sugarEntry) {
    die('Not A Valid Entry Point');
}

global $db;

$query = "SELECT id, name, description, label_c, date_entered 
          FROM notes 
          WHERE deleted = 0 
          AND parent_type IS NULL 
          AND filename IS NULL
          ORDER BY date_entered DESC 
          LIMIT 5";

$result = $db->query($query);

$GLOBALS['log']->fatal('GetCustomNotes.php called result:' . print_r($result, true));

$notes = [];
while ($row = $db->fetchByAssoc($result)) {
    $GLOBALS['log']->fatal('GetCustomNotes.php called row: ' . print_r($row, true));
    $row['label_c'] = decodeMultiEnum($row['label_c']); // Decode label_c
    $notes[] = $row;
}

$GLOBALS['log']->fatal('notes[]: ' . print_r($notes, true));

header('Content-Type: application/json');
echo json_encode($notes);
exit;

function decodeMultiEnum(string $multiEnum): array {
    if (empty($multiEnum)) {
        return [$multiEnum];
    }
    $items = explode(',', $multiEnum);
    return array_map(function($item) {
        return trim($item, '^');
    }, $items);
}