$(document).ready(function() {

    // Toggle New Report menu
    $("#right-drop-button").on("click", function (e) {
        e.stopPropagation();
        $("#data-source-menu").fadeOut("medium");
        $("#right-drop-menu").fadeToggle("medium");
    });

    // Close New Report menu if clicking outside
    $(document).on("click", function () {
        $("#right-drop-menu").fadeOut("medium");
    });

    // Prevent menu from closing when clicking inside
    $("#right-drop-menu").on("click", function (e) {
        e.stopPropagation();
    });

    // Toggle New Report menu
    $(".right-menu-btn").on("click", function () {
        $(".right-menu-options").slideDown();
    });

    $("#create_visualization").on("click", function () {
            $("#create_modal").show();
    });

    $("#close_modal").on("click", function () {
        $("#create_modal").hide();
    });

    // Toggle Data Sources Pop-up Menu
    $("#data-source-btn").on("click", function (e) {
        e.stopPropagation();
        $("#right-drop-menu").fadeOut("medium");
        $("#data-source-menu").fadeToggle("medium");
    });

    // Close data source menu if clicking outside
    $(document).on("click", function () {
        $("#data-source-menu").fadeOut("medium");
    });

    // Prevent menu from closing when clicking inside
    $("#data-source-menu").on("click", function (e) {
        e.stopPropagation();
    });

    // Toggle Data Sources Menu Items
    $(".ds-menu-btn").on("click", function () {
        $(".ds-menu-options").slideDown();
    });

    // Add click event for ds-menu-items
    $(".ds-menu-items").on("click", function () {
        var type = '';
        renderQueryTableHtml(type);
    });

});

$(document).on('change', '#collections-dropdown', function() {
    // Get the selected value
    var selectedCollection = $(this).val();
    var type = $('#get_page_type').val();

    if (selectedCollection === "add_workspace") {
        $('#new_collection_modal').show();
        return;
    }
    showLoader();
    // Log the selected value to the console (you can replace this with your custom action)
    console.log('Selected Collection: ' + selectedCollection);
    var data = {
        'collection_id'     : selectedCollection,
        'type'              : type,
    };
    $.ajax({
        url : "index.php?module=pd_analytics&action=getReportsAndDashboards&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            hideLoader();

            $('#dashboard-grid-data').empty().html(result);
        }
    });
});


$(document).on('click', '.dashboard-card', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var site_url = $('#site_url').val();
    console.log(moduleId);
    console.log(moduleName);
    showLoader();

    var data = {
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
    };

    if (moduleId != '' && moduleName != ''){
        if(moduleName == 'pd_reports'){
            $.ajax({
                url : "index.php?module=pd_analytics&action=getReportsDetailView&sugar_body_only=true",
                type : 'POST',
                data : data,
                success : function(data){
                    var result = JSON.parse(data);
                    console.log(result);
                    hideLoader();

                    $('#right-container-inner-content').empty().html(result);
                }
            });       
        }else{
            var Dname = $(this).find('h3').text();
            console.log(Dname);
            $.ajax({
                url : "index.php?module=pd_analytics&action=getDashboardDetailView&sugar_body_only=true",
                type : 'POST',
                data : data,
                success : function(data){
                    var result = JSON.parse(data);
                    console.log(result);

                    hideLoader();
                    renderDashboard(result,Dname,moduleId);
                }
            }); 
        }
    }
});

$(document).on('click', '.view-all-reports', function() {
    showLoader();
    $.ajax({
        url : "index.php?module=pd_analytics&action=getAllReports&sugar_body_only=true",
        type : 'POST',
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            hideLoader();
            $('.view-all-reports').addClass('active');
            $('.view-all-dashboards').removeClass('active');
            $('#home-dasboard-data').empty().html(result);
            $('#get_page_type').val('pd_reports');
        }
    });
});


$(document).on('click', '.view-all-dashboards', function() {
    showLoader();
    $.ajax({
        url : "index.php?module=pd_analytics&action=getAllDashboards&sugar_body_only=true",
        type : 'POST',
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            hideLoader();
            $('.view-all-dashboards').addClass('active');
            $('.view-all-reports').removeClass('active');
            $('#home-dasboard-data').empty().html(result);
            $('#get_page_type').val('pd_dashboard');
        }
    });
});
$(document).on('click', '#apply-filter-dashboard', function() {
    var dashboardID = $(this).attr('module-id');
    var dashName = $('#title-dashbboard').text();


    $('#filter_modal').show();
    $('#Dashboard-moduleId').val(dashboardID);
    $('#Dashboard-name').val(dashName);

});

$(document).on('click', '#close_dashboard_filter', function() {

    $('#filter_modal').hide();

});
$(document).on('click', '#clear_filter_fields', function() {

    $('#dashboard_date_filter_start').val('');
    $('#dashboard_date_filter_end').val('');
    $('#dashboard_filter_field_period').val('');
    $('#dashboard_filter_field_user').val('');

});

$(document).on('click', '#clear_filters', function() {
    var dashboardID = $('#Dashboard-moduleId').val();
    var moduleName = $('#Dashboard-moduleName').val();

    // Prepare data to send in AJAX request
    var data = {
        moduleId: dashboardID,
        moduleName: moduleName,
    };

    console.log('Prepared Filters:', data);
    showLoader();
    var dashboardName = $('#Dashboard-name').val();

    $.ajax({
        url: "index.php?module=pd_analytics&action=clearFilter&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                $('#filter_modal').hide();
                renderDashboard(result,dashboardName,dashboardID);

            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});

$(document).on('click', '#create_report', function() {
    var chartType = $('#chart_type').val();
    var moduleName = $('#moduleName').val();
    var chartModule = $('#chart-module').val();
    var collectionID = $('#collection-select').val();
    showLoader();
    var data = {
        'chartType'            : chartType,
        'moduleName'           : moduleName,
        'chartModule'          : chartModule,
        'collectionID'         : collectionID,
    };
    $.ajax({
        url : "index.php?module=pd_analytics&action=createNewReport&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(response){
            var result = JSON.parse(response);
            var createdata = {
                'moduleId'             : result.id,
                'moduleName'           : result.module,
            };
            console.log(createdata);
            hideLoader();

            $("#create_modal").hide();
            loadCreateView(createdata,chartType);
        }
    });
});


$(document).on('click', '#create_dashboard', function() {
    showLoader();
    localStorage.clear();
    sessionStorage.clear();
    $.ajax({
        url : "index.php?module=pd_analytics&action=createDashboardView&sugar_body_only=true",
        type : 'POST',
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            hideLoader();

            $('#right-container-inner-content').empty().html(result);
        }
    });
});

// Delete Button JS function for deleting a report or a dashboard
$(document).on('click', '.delete-record', function(e) {
    e.stopPropagation();

    var dashboardId = $(this).data('id');
    var modulexName = $(this).attr('modulex-name');
    if (confirm('Are you sure you want to delete this?')) {
        $.ajax({
            url: "index.php?module=pd_analytics&action=deleteRecord&sugar_body_only=true",
            type: 'POST',
            data: { id: dashboardId, modulex: modulexName },
            success: function(response) {
                var result = JSON.parse(response);
                if (result.success) {
                    alert('Deleted successfully.');
                    window.location.reload();
                } else {
                    alert('Failed to delete.');
                }
            }
        });
    }
});

$(document).on('click', '#execute-query', function(e) {
    var sqlQuery = $("#sql-query").val().trim();

    if (sqlQuery === "") {
        alert("Please enter a SQL query.");
        return;
    }
    $.ajax({
        url: "index.php?module=pd_analytics&action=executeQuery&sugar_body_only=true",
        type: "POST",
        data: { sql_query: sqlQuery },
        dataType: "json",
        success: function (response) {
            if (response.success) {
                var tabHtml = getTableHtml(response);
                $("#query-result").html(tabHtml);
                if($('#tab-type').val() == 'tabular'){
                    $('#sql-header').show();
                    $('#save-query').show();
                }
            } else {
                $("#query-result").html("<p style='color:red;'>" + response.error + "</p>");
            }
        },
        error: function () {
            $("#query-result").html("<p style='color:red;'>An error occurred while executing the query.</p>");
        }
    });
});

$(document).on('click', '#save-query', function(e) {
    var sqlQuery = $("#sql-query").val().trim();
    var tab_name = $("#sql-tab-name").val();
    var tab_collection = $("#query-collection-select").val();
    var reportType = $("#tab-type").val();

    if (sqlQuery === "") {
        alert("Please enter a SQL query.");
        return;
    }
    if (tab_name === "") {
        alert("Please enter a Table Name.");
        return;
    }
    if (tab_collection === "") {
        alert("Please select the workspace.");
        return;
    }
    $.ajax({
        url: "index.php?module=pd_analytics&action=saveQueryTable&sugar_body_only=true",
        type: "POST",
        data: { sql_query: sqlQuery,  tab_name: tab_name, tab_collection: tab_collection, reportType: reportType},
        dataType: "json",
        success: function (response) {
            if (response.success) {
                window.location.reload();
            }
        }
    });
});

function loadCreateView(data,type){
    showLoader();
    localStorage.clear();
    sessionStorage.clear();
    $.ajax({
        url : "index.php?module=pd_analytics&action=getReportsEditView&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            hideLoader();

            $('#right-container-inner-content').empty().html(result);
            if(type == 'tabular'){
                getModulesAndFields();
            }
        }
    });
}


function renderDashboard(layout,name,id){
    // $('#right-container-inner-content').empty().html(result);
    showLoader();

    const $container = $('#right-container-inner-content'); // The container for all canvases
    $container.empty();// Clear the container
    const $innerupperdiv = $('<div>', { class: 'row', css: { 'margin-bottom':'1%'} });
    const $upperdivinnerone = $('<div>', { class: 'col-md-8 col-lg-8 col-xl-8'}).html('<h2 id="title-dashbboard">'+name+'</h2>');
    const $upperdivinnertwo = $('<div>', { class: 'col-md-4 col-lg-4 col-xl-4'}).html('<button id=apply-filter-dashboard class="create-dashboard-design-button" module-id="'+id+'">Apply Filters</button> <button id=edit-dashboard class="create-dashboard-design-button" module-name="pd_dashboard" module-id="'+id+'">Edit Dashboard</button>');
    $innerupperdiv.append($upperdivinnerone);
    $innerupperdiv.append($upperdivinnertwo);
    $container.append($innerupperdiv);

    const $innerdiv = $('<div>', { class: 'right-panel', css: { 'width':'100%','height':'auto', 'justify-content' :'center', 'justify-self':'center' } });
    $container.append($innerdiv);
    let count = 1;
    layout.forEach((item) => {
        const reportID = decodeURIComponent(item.content); // Decode content
        // Create a chart container
        if(reportID !=""){
            var chartContainer = document.createElement('div');
            chartContainer.id = 'chart-'+count; // Unique container ID
            chartContainer.className = 'canvas chart-container'; // Add chart-specific styles
            chartContainer.style.width = item.width; // Full width of the column
            chartContainer.style.height = item.height; // Fixed height for charts
            $innerdiv.append(chartContainer); // Append to your dashboard container
    
            console.log(chartContainer);
            getReportsData(chartContainer,reportID,id); 
    
            count++;
        }

    });
    hideLoader();
}

function getReportsData(container,data,dashboardID){
    var postData = {
        'moduleId' : data,
        'dashboardID': dashboardID,
    };
    $.ajax({
        url : "index.php?module=pd_analytics&action=getReportsData&sugar_body_only=true",
        type : 'POST',
        data : postData,
        success : function(data){
            var result = JSON.parse(data);
            console.log("return"+result);
            if(result.reporttype != 'tabular'){
                var myChart = echarts.init(container); // Select the container using jQuery
                console.log(result);

                    // Get chart data passed from the controller
                var chartData = JSON.parse(result.chartData); // This is passed as JSON from the controller
                console.log(chartData);

                // Define chart options dynamically based on `reportType`
                var option;

                if (result.reporttype === 'pie') {
                    // Options for pie chart
                    option = {
                        title: {
                            text: chartData.title,
                            left: 'center', // Center the title
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)', // Tooltip format for pie chart
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: chartData.xAxis, // Legend items from categories
                        },
                        series: [
                            {
                                name: 'Data',
                                type: 'pie',
                                radius: '50%', // Adjust the pie chart size
                                data: chartData.series.map(function (value, index) {
                                    return { value: value, name: chartData.xAxis[index] };
                                }), // Map categories (xAxis) to series values
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    },
                                },
                            },
                        ],
                    };
                } else if(result.reporttype === 'horizontal-bar') {
                    // Options for other chart types (e.g., bar, line)
                    option = {
                        title: {
                            text: chartData.title,
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value'
                        },
                        yAxis: {
                            type: 'category',
                            data: chartData.xAxis, // Categories for the chart (e.g., days, months)
                        },
                        series: [
                            {
                                name: 'Data',
                                type: 'bar', // Dynamic chart type
                                data: chartData.series, // Data points for the chart
                            },
                        ],
                    };
                } else {
                    // Options for other chart types (e.g., bar, line)
                    option = {
                        title: {
                            text: chartData.title,
                        },
                        tooltip: {},
                        xAxis: {
                            type: 'category',
                            data: chartData.xAxis, // Categories for the chart (e.g., days, months)
                        },
                        yAxis: {},
                        series: [
                            {
                                name: 'Data',
                                type: result.reporttype, // Dynamic chart type
                                data: chartData.series, // Data points for the chart
                            },
                        ],
                    };
                }

                // Set the options for the chart and render it
                myChart.setOption(option);
            }
            else{
                var tabData = JSON.parse(result.chartData); // This is passed as JSON from the controller
                console.log("Table Data: "+tabData);
                var reptabHtml = getTableHtml(tabData);
                container.innerHTML = reptabHtml;
            }
        }
    });
}


function showLoader() {
    $("#analyticsLoader").fadeIn();
  }

// Hide loader
function hideLoader() {
    $("#analyticsLoader").fadeOut();
}

function renderQueryTableHtml(charType){
    showLoader();
    $.ajax({
        url: "index.php?module=pd_analytics&action=renderQueryTable&sugar_body_only=true",
        type: 'GET',
        success: function(data) {
            var result = JSON.parse(data);
            $('#right-container-inner-content').empty().html(result);
            $("#data-source-menu").hide();
            $('#tab-type').val(charType);
            hideLoader();
            getModulesAndFields();

        }
    });
    return;
}

function getTableHtml(res){
    var tableHtml = "<div id='query-tab'><table class='query-tab'><thead><tr class='query-tab-tr'>";

    // Generate table headers dynamically
    res.headers.forEach(function (header) {
        tableHtml += "<th class='query-tab-th'>" + header + "</th>";
    });
    tableHtml += "</tr></thead><tbody>";

    // Generate table rows dynamically
    res.data.forEach(function (row) {
        tableHtml += "<tr query-tab-tr>";
        row.forEach(function (cell) {
            tableHtml += "<td query-tab-td>" + cell + "</td>";
        });
        tableHtml += "</tr>";
    });

    tableHtml += "</tbody></table></div>";

    return tableHtml;
}



$(document).on('click', '#execute-report-query', function(e) {
    var sqlQuery = $("#sql-query").val().trim();
    var moduleID = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var graph_name = $('#graph-name').val();

    if (graph_name === "") {
        alert("Please enter a graph name.");
        return;
    }

    if (sqlQuery === "") {
        alert("Please enter a SQL query.");
        return;
    }
    
    $.ajax({
        url: "index.php?module=pd_analytics&action=saveModifiedQuery&sugar_body_only=true",
        type: "POST",
        data: { sql_query: sqlQuery,  moduleID: moduleID, moduleName: moduleName, graph_name: graph_name},
        dataType: "json",
        success: function (response) {
            if (response.success) {
                var tabHtml = getTableHtml(response);
                $("#echarts-container").empty().html(tabHtml);
            }
        }
    });
});

$(document).on('click', '#applyfilters', function() {
    var dashboardID = $('#Dashboard-moduleId').val();
    var moduleName = $('#Dashboard-moduleName').val();

    var date_filter_start = $('#dashboard_date_filter_start').val();
    var date_filter_end = $('#dashboard_date_filter_end').val();
    // var filter_field_origin = $('#filter_field_origin').val();
    var dashboard_filter_field_period = $('#dashboard_filter_field_period').val();
    var dashboard_filter_field_user = $('#dashboard_filter_field_user').val();
    var dashboard_filter_period_operator = $('#dashboard_filter_period_operator').val();

    // Prepare filters object dynamically based on field values
    var filters = {};

    // Add date range if both start and end are provided
    if (date_filter_start && date_filter_end) {
        filters.date_range = {
            start: date_filter_start,
            end: date_filter_end,
            logicalOperator: dashboard_filter_period_operator || "AND"
        };
    }

    if (dashboard_filter_field_period && dashboard_filter_field_period != 'Date Range') {
        filters.timeframe = {
            value: dashboard_filter_field_period,
            logicalOperator: dashboard_filter_period_operator || "AND"
        };
    }

    // Add user filter if field and value are provided
    if (dashboard_filter_field_user) {
        filters.user = {
            user_field: 'assigned_user_id',
            user_value: dashboard_filter_field_user,
            logicalOperator: ""
        };
    }
    // Add origin filter if field and value are provided
    // if (filter_field_origin) {
    //     filters.origin = {
    //         origin_field: 'country',
    //         origin_value: filter_field_origin
    //     };
    // }

    // Convert the filters object to a JSON string
    var filtersJson = JSON.stringify(filters);

    // Prepare data to send in AJAX request
    var data = {
        moduleId: dashboardID,
        moduleName: moduleName,
        filter_data: filtersJson
    };

    console.log('Prepared Filters:', filters);
    showLoader();
    var dashboardName = $('#Dashboard-name').val();
    $.ajax({
        url: "index.php?module=pd_analytics&action=saveFilter&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                $('#filter_modal').hide();

                renderDashboard(result,dashboardName,dashboardID);

            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});

$(document).on('change', '#dashboard_filter_field_period', function() {
    // Get the selected value
    var value = $(this).val();

    if( value == 'Date Range'){
        $('#dashboard_date_range').show();
    }else{
        $('#dashboard_date_range').hide();
    }
});


$(document).on('click', '#add_collections', function() {

    $('#new_collection_modal').show();

});

$(document).on('click', '#close_collection_modal', function() {

    $('#new_collection_modal').hide();

});

$(document).on('click', '#create_new_collection', function() {
    var collectionName = $('#new_collection_name').val();

    if (collectionName === "") {
        alert("Please enter a collection name.");
        return;
    }

    var data = {
        collectionName: collectionName,
        moduleName: 'pd_collections'
    };

    $.ajax({
        url: "index.php?module=pd_analytics&action=saveNewCollection&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                $('#new_collection_modal').hide();
                window.location.reload();

            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});

$(document).on('click', '#edit-dashboard', function() {
    var moduleID = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');

    var data = {
        moduleID: moduleID,
        moduleName: moduleName
    };

    $.ajax({
        url: "index.php?module=pd_analytics&action=getDashboardEditView&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                var dashboardLayout = JSON.parse(result.layoutdata);
                renderDashboardEditView(dashboardLayout, result.html, moduleID);

            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});

$(document).on('click', '#add_group', function(e) {
    e.preventDefault(); // Prevent the default form submission
    // Append the new filter row above the button row
    $('.remove_group_logical_operator').addClass('disable-me');
    $("#groups-div").append(createGroup());

    $("#groups-div .group:last #add_fields_logical_operator").addClass('disable-me');

    $('#add_group').addClass('disable-me');

    $("#add_group_logical_operator").show();
    $('#add_group_logical_operator').removeClass('disable-me');
});

function createGroup() {
    const groupId = `group-filter`;
    return `
      <div class="group" id="${groupId}">
        <div class="row">
            <div class="column">
                <span style="float:left; font-size:16px;font-weight:bold;">Group</span>
            </div>
            <div class="column">
                <button class="filter-group-buttons remove_whole_group" id="remove_group" name="Remove Group" value="Remove Group">Remove Group</button>
            </div>
        </div>
        <div class="group-filters">
        </div>
        <div class="row">
            <div class="column">
                <button class="filter-group-buttons all-fields-add-btn" id="add_fields_filter" name="Add Fields Filter" value="Add Fields Filter">Add Fields Filter</button>
                <button class="filter-group-buttons all-fields-add-btn" id="add_time_filter" name="Add Period Filter" value="Add Period Filter">Add Period Filter</button>
                <button class="filter-group-buttons all-fields-add-btn" id="add_user_filter" name="Add User Filter" value="Add User Filter">Add User Filter</button>
                <button class="filter-group-buttons fld-lo-add-btn" id="add_fields_logical_operator" name="Fields Logical Operator" value="Fields Logical Operator">AND/OR Operator</button>
            </div>
        </div>
      </div>
    `;
}

// Remove a group
$(document).on("click", "#remove_group", function () {
    $(this).closest(".group").remove();

    $("#groups-div .remove_group_logical_operator:last").removeClass('disable-me');

    $('#add_group_logical_operator').addClass('disable-me');
    $('#add_group').removeClass('disable-me');
});


/* targets all three fields remove button in a specific group 
   enable all fields add button and disable logical operator add button */
$(document).on('click', '.all-fields-rmv-btn', function(){
    const closestGroupA = $(this).closest('.group');

    closestGroupA.find('.all-fields-add-btn').removeClass('disable-me');
    closestGroupA.find('.fld-lo-add-btn').addClass('disable-me');

    closestGroupA.find(".fld-lo-rmv-btn:last").removeClass('disable-me');
});


/* targets remove button of logical operator between fields in a specific group 
   disable all fields add button and enable logical operator add button */
$(document).on('click', '.fld-lo-rmv-btn', function(){
    const closestGroupB = $(this).closest('.group');

    closestGroupB.find('.all-fields-add-btn').addClass('disable-me');
    closestGroupB.find('.fld-lo-add-btn').removeClass('disable-me');

    closestGroupB.find(".all-fields-rmv-btn:last").removeClass('disable-me');
});


/* targets all three add buttons in a specific group
   disable logical operator remove button */
$(document).on('click', '.all-fields-add-btn', function(){
    const closestGroupC = $(this).closest('.group');
    closestGroupC.find('.fld-lo-rmv-btn').addClass('disable-me');
});


/* targets add button of logical operators for fields in a specific group 
   disable all fields remove button */
$(document).on('click', '.fld-lo-add-btn', function(){
    const closestGroupD = $(this).closest('.group');
    closestGroupD.find('.all-fields-rmv-btn').addClass('disable-me');
});


$(document).on("click", ".remove_filter", function () {
    $(this).closest(".row").remove();
});

$(document).on("click", ".remove_filter_two", function () {
    $(this).closest(".row").prev(".row").remove();
    $(this).closest(".row").remove();
});

$(document).on('click', '#add_fields_filter', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const closestGroup = $(this).closest('.group');
    closestGroup.find('#add_fields_filter, #add_time_filter, #add_user_filter').addClass('disable-me');
    closestGroup.find('#add_fields_logical_operator').removeClass('disable-me');

    // Create a new filter row
    const newFilterRow = `
        <div class="row filter-row">
            <div class="column">
                <label>Field:</label>
                <select class="filter_field drop-zone select-width" name="filter_field_new">
                    ${$("#filter_field option")
                        .map(function () {
                            return `<option value="${$(this).val()}">${$(this).text()}</option>`;
                        })
                        .get()
                        .join("")}
                </select>
            </div>
            <div class="column">
                <label>Operator:</label>
                <select class="filter_operator drop-zone select-width" name="filter_operator_new">
                    <option value="">Select Operator</option>
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="LIKE">LIKE</option>
                </select>
            </div>
            <div class="column">
                <label>Value:</label>
                <input type="text" class="filter_value drop-zone select-width" name="filter_value_new" style="min-height: 67% !important;" placeholder="Enter Value" />
                <button class="filter-group-buttons remove_filter all-fields-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $(this).closest(".group").find(".group-filters").append(newFilterRow);
});

$(document).on('click', '#add_time_filter', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const closestGroup = $(this).closest('.group');
    closestGroup.find('#add_fields_filter, #add_time_filter, #add_user_filter').addClass('disable-me');
    closestGroup.find('#add_fields_logical_operator').removeClass('disable-me');

    // Create a new filter row
    const newFilterRow = `
        <div class="row">
            <div class="column">
                <label>By Period:</label>
                <select id="filter_field_period" name="filter_field_period" class="drop-zone select-width">
                    <option value="All Time">All Time</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 28 Days">Last 28 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="This Year">This Year</option>
                    <option value="Last Month">Last Month</option>
                    <option value="Last Year">Last Year</option>
                    <option value="Date Range">Custom Date Range</option>
                </select>
                <button class="filter-group-buttons field remove_filter all-fields-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
        <div id="custom_date_range" class="row" style="display:none !important;">
            <div class="column">
                <label>Start Date:</label>
                <input type="date" id="date_filter_start" name="date_filter_start" class="drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['start']}" />
            </div>
            <div class="column">
                <label>End Date:</label>
                <input type="date" id="date_filter_end" name="date_filter_end" class="drop-zone select-width" placeholder="Enter Value" value="{$filterData['date_range']['end']}" />
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $(this).closest(".group").find(".group-filters").append(newFilterRow);
});

$(document).on('click', '#add_user_filter', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const closestGroup = $(this).closest('.group');
    closestGroup.find('#add_fields_filter, #add_time_filter, #add_user_filter').addClass('disable-me');
    closestGroup.find('#add_fields_logical_operator').removeClass('disable-me');

    // Create a new filter row
    const newFilterRow = `
        <div class="row">
            <div class="column">
                <label>By User:</label>
                <select id="filter_field_user" name="filter_field_user" class="drop-zone select-width" multiple>
                    ${$(".filter_field_user_dropDown option")
                        .map(function () {
                            return `<option value="${$(this).val()}">${$(this).text()}</option>`;
                        })
                        .get()
                        .join("")}
                </select>
                <button class="filter-group-buttons remove_filter all-fields-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $(this).closest(".group").find(".group-filters").append(newFilterRow);
});

$(document).on('click', '#add_fields_logical_operator', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const closestGroup = $(this).closest('.group');
    closestGroup.find('#add_fields_filter, #add_time_filter, #add_user_filter').removeClass('disable-me');
    closestGroup.find('#add_fields_logical_operator').addClass('disable-me');

    // Create a new filter row
    const newFilterRow = `
        <div class="row">
            <div class="column">
                <label>Logical Operator:</label>
                <select class="filter_logical_operator drop-zone select-width">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
                <button class="filter-group-buttons remove_filter fld-lo-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $(this).closest(".group").find(".group-filters").append(newFilterRow);
});



$(document).on('click', '#add_fields_filter_two', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Create a new filter row
    const newFilterRow = `
        <div class="row">
            <div class="column">
                <label>Logical Operator:</label>
                <select class="filter_logical_operator drop-zone select-width">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
            </div>
        </div>

        <div class="row filter-row">
            <div class="column">
                <label>Field:</label>
                <select class="filter_field drop-zone select-width" name="filter_field_new">
                    ${$("#filter_field option")
                        .map(function () {
                            return `<option value="${$(this).val()}">${$(this).text()}</option>`;
                        })
                        .get()
                        .join("")}
                </select>
            </div>
            <div class="column">
                <label>Operator:</label>
                <select class="filter_operator drop-zone select-width" name="filter_operator_new">
                    <option value="">Select Operator</option>
                    <option value="=">=</option>
                    <option value="!=">!=</option>
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="LIKE">LIKE</option>
                </select>
            </div>
            <div class="column">
                <label>Value:</label>
                <input type="text" class="filter_value drop-zone select-width" name="filter_value_new" style="min-height: 67% !important;" placeholder="Enter Value" />
                <button class="filter-group-buttons remove_filter_two all-fields-rmv-btn" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $(".basic-filters-tab").append(newFilterRow);
});


$(document).on('click', '.remove_group_logical_operator', function(){
    $('#add_group_logical_operator').removeClass('disable-me');
    $('#add_group').addClass('disable-me');
    $("#groups-div .group:last .remove_whole_group").removeClass('disable-me'); 
});



$(document).on('click', '#add_group_logical_operator', function(e) {
    e.preventDefault(); // Prevent the default form submission

    $('.remove_whole_group').addClass('disable-me');

    $('#add_group').removeClass('disable-me');
    $('#add_group_logical_operator').addClass('disable-me');

    // Create a new filter row
    const newFilterRow = `
        <div class="row" style="margin-bottom:2%;">
            <div class="column">
                <label>Logical Operator:</label>
                <select id ="group_logical_operator_select" class="group_logical_operator drop-zone select-width">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
                <button class="filter-group-buttons remove_group_logical_operator remove_filter" name="Remove Filter" value="Remove Filter"> - </button>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $("#groups-div").append(newFilterRow);

});
$(document).on('input', '#searchBar', function(e) {
    const query = $(this).val().toLowerCase();

    $.ajax({
        url: "index.php?module=pd_analytics&action=getModulesAndFields&sugar_body_only=true",
        type: 'GET',
        success: function(data) {
            var result = JSON.parse(data);
            const filteredModules = result.filter(module =>
                module.moduleName.toLowerCase().includes(query)
            );
            renderModules(filteredModules);
        }
    });
});
function getModulesAndFields() {
    $.ajax({
        url: "index.php?module=pd_analytics&action=getModulesAndFields&sugar_body_only=true",
        type: 'GET',
        success: function(data) {
            var result = JSON.parse(data);
            console.log(result);
            renderModules(result);
        }
    });
}

function renderModules(modules) {
    const $modulesList = $('#modulesList');
    const $sqlQuery = $('#sql-query');
    $modulesList.empty(); // Clear the list before re-rendering

    modules.forEach(module => {
        // Create the main module container
        const $moduleItem = $('<div class="dictionary-list-item"></div>');

        // Toggle icon and module name
        const $toggleIcon = $('<span>&#9658;</span>');
        const $moduleName = $('<span></span>').text(module.moduleName).css({
            'cursor': 'pointer',
            'font-weight': 'bold' // Add bold styling
        });

        // Append toggle and name to module item
        $moduleItem.append($toggleIcon).append($moduleName);

        // Create the field list container
        const $fieldsList = $('<ul class="dictionary-fields"></ul>');

        // Populate fields
        module.fields.forEach(field => {
            const $fieldItem = $('<li></li>').text(field);
            $fieldsList.append($fieldItem);

            // Click event for field: Insert into SQL query
            $fieldItem.click(function (e) {
                e.stopPropagation(); // Prevent toggling
                insertIntoQuery(field);
            });
        });

        // Append field list to module item
        $moduleItem.append($fieldsList);

        // Toggle fields on click
        $toggleIcon.click(function (e) {
            e.stopPropagation();
            const isVisible = $fieldsList.is(':visible');
            $fieldsList.slideToggle();
            $toggleIcon.html(isVisible ? '&#9658;' : '&#9660;'); // Change icon
        });

        // Insert module name into SQL query on module name click
        $moduleName.click(function () {
            insertIntoQuery(module.moduleName);
        });

        // Append module item to the container
        $modulesList.append($moduleItem);
    });
}

// Insert text into the SQL query textarea
function insertIntoQuery(text) {
    const $sqlQuery = $('#sql-query');
    const currentQuery = $sqlQuery.val();
    $sqlQuery.val(currentQuery + (currentQuery ? ' ' : '') + text);
}


function renderDashboardEditView(layout,dbhtml,id){
    // $('#right-container-inner-content').empty().html(result);
    showLoader();
    $('#right-container-inner-content').empty().html(dbhtml);
    $('.right-panel').empty().html('');
    let count = 1;
    layout.forEach((item) => {
        const reportID = decodeURIComponent(item.content); // Decode content
        // Create a chart container
        if(reportID !=""){
            var canvasContainer = document.createElement('div');
            canvasContainer.className = 'canvas'; // Add chart-specific styles
            canvasContainer.setAttribute('module-id', ''); // Set empty module-id attribute
            canvasContainer.setAttribute('draggable', 'true'); // Make the div draggable
            canvasContainer.style.width = item.width; // Full width of the column
            canvasContainer.style.height = item.height; // Fixed height for charts

            var canvasContentContainer = document.createElement('div');
            canvasContentContainer.className = 'canvas-content'; // Add chart-specific styles
            canvasContentContainer.setAttribute('module-id', reportID); // Set empty module-id attribute

            var canvasContentContainerRow = document.createElement('div');
            canvasContentContainerRow.className = 'row'; // Add chart-specific styles

            var canvasContentContainercol= document.createElement('div');
            canvasContentContainercol.className = 'col-md-12 col-lg-12 col-xl-12'; // Add chart-specific styles

            var chartContainer = document.createElement('div');
            chartContainer.id = 'echarts-container'+reportID; // Add chart-specific styles
            chartContainer.style.width = "100%"; // Full width of the column
            chartContainer.style.height = "400px"; // Fixed height for charts

            canvasContentContainercol.append(chartContainer);
            canvasContentContainerRow.append(canvasContentContainercol); // Append to your dashboard container
            canvasContentContainer.append(canvasContentContainerRow); // Append to your dashboard container
            canvasContainer.append(canvasContentContainer); // Append to your dashboard container



            // const $innerupperdiv = $('<div>', { class: 'row', css: { 'margin-bottom':'1%','padding-left':'5%', 'padding-right' :'5%'} });
            // const $upperdivinnerone = $('<div>', { class: 'col-md-12 col-lg-12 col-xl-12'});
            // $innerupperdiv.append($upperdivinnerone);


            
            $('.right-panel').append(canvasContainer);
            console.log('Canvas'+canvasContainer);

            getReportsData(chartContainer,reportID,id); 
    
            count++;
        }

    });
    hideLoader();
}

// Search functionality for filtering collections
$(document).on('keyup', '#search-collections', function() {
    var searchText = $(this).val().toLowerCase();

    $('.dashboard-card').each(function() {
        var collectionName = $(this).find('h3').text().toLowerCase();

        // Show or hide cards based on search
        if (collectionName.indexOf(searchText) > -1) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // Show "No data" message if no matches found
    if ($('.dashboard-card:visible').length === 0) {
        if ($('.no-data').length === 0) {
            $('#dashboard-grid-data').append('<p class="no-data">No matching collections found</p>');
        }
    } else {
        $('.no-data').remove();
    }
});