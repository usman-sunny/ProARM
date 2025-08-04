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

namespace App\Data\Resolver;

use ApiPlatform\GraphQl\Resolver\QueryItemResolverInterface;
use App\Data\Entity\Record;
use App\Data\Entity\RecordList;
use App\Data\LegacyHandler\RecordListHandler;
use App\Data\Service\Record\ApiRecordMappers\ApiRecordMapperRunner;
use Exception;

class RecordListResolver implements QueryItemResolverInterface
{
    protected RecordListHandler $recordListHandler;
    protected ApiRecordMapperRunner $apiRecordMapperRunner;

    /**
     * RecordListResolver constructor.
     * @param RecordListHandler $recordListHandler
     * @param ApiRecordMapperRunner $apiRecordMapperRunner
     */
    public function __construct(
        RecordListHandler $recordListHandler,
        ApiRecordMapperRunner $apiRecordMapperRunner
    )
    {
        $this->recordListHandler = $recordListHandler;
        $this->apiRecordMapperRunner = $apiRecordMapperRunner;
    }

    /**
     * @param RecordList|null $item
     *
     * @param array $context
     * @return RecordList
     */
    public function __invoke($item, array $context): RecordList
    {
        $module = $context['args']['module'] ?? '';
        $limit = $context['args']['limit'] ?? -1;
        $offset = $context['args']['offset'] ?? -1;
        $criteria = $context['args']['criteria'] ?? [];
        $sort = $context['args']['sort'] ?? [];

        // Alien code 6754 - start
        // Check if this call is from search box or filters
        $isSearchBoxCall = isset($criteria['searchType']) && $criteria['searchType'] === 'global_search_box';
        
        if ($isSearchBoxCall) {
            $list = $this->prepareGlobalSearchData($module, $criteria, $offset, $limit, $sort);
        } else {
            $list = $this->recordListHandler->getList($module, $criteria, $offset, $limit, $sort); // Except this line of code which is native
        }
        // Alien code 6754 - end

        $mappedRecords = [];
        foreach ($list->getRecords() as $recordArray) {
            $record = new Record();
            $record->fromArray($recordArray);

            $this->apiRecordMapperRunner->toExternal($record, 'list');
            $mappedRecords[] = $record->toArray();
        }

        $list->setRecords($mappedRecords);
        return $list;
    }

    // Alien code block 6754 - start
    /**
     * 
     * * * Alien function 6754 that needs to be checked (1) * * *
     * 
     * Prepare global search data by searching across multiple fields with OR conditions.
     * Reads searchdefs.php for the module to get searchable fields.
     *
     * 
     * @param string $module
     * @param array $criteria
     * @param int $offset
     * @param int $limit
     * @param array $sort
     * @return RecordList
     */
    protected function prepareGlobalSearchData(string $module, array $criteria, int $offset, int $limit, array $sort): RecordList
    {   
        // Extract search term from criteria
        $searchTerm = '';
        if (isset($criteria['filters']['name']['values'][0])) {
            $searchTerm = $criteria['filters']['name']['values'][0];
        }
        
        if (empty($searchTerm)) {
            return new RecordList();
        }
        
        // Get searchable fields from searchdefs.php
        $searchableFields = $this->getSearchableFields($module);
        
        // Fallback to common fields if searchdefs failed to load
        if (empty($searchableFields)) {
            $searchableFields = $this->getFallbackSearchableFields($module);
        }
        
        // Build global search criteria with OR conditions
        $globalSearchCriteria = $this->buildGlobalSearchCriteria($searchTerm, $searchableFields, $criteria);
        
        // Use the modified criteria for global search
        return $this->recordListHandler->getList($module, $globalSearchCriteria, $offset, $limit, $sort);
    }
    
    /**
     * 
     * * * Alien function 6754 that needs to be checked (2) * * *
     * 
     * Get searchable fields from the module's searchdefs.php file
     *
     * @param string $module
     * @return array
     */
    protected function getSearchableFields(string $module): array
    {
        $searchableFields = [];
        
        // Convert module name to legacy format (e.g., 'accounts' -> 'Accounts')
        $legacyModule = ucfirst(strtolower($module));
        
        // Path to searchdefs.php file
        $searchDefsPath = __DIR__ . '/../../../../public/legacy/modules/' . $legacyModule . '/metadata/searchdefs.php';
        
        error_log('Looking for searchdefs at: ' . $searchDefsPath);
        
        if (file_exists($searchDefsPath)) {
            error_log('Searchdefs file found, but using fallback for now to avoid hanging');
            // TODO: Fix searchdefs.php loading later - currently has dependency issues
        } else {
            error_log('Searchdefs not found for ' . $legacyModule . ' at ' . $searchDefsPath);
        }
        
        // Fallback to common fields if no searchable fields found
        if (empty($searchableFields)) {
            error_log('No searchable fields found, using fallback fields');
            $searchableFields = ['name', 'email', 'phone_office', 'website', 'description'];
        }
        
        return $searchableFields;
    }
    
    /**
     * 
     * * * Alien function 6754 that needs to be checked (3) * * *
     * 
     * Get fallback searchable fields for common modules
     *
     * @param string $module
     * @return array
     */
    protected function getFallbackSearchableFields(string $module): array
    {
        // Common searchable fields by module
        $moduleFields = [
            'accounts' => ['name', 'website', 'phone_office', 'email1', 'billing_address_street', 'billing_address_city', 'description'],
            'contacts' => ['first_name', 'last_name', 'phone_work', 'phone_mobile', 'email1', 'title', 'description'],
            'leads' => ['first_name', 'last_name', 'phone_work', 'phone_mobile', 'email1', 'title', 'company', 'description'],
            'opportunities' => ['name', 'description', 'lead_source'],
            'cases' => ['name', 'description'],
            'users' => ['first_name', 'last_name', 'user_name', 'email1', 'title', 'phone_work']
        ];
        
        $module = strtolower($module);
        
        if (isset($moduleFields[$module])) {
            error_log("Using predefined fields for module: $module");
            return $moduleFields[$module];
        }
        
        // Generic fallback for unknown modules
        error_log("Using generic fallback fields for module: $module");
        return ['name', 'description'];
    }
    
    /**
     * 
     * * * Alien function 6754 that needs to be checked (4) * * *
     * 
     * Check if a field is suitable for text searching
     *
     * @param mixed $fieldConfig - Can be array or other formats
     * @return bool
     */
    protected function isTextSearchableField($fieldConfig): bool
    {
        // Handle different field configuration formats
        if (!is_array($fieldConfig)) {
            error_log('Field config is not an array: ' . json_encode($fieldConfig));
            return false;
        }
        
        // Get field name - can be in different keys
        $fieldName = $fieldConfig['name'] ?? $fieldConfig['field'] ?? '';
        
        // Get field type - can be in different keys
        $fieldType = $fieldConfig['type'] ?? $fieldConfig['fieldType'] ?? '';
        
        error_log("Checking field: $fieldName, type: $fieldType");
        
        // Skip certain field types that are not suitable for text search
        $skipTypes = ['bool', 'enum', 'date', 'datetime', 'id', 'link', 'relate'];
        
        if (!empty($fieldType) && in_array($fieldType, $skipTypes)) {
            error_log("Skipping field $fieldName - type $fieldType is in skip list");
            return false;
        }
        
        // Include fields that are typically text-searchable by name
        $includedFields = ['name', 'website', 'phone', 'phone_office', 'email', 'email1', 
                          'address_street', 'address_city', 'description', 'billing_address_street',
                          'billing_address_city', 'shipping_address_street', 'shipping_address_city'];
        
        if (in_array($fieldName, $includedFields)) {
            error_log("Including field $fieldName - field name is in included list");
            return true;
        }
        
        // Include fields by type
        $includedTypes = ['name', 'varchar', 'text', 'phone'];
        if (!empty($fieldType) && in_array($fieldType, $includedTypes)) {
            error_log("Including field $fieldName - type $fieldType is in included types");
            return true;
        }
        
        error_log("Excluding field $fieldName - doesn't match criteria");
        return false;
    }
    
    /**
     * 
     * * * Alien function 6754 that needs to be checked (5) * * *
     * 
     * Build global search criteria with OR conditions across multiple fields
     *
     * @param string $searchTerm
     * @param array $searchableFields
     * @param array $originalCriteria
     * @return array
     */
    protected function buildGlobalSearchCriteria(string $searchTerm, array $searchableFields, array $originalCriteria): array
    {
        $globalCriteria = [
            'name' => 'global_search',
            'searchType' => 'global_search_box',
            'globalSearchMode' => true, // Flag to indicate OR logic should be used
            'filters' => []
        ];
        
        // Create filter for each searchable field with LIKE operator
        foreach ($searchableFields as $fieldName) {
            $globalCriteria['filters'][$fieldName] = [
                'field' => $fieldName,
                'operator' => 'contains', // Use contains for broader matching
                'values' => [$searchTerm]
            ];
        }
        
        // Copy over pagination and sorting from original criteria
        if (isset($originalCriteria['orderBy'])) {
            $globalCriteria['orderBy'] = $originalCriteria['orderBy'];
        }
        if (isset($originalCriteria['sortOrder'])) {
            $globalCriteria['sortOrder'] = $originalCriteria['sortOrder'];
        }
        
        return $globalCriteria;
    }
    // Alien code block 6754 - end
}
