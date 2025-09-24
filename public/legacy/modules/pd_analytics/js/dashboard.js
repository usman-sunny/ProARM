$(document).ready(function () {

    console.log('dashboardJS'); // Output JSON structure in console
    $("#createDashboard").on("click", function () {
        var dbID = $(this).attr('module-id');
        if(dbID != ''){
            $('#dashboard-id').val(dbID);

        }
        $('#create_dahsboard_modal').show();
        
    });
});
$(document).on('click', '#close_dashboard_modal', function() { 
    $('#create_dahsboard_modal').hide();
});

$(document).off('click', '#saveDashboard').on('click', '#saveDashboard', function() {
    localStorage.clear();
    sessionStorage.clear();
    var dashboardName = $('#dashboard-name').val();
    // var collectionID = $('#dashboard-collection-select').val();
    var DashboardID = $(this).attr('module-id');

    if (dashboardName === "") {
        alert("Please enter a name!");
        return;
    }

    const layout = [];

    // Iterate through each .canvas element
    $('.canvas').each(function (index) {
        const $canvas = $(this); // Current canvas element
        const $content = $canvas.find('.canvas-content'); // Inner content
        const title = $content.find('h2').text().trim() || "Drop reports here"; // Extract title
    
        // Extract dimensions and provide defaults if missing
        const width = $canvas.css('width') || "auto";
        const height = $canvas.css('height') || "auto";
    
        // Extract position and provide defaults if missing
        const top = $canvas.css('top') || "0px";
        const left = $canvas.css('left') || "0px";
    
        // Extract and clean HTML content
        let content = $content.attr('module-id')// Encode content for safe storage (handles special characters)
    
        // Build the JSON structure for this canvas
        layout.push({
            id: `canvas-${index + 1}`, // Unique ID
            title: title, // Widget title
            width: width, // Canvas width
            height: height, // Canvas height
            content: content, // Encoded HTML content
            position: {
                top: top, // Canvas top position
                left: left, // Canvas left position
            },
        });
    });
    $('#create_dahsboard_modal').hide();
    
    // Convert layout to JSON
    const layoutJSON = layout; // Pretty print for debugging
    if(DashboardID != ''){
        var dataPost = {
            'dashboardName'        : dashboardName,
            'layoutData'           : layoutJSON,
            'moduleName'           : 'pd_dashboard',
            'dashboardID'          : DashboardID,
        };
    }
    else {
        var dataPost = {
            'dashboardName'        : dashboardName,
            'layoutData'           : layoutJSON,
            'moduleName'           : 'pd_dashboard',
        };
    }

    $.ajax({
        url : "index.php?module=pd_analytics&action=saveDashboard&sugar_body_only=true",
        type : 'POST',
        data : dataPost,
        success : function(data){
            renderDashboard(layoutJSON,dashboardName,data);
        }
    });
});