<?php

require_once ('modules/pd_analytics/utils/utilities.php');
#[\AllowDynamicProperties]
class pd_analyticsViewList extends ViewList
{
    /**
     * @see ViewList::preDisplay()
     */
    public function display()
    {
        $this->smarty = new Sugar_Smarty();
        global $sugar_config, $current_user;
        $collections = $this->getCollections();
        $GLOBALS['log']->fatal("Collecteiins: ".print_r($collections,1));
        $CollectionData = array();
        $response = manageUserWorkspacePreference($current_user->id);

        if ($response['status'] === 'error' && $response['showPopup']) {
            $showAddworkspace =  "$('#new_collection_modal').show()";  // Call JavaScript function to show popup
        } else {
            $workspacePreferenceID = $response['workspace'];
        }

        $CollectionData = getCollectionData('pd_reports',$workspacePreferenceID,$CollectionData);
        $CollectionData = getCollectionData('pd_dashboard',$workspacePreferenceID,$CollectionData);

        $allModules = getAllModulesWithLabels();

        $GLOBALS['log']->fatal("In CollectionData: ".print_r($CollectionData,1));
        $this->smarty->assign('modules',$allModules);
        
        $this->smarty->assign('CollectionData',$CollectionData);

        $this->smarty->assign('siteURL',$sugar_config['site_url']);

        $this->smarty->assign('collections',$collections);
        $users = getUsers();
        $this->smarty->assign('users',$users);
        $this->smarty->assign('selectedCollectionID',$workspacePreferenceID);
        $collectionViewTpl = $this->smarty->fetch('modules/pd_analytics/tpls/collection_view.tpl');

        $this->smarty->assign('collectionViewTpl',$collectionViewTpl);

        echo '<script>
                    $(document).ready(function(){
                        $("#massassign_form").hide();
                        $("#buttontoggle").hide();
                        '.$showAddworkspace.';
                    });
            </script>';

        $this->smarty->display('modules/pd_analytics/tpls/analytcis.tpl');

    }

    public function getCollections(){
        global $db;
        $getCollQuery = "SELECT id,name FROM pd_collections Where deleted = 0;";
        $sqlResult = $db->query($getCollQuery);
        $collection_dropdown = array();
        while($collection_row = $db->fetchByAssoc($sqlResult)){
            $collection_dropdown[$collection_row['id']] = $collection_row['name'];
        }
        return $collection_dropdown;
    }
}
