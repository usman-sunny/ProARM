<?php
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

namespace App\Data\LegacyHandler;

use Exception; // Alien code 6754
use DBManagerFactory; // Alien code 6754

class ListDataHandler extends BaseListDataHandler implements ListDataHandlerInterface
{
    /**
     * @param string $module
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return ListData
     */
    public function fetch(
        string $module,
        array $criteria = [],
        int $offset = -1,
        int $limit = -1,
        array $sort = []
    ): ListData {
        $type = 'advanced';

        // Alien code 6754 - start
        // Check if this is a global search box call and handle differently
        if (isset($criteria['globalSearchMode']) && $criteria['globalSearchMode'] === true) {
            return $this->handleGlobalSearchLogic($module, $criteria, $offset, $limit, $sort);
        }
        // Alien code 6754 - end

        $bean = $this->getBean($module);

        $legacyCriteria = $this->mapCriteria($criteria, $sort, $type);

        [$params, $where, $filter_fields] = $this->prepareQueryData($type, $bean, $legacyCriteria);

        $resultData = $this->getListDataPort()->get($bean, $where, $offset, $limit, $filter_fields, $params);

        return $this->buildListData($resultData);
    }

    // Alien code block 6754 - start

    /**
     * 
     * * * Alien function 6754 that needs to be checked (6) * * *
     * 
     * Handle global search logic with OR conditions across multiple fields
     * 
     * @param string $module
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return ListData
     */
    protected function handleGlobalSearchLogic(string $module, array $criteria, int $offset, int $limit, array $sort): ListData
    {
   
        try {
            $bean = $this->getBean($module);
            
            // Extract search term from filters
            $searchTerm = '';
            if (isset($criteria['search_term'])) {
                $searchTerm = $criteria['search_term'];
            } elseif (isset($criteria['filters']['name']['values'][0])) {
                $searchTerm = $criteria['filters']['name']['values'][0];
            }
            
            if (empty($searchTerm)) {
                $listData = new ListData();
                $listData->setRecords([]);
                return $listData;
            }

            // Get column names from module list view definition
            $columnNames = $this->getModuleColumnNames($module);

            // create where clause with OR conditions for global search
            $where = $this->fromWhere($columnNames, $searchTerm, $module);
            
            // Use minimal criteria for other query setup
            $minimalCriteria = ['query' => 'true'];
            $type = 'advanced';
            
            // Get standard query components but override WHERE clause
            [$params, $standardWhere, $filter_fields] = $this->prepareQueryData($type, $bean, $minimalCriteria);
            
            // Execute the query
            $resultData = $this->getListDataPort()->get($bean, $where, $offset, $limit, $filter_fields, $params);
            
            return $this->buildListData($resultData);
            
        } catch (Exception $e) {
            error_log('Error in handleGlobalSearchLogic: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            
            // Return empty result on error
            $listData = new ListData();
            $listData->setRecords([]);
            return $listData;
        }
    }

    /**
     * 
     * * * Alien function 6754 that needs to be checked (7) * * *
     * 
     * Get database column names for a module
     * 
     * @param string $module
     * @return array Array of actual database column names for the module
     */
    protected function getModuleColumnNames(string $module): array
    {
        try {
            $bean = $this->getBean($module);
            
            // Get field definitions from the bean
            $fieldDefs = $bean->field_defs ?? [];

            $searchableColumns = [];
            
            // Filter to get only searchable text-based database columns
            foreach ($fieldDefs as $fieldName => $fieldDef) {
                // Skip non-searchable field types
                $skipTypes = ['datetime', 'date', 'bool', 'relate', 'link', 'enum', 'id'];
                if (isset($fieldDef['type']) && in_array($fieldDef['type'], $skipTypes)) {
                    continue;
                }
                
                // Skip specific problematic fields
                $skipFields = ['assigned_user_name', 'created_by_name', 'modified_by_name', 'deleted'];
                if (in_array($fieldName, $skipFields)) {
                    continue;
                }
                
                // Skip custom relationship fields
                if (isset($fieldDef['source']) && $fieldDef['source'] === 'non-db') {
                    continue;
                }
                
                // Include text-based fields that are good for searching
                if (isset($fieldDef['type']) && in_array($fieldDef['type'], ['varchar', 'text', 'char', 'name', 'phone', 'currency'])) {
                    $searchableColumns[] = $fieldName;
                } else if (!isset($fieldDef['type'])) {
                    // Include fields without explicit type (might be searchable)
                    $searchableColumns[] = $fieldName;
                }
            }
            
            // If no searchable columns found, add some common fallback columns
            if (empty($searchableColumns)) {
                $searchableColumns = ['name', 'description'];
            }
            
            return $searchableColumns;
            
        } catch (Exception $e) {
            error_log('Error getting database column names for module ' . $module . ': ' . $e->getMessage());
            
            // Return default fallback columns if something goes wrong
            return ['name', 'description'];
        }
    }

    /**
     * 
     * * * Alien function 6754 that needs to be checked (8) * * *
     * 
     * Build dynamic WHERE clause with OR conditions for global search
     * 
     * @param array $columnNames Array of database column names to search in
     * @param string $searchTerm The search term to look for
     * @param string $module The module name to get table name
     * @return string The WHERE clause string with OR conditions
     */
    protected function fromWhere(array $columnNames, string $searchTerm, string $module): string
    {
        try {
            $bean = $this->getBean($module);
            $tableName = $bean->getTableName();
            $db = DBManagerFactory::getInstance();
            
            // Escape the search term for SQL safety
            $escapedTerm = $db->quoted($searchTerm . '%');
            
            $orConditions = [];
            
            // Build OR conditions for each column
            foreach ($columnNames as $columnName) {
                // Convert column name to lowercase field name (e.g., 'NAME' -> 'name')
                $fieldName = strtolower($columnName);
                
                // Skip non-searchable fields that might cause SQL errors
                $skipFields = ['jjwg_maps_geocode_status_c', 'jjwg_maps_address_c'];
                if (in_array($fieldName, $skipFields)) {
                    continue;
                }
                
                // Add condition for this field
                $orConditions[] = "({$tableName}.{$fieldName} like {$escapedTerm})";
            }
            
            // Join all conditions with OR
            $whereClause = implode(' OR ', $orConditions);
            
            return $whereClause;
            
        } catch (Exception $e) {
            error_log('Error building WHERE clause: ' . $e->getMessage());
            
            // Return a fallback WHERE clause if something goes wrong
            $bean = $this->getBean($module);
            $tableName = $bean->getTableName();
            $db = DBManagerFactory::getInstance();
            $escapedTerm = $db->quoted($searchTerm . '%');
            
            return "({$tableName}.name like {$escapedTerm})";
        }
    }
    // Alien code block 6754 - end

    /**
     * @param array $resultData
     * @return ListData
     */
    protected function buildListData(array $resultData): ListData
    {
        $listData = new ListData();
        $records = $this->recordMapper->mapRecords($resultData['data'] ?? [], $resultData['pageData'] ?? []);
        $listData->setRecords($records);
        $listData->setOrdering($resultData['pageData']['ordering'] ?? []);
        if(isset($resultData['pageData']['offsets']['total']) && is_numeric($resultData['pageData']['offsets']['total'])) {
            $resultData['pageData']['offsets']['total'] = (int) $resultData['pageData']['offsets']['total'];
        }
        $listData->setOffsets($resultData['pageData']['offsets'] ?? []);

        return $listData;
    }
}
