<?php

function getCollectionData($module,$collectionID,$CollectionData){
    global $db;
    if($collectionID == 'create_dashboard'){
        $getDataQuery = "SELECT * FROM $module WHERE deleted = 0";
    }else{
        $getDataQuery = "SELECT * FROM $module WHERE deleted = 0 AND collection_id = " . $db->quoted($collectionID);
    }
    $sqlResult = $db->query($getDataQuery);
    
    while($collectionData_row = $db->fetchByAssoc($sqlResult)){
        $collectionData_row['module'] = $module;
        $CollectionData[] = $collectionData_row;
    }

    return $CollectionData;
}

function getReportsData($module,$dashboardID){
    global $db;

    $getreportsDataQuery = "SELECT * FROM $module WHERE deleted = 0 AND dashboard_id = " . $db->quoted($dashboardID);
    $reportsDatasqlResult = $db->query($getreportsDataQuery);
    $reportsData = array();
    while($reportsData_row = $db->fetchByAssoc($reportsDatasqlResult)){
        $reportsData_row['chart_data'] = html_entity_decode($reportsData_row['chart_data']);
        $reportsData[] = $reportsData_row;
    }

    return $reportsData;
}


/** 
 * this function is used to 
 * get all the fields and labels
 * for a given module
 * 
 * */ 
function getModuleFieldsAndLabels($moduleName) {
    // Initialize the module bean
    $bean = BeanFactory::getBean($moduleName);

    if (!$bean) {
        return ["error" => "Module not found."];
    }

    // Ensure the table exists in the database
    if (empty($bean->table_name) || !$bean->db->tableExists($bean->table_name)) {
        return ["error" => "Module table not found in the database."];
    }

    // Get all fields in the database table
    $dbFields = $bean->db->get_columns($bean->table_name);

    // Get field definitions (standard + custom fields)
    $fieldDefs = $bean->field_defs;

    // Build an array with label => fieldname structure
    $fieldsAndLabels = [];
    foreach ($fieldDefs as $fieldName => $fieldDef) {
        // Include only fields that are present in the database
        if (array_key_exists($fieldName, $dbFields)) {
            // Get the translated label
            $label = isset($fieldDef['vname']) ? translate($fieldDef['vname'], $moduleName) : $fieldName;

            // Add label and field name to the array
            $fieldsAndLabels[$label] = $fieldName;
        }
    }

    return $fieldsAndLabels;
}


function generateReportQuery($module, $xAxisField, $xAxisAggregate, $yAxisField, $yAxisAggregate, $title = "Sales Report", $whereFilters = "") {
    global $db, $log; // Assuming SuiteCRM DB connection and logging are initialized

    // Log the start of the function execution
    $log->fatal("generateReport function started for module: $module, xAxisField: $xAxisField, yAxisField: $yAxisField");
    $module = strtolower($module);

    // Validate inputs
    if (empty($module) || empty($xAxisField) || empty($yAxisField)) {
        $log->error("Invalid inputs: Module, x-axis, and y-axis are required.");
        return json_encode(["error" => "Invalid inputs. Module, x-axis, and y-axis are required."]);
    }

    // Format x-axis field for date fields without time
    $dateFields = ['date_entered', 'date_modified', 'start_date', 'end_date'];
    if (strtolower($xAxisAggregate) === 'actual' && in_array(strtolower($xAxisField), $dateFields)) {
        $xAxisField = "DATE(`$xAxisField`)";
    }
    //$log->fatal("Generated SQL Query1: $query");

    // Initialize query parts for x-axis
    $xAggregate = match (strtolower($xAxisAggregate)) {
        'sum' => "SUM($xAxisField) AS x_value",
        'count' => "COUNT($xAxisField) AS x_value",
        'average' => "AVG($xAxisField) AS x_value",
        'actual' => "$xAxisField AS x_value",
        default => "$xAxisField AS x_value"
    };
    //$log->fatal("Generated SQL Query2: $query");

    // Initialize query parts for y-axis
    $yAggregate = match (strtolower($yAxisAggregate)) {
        'sum' => "SUM(`$yAxisField`) AS y_value",
        'count' => "COUNT(`$yAxisField`) AS y_value",
        'average' => "AVG(`$yAxisField`) AS y_value",
        'actual' => "GROUP_CONCAT(DISTINCT `{$yAxisField}` SEPARATOR ', ') AS y_value",
        default => "`$yAxisField` AS y_value"
    };

    // Build the base query
    $query = "
        SELECT $xAggregate, $yAggregate
        FROM `$module`
        WHERE $xAxisField IS NOT NULL AND `$yAxisField` IS NOT NULL
    ";
    $log->fatal("Generated SQL Query3: $query");

    if(!empty($whereFilters)){
        $query .= " AND $whereFilters";
        $log->fatal("Generated SQL Query4 after filters: $query");
    }

    // Grouping and ordering logic
    $query .= " GROUP BY $xAxisField ORDER BY $xAxisField ASC";

    // Log the constructed query
    $log->fatal("Generated SQL Query: $query");
    return $query;
}


function getCollections() {
    global $db;
    $getCollQuery = "SELECT id,name FROM pd_collections Where deleted = 0;";
    $sqlResult = $db->query($getCollQuery);
    $collection_dropdown = array();
    while($collection_row = $db->fetchByAssoc($sqlResult)){
        $collection_dropdown[$collection_row['id']] = $collection_row['name'];
    }
    return $collection_dropdown;
}


/** 
 * this function is used to 
 * get all the modules with labels
 * 
 * */ 
function getAllModulesWithLabels() {
    global $app_list_strings, $beanList;

    $excludedModules = [
        "TemplateSectionLine",
        "Calls_Reschedule",
        "Emails",
        "EAPM",
        "Currencies",
        "Bugs",
        "Schedulers",
        "Project",
        "ProjectTask",
        "Campaigns",
        "CampaignLog",
        "Documents",
        "DocumentRevisions",
        "Connectors",
        "Roles",
        "Administration",
        "ACLRoles",
        "InboundEmail",
        "Releases",
        "Prospects",
        "EmailMarketing",
        "EmailTemplates",
        "ProspectLists",
        "SavedSearch",
        "Trackers",
        "SugarFeed",
        "OAuthKeys",
        "OAuthTokens",
        "OAuth2Clients",
        "OAuth2Tokens",
        "EmailAddresses",
        "AOK_KnowledgeBase",
        "AOK_Knowledge_Base_Categories",
        "FP_events",
        "FP_Event_Locations",
        "AOP_Case_Events",
        "AOP_Case_Updates",
        "AOR_Reports",
        "AOR_Conditions",
        "AOR_Charts",
        "AOR_Fields",
        "AOR_Scheduled_Reports",
        "AOS_Contracts",
        "AOS_Invoices",
        "AOS_PDF_Templates",
        "AOS_Product_Categories",
        "AOS_Products",
        "AOS_Products_Quotes",
        "AOS_Line_Item_Groups",
        "AOS_Quotes",
        "AOW_WorkFlow",
        "AOW_Conditions",
        "AOW_Processed",
        "AOW_Actions",
        "AM_ProjectTemplates",
        "AM_TaskTemplates",
        "jjwg_Maps",
        "jjwg_Markers",
        "jjwg_Areas",
        "jjwg_Address_Cache",
        "SecurityGroups",
        "OutboundEmailAccounts",
        "ExternalOAuthConnection",
        "ExternalOAuthProvider",
        "AOBH_BusinessHours",
        "SurveyResponses",
        "Surveys",
        "SurveyQuestionResponses",
        "SurveyQuestions",
        "SurveyQuestionOptions"
    ];

    $moduleNames = [];

    if (!empty($app_list_strings['moduleList'])) {
        foreach ($app_list_strings['moduleList'] as $moduleKey => $moduleLabel) {
            // Check if module is active and not in the excluded list
            if (isset($beanList[$moduleKey]) && !in_array($moduleKey, $excludedModules)) {
                $moduleNames[$moduleKey] = $moduleLabel;
            }
        }
    }

    return $moduleNames;
}


function getChartData($sqlQuery) {
    global $db, $log; // Assuming SuiteCRM DB connection and logging are initialized

    $log->fatal("getChartData SQL Query: $sqlQuery");

    // Execute the query
    $result = $db->query($sqlQuery);
    if (!$result) {
        $errorMessage = $db->lastError();
        $log->fatal("Error executing query: $errorMessage");
        return json_encode(["error" => "Error executing query: " . $errorMessage]);
    }

    // Process query results
    $xAxis = [];
    $series = [];
    while ($row = $db->fetchByAssoc($result)) {
        $xAxis[] = $row['x_value'];
        $series[] = is_numeric($row['y_value']) ? (float)$row['y_value'] : $row['y_value'];
    }

    // Log the processed results
    $log->fatal("Processed Results - xAxis: " . json_encode($xAxis) . ", series: " . json_encode($series));

    // Final output structure
    $output = [
        "title" => $title,
        "xAxis" => $xAxis,
        "series" => $series
    ];

    // Log and return the output
    $log->fatal("generateReport function output: " . json_encode($output, JSON_PRETTY_PRINT));
    return json_encode($output);
}


function applyFilters($baseQuery, $filters) {
    global $db, $log;
    $filters = json_decode(json_encode($filters), true);
    $log->fatal("applyFilters baseQuery: $baseQuery");
    $log->fatal("applyFilters filters: " . print_r($filters, 1));

    if (empty($filters)) {
        return $baseQuery; // No filters to apply
    }

    $conditions = [];
    $logicalOperators = [];

    // Helper function to normalize date
    $normalizeDate = function ($date) {
        $formats = ['d/m/Y', 'm-d-Y', 'Y-m-d']; // Supported date formats
        foreach ($formats as $format) {
            $dateTime = DateTime::createFromFormat($format, $date);
            if ($dateTime) {
                return $dateTime->format('Y-m-d'); // Normalize to ISO 8601
            }
        }
        return false; // Invalid date format
    };

    // Process 'fields' filter
    // Process multiple 'fields' filters
    if (!empty($filters['fields']) && is_array($filters['fields'])) {
        foreach ($filters['fields'] as $fieldFilter) {
            if (!empty($fieldFilter['field']) && isset($fieldFilter['operator'], $fieldFilter['value'])) {
                $field = $db->quoteIdentifier($fieldFilter['field']);
                $operator = $fieldFilter['operator']; // Assume validated
                $value = $db->quote($fieldFilter['value']);
                $conditions[] = "$field $operator '$value'";

                if (!empty($fieldFilter['logicalOperator'])) {
                    $logicalOperators[] = strtoupper($fieldFilter['logicalOperator']);
                }
            }
        }
    }

    // Process 'date_range' filter
    if (isset($filters['date_range']['start'], $filters['date_range']['end'])) {
        $startDate = $normalizeDate($filters['date_range']['start']);
        $endDate = $normalizeDate($filters['date_range']['end']);

        if ($startDate && $endDate) {
            // Extend the end date to include the entire day if it is today's date
            $currentDate = date('Y-m-d');
            if ($endDate === $currentDate) {
                $endDate .= ' 23:59:59'; // Include records up to the end of today
            }

            $conditions[] = "`date_entered` BETWEEN '$startDate' AND '$endDate'";
            $logicalOperators[] = strtoupper($filters['date_range']['logicalOperator'] ?? "AND");
            } else {
            return "Invalid date format in 'date_range' filter."; // Return error for invalid dates
        }
    }

    // Process 'origin' filter
    if (!empty($filters['origin']['origin_field']) && !empty($filters['origin']['origin_value'])) {
        $originField = $db->quoteIdentifier($filters['origin']['origin_field']);
        $originValue = $db->quote($filters['origin']['origin_value']);
        $conditions[] = "$originField = $originValue";
    }

    // Process 'timeframe' filter
    if (!empty($filters['timeframe']['value'])) {
        $currentDate = date('Y-m-d H:i:s'); // Include current time for accurate filtering
        $startDate = "";
        $endDate = $currentDate;

        switch ($filters['timeframe']['value']) {
            case 'All Time':
                // No date conditions
                break;
            case 'Last 7 Days':
                $startDate = date('Y-m-d', strtotime('-6 days')); // Start from 6 days ago to include today
                break;
            case 'Last 28 Days':
                $startDate = date('Y-m-d', strtotime('-27 days')); // Start from 27 days ago to include today
                break;
            case 'This Month':
                $startDate = date('Y-m-01'); // First day of the current month
                break;
            case 'This Year':
                $startDate = date('Y-01-01'); // First day of the current year
                break;
            case 'Last Month':
                $startDate = date('Y-m-01', strtotime('first day of last month'));
                $endDate = date('Y-m-t 23:59:59', strtotime('last day of last month')); // End of the last month's last day
                break;
            case 'Last Year':
                $startDate = date('Y-01-01', strtotime('first day of January last year'));
                $endDate = date('Y-12-31 23:59:59', strtotime('last day of December last year')); // End of the last year's last day
                break;
        }

        if ($startDate) {
            $conditions[] = "date_entered BETWEEN '$startDate' AND '$endDate'";
            $logicalOperators[] = strtoupper($filters['timeframe']['logicalOperator'] ?? "AND");
        }
    }

    // Process 'user specific' filter
    if (!empty($filters['user']['user_field']) && !empty($filters['user']['user_value'])) {
        $userField = $db->quoteIdentifier($filters['user']['user_field']);
        $userValues = $filters['user']['user_value'];

        if (is_array($userValues)) {
            // Quote each user value for SQL
            $quotedUserValues = array_map(function ($value) use ($db) {
                return "'" . $db->quote($value) . "'"; // Always quote values
            }, $userValues);

            // Construct the IN clause
            $conditions[] = "$userField IN (" . implode(',', $quotedUserValues) . ")";
        } else {
            // Single user value
            $conditions[] = "$userField = '" . $db->quote($userValues) . "'";
        }

        $logicalOperators[] = strtoupper($filters['user']['logicalOperator'] ?? "AND");
    }

    // Add conditions to the WHERE clause
    $log->fatal("applyFilters conditions: " . print_r($conditions, 1));
    $log->fatal("applyFilters logicalOperators: " . print_r($logicalOperators, 1));
    // Combine conditions using logical operators
    $combinedConditions = $conditions[0];
    for ($i = 1; $i < count($conditions); $i++) {
        $combinedConditions .= " {$logicalOperators[$i-1]} {$conditions[$i]}";
    }

    // Add combined conditions to the query
    if (!empty($combinedConditions)) {
        if (strpos($baseQuery, 'WHERE') !== false || strpos($baseQuery, 'Where') !== false || strpos($baseQuery, 'where') !== false) {
            $baseQuery = preg_replace('/WHERE/i', 'WHERE ' . $combinedConditions . ' AND', $baseQuery);
        } else {
            $baseQuery = preg_replace('/GROUP BY|ORDER BY/i', 'WHERE ' . $combinedConditions . ' $0', $baseQuery, 1);
        }
    }

    // Ensure only one GROUP BY and ORDER BY clause is appended
    if (!empty($groupByClause) && strpos($baseQuery, 'GROUP BY') === false) {
        $log->fatal("groupByClause groupByClause: " . print_r($groupByClause, 1));

        $baseQuery .= " $groupByClause";
    }

    if (!empty($orderByClause) && strpos($baseQuery, 'ORDER BY') === false) {
        $log->fatal("orderByClause orderByClause: " . print_r($orderByClause, 1));

        $baseQuery .= " $orderByClause";
    }

    return $baseQuery;
}


function getUsers() {
    global $db;
    $getUserQuery = "SELECT id,user_name FROM users Where deleted = 0;";
    $sqlResult = $db->query($getUserQuery);
    $user_dropdown = array();
    while($user_row = $db->fetchByAssoc($sqlResult)){
        $user_dropdown[$user_row['id']] = $user_row['user_name'];
    }
    return $user_dropdown;
}


function generateTable($sql) {
    global $db;
    
    if (empty($sql)) {
        return json_encode(["success" => false, "error" => "SQL query cannot be empty."]);
    }

    // Prevent dangerous queries (only SELECT allowed)
    if (!preg_match('/^\s*SELECT\s+/i', $sql)) {
        return json_encode(["success" => false, "error" => "Only SELECT queries are allowed."]);
    }

    // Execute query using SuiteCRM DB connection
    $result = $db->query($sql);

    if (!$result) {
        return json_encode(["success" => false, "error" => "Query execution failed: " . $db->lastError()]);
    }

    // Fetch column headers dynamically
    $headers = [];
    $fields = mysqli_fetch_fields($result);
    foreach ($fields as $field) {
        $headers[] = $field->name;
    }

    // Fetch row data
    $data = [];
    while ($row = $db->fetchByAssoc($result)) {
        $data[] = array_values($row);
    }
    $GLOBALS['log']->fatal("Headers:".print_r($headers,1));
    $GLOBALS['log']->fatal("data:".print_r($data,1));

    // Return JSON response
    return json_encode(["success" => true, "headers" => $headers, "data" => $data]);
}


function applyReportFilters($baseQuery, $filters) {
    global $db, $log;

    $filters = json_decode(json_encode($filters), true); // Normalize filters
    $log->fatal("applyFilters baseQuery: $baseQuery");
    $log->fatal("applyFilters filters: " . print_r($filters, 1));

    if (empty($filters)) {
        return $baseQuery; // No filters to apply
    }

    $groupConditions = []; // Store conditions for each group
    

    // Helper function to normalize date
    $normalizeDate = function ($date) {
        $formats = ['d/m/Y', 'm-d-Y', 'Y-m-d']; // Supported date formats
        foreach ($formats as $format) {
            $dateTime = DateTime::createFromFormat($format, $date);
            if ($dateTime) {
                return $dateTime->format('Y-m-d'); // Normalize to ISO 8601
            }
        }
        return false; // Invalid date format
    };

    foreach ($filters as $groupIndex => $group) {
        $groupFilters = $group['filters'] ?? [];
        $groupLogicalOperator = strtoupper($group['grouplogicalOperator'] ?? 'AND'); // Group logical operator
        $conditions = []; // Store conditions within the group

        foreach ($groupFilters as $filterIndex => $filter) {
            $log->fatal("applyFilters field: " . print_r($filter['field'], 1));
            $log->fatal("applyFilters value: " . print_r($filter['value'], 1));
            $log->fatal("applyFilters fieldlogicalOperator: " . print_r($filter['fieldlogicalOperator'], 1));

            $fieldLogicalOperator = strtoupper($filter['fieldlogicalOperator'] ?? 'AND'); // Field logical operator

            if ($filter['field'] === 'date_range' && isset($filter['value']['start'], $filter['value']['end'])) {
                // Handle date range filter
                $startDate = $normalizeDate($filter['value']['start']);
                $endDate = $normalizeDate($filter['value']['end']);

                $currentDate = date('Y-m-d');
                if ($endDate === $currentDate) {
                    $endDate .= ' 23:59:59'; // Include records up to the end of today
                }

                $conditions[] = "`date_entered` BETWEEN '$startDate' AND '$endDate'";

            } elseif ($filter['field'] === 'timeframe') {
                // Handle timeframe filter
                $currentDate = date('Y-m-d H:i:s');
                $startDate = "";
                $endDate = $currentDate;

                switch ($filter['value']) {
                    case 'All Time':
                        break; // No condition
                    case 'Last 7 Days':
                        $startDate = date('Y-m-d', strtotime('-6 days'));
                        break;
                    case 'Last 28 Days':
                        $startDate = date('Y-m-d', strtotime('-27 days'));
                        break;
                    case 'This Month':
                        $startDate = date('Y-m-01');
                        break;
                    case 'This Year':
                        $startDate = date('Y-01-01');
                        break;
                    case 'Last Month':
                        $startDate = date('Y-m-01', strtotime('first day of last month'));
                        $endDate = date('Y-m-t 23:59:59', strtotime('last day of last month'));
                        break;
                    case 'Last Year':
                        $startDate = date('Y-01-01', strtotime('first day of January last year'));
                        $endDate = date('Y-12-31 23:59:59', strtotime('last day of December last year'));
                        break;
                }

                if ($startDate) {
                    $conditions[] = "`date_entered` BETWEEN '$startDate' AND '$endDate'";
                }

            } elseif ($filter['field'] === 'user') {
                // Handle user filter
                $userField = $db->quoteIdentifier('assigned_user_id');
                $userValues = is_array($filter['value']) ? $filter['value'] : [$filter['value']];
                $quotedUserValues = array_map(function ($value) use ($db) {
                    return "'" . $db->quote($value) . "'";
                }, $userValues);
                $conditions[] = "$userField IN (" . implode(',', $quotedUserValues) . ")";
                
            } else {
                // Generic field filters
                $field = $db->quoteIdentifier($filter['field']);
                $operator = $filter['operator'];
                $value = $filter['value']; // Unquoted initially for handling special cases
                
                switch ($operator) {
                    case 'equals':
                        $conditions[] = "$field = '" . $db->quote($value)."'";
                        break;
                
                    case 'not_equals':
                        $conditions[] = "$field != '" . $db->quote($value)."'";
                        break;
                
                    case 'like':
                        $conditions[] = "$field LIKE '" . $db->quote("%$value%")."'";
                        break;
                
                    case 'not_like':
                        $conditions[] = "$field NOT LIKE '" . $db->quote("%$value%")."'";
                        break;
                
                    case 'starts_with':
                        $conditions[] = "$field LIKE '" . $db->quote("$value%")."'";
                        break;
                
                    case 'ends_with':
                        $conditions[] = "$field LIKE '" . $db->quote("%$value")."'";
                        break;
                
                    case 'greater_than':
                        $conditions[] = "$field > '" . $db->quote($value)."'";
                        break;
                
                    case 'less_than':
                        $conditions[] = "$field < '" . $db->quote($value)."'";
                        break;
                
                    case 'greater_or_equal':
                        $conditions[] = "$field >= '" . $db->quote($value)."'";
                        break;
                
                    case 'less_or_equal':
                        $conditions[] = "$field <= '" . $db->quote($value)."'";
                        break;
                
                    case 'on': // For date/datetime exact match
                        $normalizedDate = $normalizeDate($value);
                        $conditions[] = "DATE($field) = '" . $db->quote($normalizedDate)."'";
                        break;
                
                    case 'before':
                        $normalizedDate = $normalizeDate($value);
                        $conditions[] = "DATE($field) < '" . $db->quote($normalizedDate)."'";
                        break;
                
                    case 'after':
                        $normalizedDate = $normalizeDate($value);
                        $conditions[] = "DATE($field) > '" . $db->quote($normalizedDate)."'";
                        break;
                
                    case 'is_empty':
                        $conditions[] = "($field IS NULL OR $field = '')";
                        break;
                
                    case 'is_not_empty':
                        $conditions[] = "($field IS NOT NULL AND $field != '')";
                        break;
                
                    case 'is_true':
                        $conditions[] = "($field = 1)";
                        break;
                
                    case 'is_false':
                        $conditions[] = "($field = 0)";
                        break;
                
                    default:
                        // Default handling if the operator is not recognized
                        $conditions[] = "$field $operator '" . $db->quote($value)."'";
                        break;
                }
            }

            // If there's another filter in the group, append the fieldLogicalOperator
            if ($filterIndex < count($groupFilters) - 1) {
                $conditions[] = $fieldLogicalOperator;
            }
        }

        // Combine conditions within the group
        if (!empty($conditions)) {
            $groupConditions[] = "(" . implode(" ", $conditions) . ")";
        }

        // If there's another group, append the groupLogicalOperator
        if ($groupIndex < count($filters) - 1) {
            $groupConditions[] = $groupLogicalOperator;
        }
    }

    // Combine all group conditions
    if (!empty($groupConditions)) {
        $finalCondition = implode(" ", $groupConditions);

        if (strpos($baseQuery, 'WHERE') !== false || strpos($baseQuery, 'Where') !== false || strpos($baseQuery, 'where') !== false) {
            $baseQuery = preg_replace('/WHERE/i', 'WHERE (' . $finalCondition . ') AND', $baseQuery);
        } else {
            $baseQuery = preg_replace('/GROUP BY|ORDER BY/i', 'WHERE (' . $finalCondition . ') $0', $baseQuery, 1);
        }
    }

    // Ensure only one GROUP BY and ORDER BY clause is appended
    if (!empty($groupByClause) && strpos($baseQuery, 'GROUP BY') === false) {
        $log->fatal("groupByClause groupByClause: " . print_r($groupByClause, 1));

        $baseQuery .= " $groupByClause";
    }

    if (!empty($orderByClause) && strpos($baseQuery, 'ORDER BY') === false) {
        $log->fatal("orderByClause orderByClause: " . print_r($orderByClause, 1));

        $baseQuery .= " $orderByClause";
    }

    return $baseQuery;
}


function manageUserWorkspacePreference($userID, $newWorkspace = null) {
    global $db;
    $GLOBALS['log']->fatal("In manageUserWorkspacePreference");
    $GLOBALS['log']->fatal("In manageUserWorkspacePreference".$userID);

    // Check if a row exists for the user
    $query = "SELECT id, preference_value FROM pd_users_preferences 
              WHERE user_id = '$userID' AND preference_name = 'default_workspace' LIMIT 1";
    $result = $db->query($query);
    $row = $db->fetchByAssoc($result);

    if (!$row) {
        // No row exists, return an error to trigger the popup
        if (!$newWorkspace) {
            return ['status' => 'error', 'message' => 'No workspace selected', 'showPopup' => true];
        }

        // Insert a new row with the workspace preference
        $insertQuery = "INSERT INTO pd_users_preferences (id,user_id, preference_name, preference_value, date_entered)
                        VALUES (UUID(),'$userID', 'default_workspace', '$newWorkspace', NOW())";
        $db->query($insertQuery);

        return ['status' => 'success', 'message' => 'Workspace preference added'];
    }
    $GLOBALS['log']->fatal("In manageUserWorkspacePreference33".print_r($row,1));

    $preferenceID = $row['id'];
    $currentWorkspace = $row['preference_value'];

    // If a new workspace is provided and it's different, update the existing row
    if ($newWorkspace && $newWorkspace != $currentWorkspace) {
        $updateQuery = "UPDATE pd_users_preferences 
                        SET preference_value = '$newWorkspace', date_modified = NOW()
                        WHERE id = '$preferenceID'";
        $db->query($updateQuery);
        return ['status' => 'success', 'message' => 'Workspace updated', 'preference_id' => $preferenceID];
    }

    // Return the existing row ID for usage in the view
    return ['status' => 'success', 'preference_id' => $preferenceID, 'workspace' => $currentWorkspace];
}


function getfieldType($moduleName , $fieldName){
    if (empty($moduleName) || empty($fieldName)) {
        return "Module name and field name must be provided.";
    }

    // Load the bean for the given module
    $bean = BeanFactory::getBean($moduleName);

    if (!$bean) {
        return "Invalid module name: $moduleName";
    }
    $GLOBALS['log']->fatal("In bean->field_defs".print_r($bean->field_defs,1));

    // Check if the field exists in the vardefs
    if (!isset($bean->field_defs[$fieldName])) {
        return "Field '$fieldName' not found in module '$moduleName'.";
    }

    // Return the type of the field
    return $bean->field_defs[$fieldName]['type'] ?? "Type information not available for field '$fieldName'.";
} 

?>