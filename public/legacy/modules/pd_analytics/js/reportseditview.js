$(document).ready(function () {

    $('#graph-btn').on('click', function() {
        // Hide all tab contents
        $('.tab-content').hide();
        
        // Remove 'active' class from all tabs
        $('#filter-btn').removeClass('active');
        
        // Show the selected tab content and add 'active' class
        $('#graphTab').show();
        $(this).addClass('active');

        $('#ba-btns').hide();
        $('.basic-filters').hide();

    });


    $('#filter-btn').on('click', function() {
        // Hide all tab contents
        $('.tab-content').hide();
        
        // Remove 'active' class from all tabs
        $('#graph-btn').removeClass('active');
        
        // Show the selected tab content and add 'active' class
        $(this).addClass('active');

        $('#ba-btns').show();
        $('.basic-filters').show();

        $('.basic-btn').addClass('active');
        $('.advance-btn').removeClass('active');

    });


    $('.basic-btn').on('click', function() {
        $(this).addClass('active');
        $('.advance-btn').removeClass('active');

        $('#filtersTab').hide();
        $('.basic-filters').show();
        $('#filter_type').val('basic');

        $(this).addClass('active');
        $('.advance-btn').removeClass('active');
    });


    $('.advance-btn').on('click', function() {
        $(this).addClass('active');
        $('.basic-btn').removeClass('active');
        $('#filter_type').val('advance');

        $('#filtersTab').show();
        $('.basic-filters').hide();

        $(this).addClass('active');
        $('.basic-btn').removeClass('active');
    });


    localStorage.clear();
    sessionStorage.clear();
    
    if(reportType != 'tabular'){
        // Initialize the chart container using jQuery
        var myChart = echarts.init($('#echarts-container')[0]); // Select the container using jQuery

        // Get chart data passed from the controller
        var chartData = JSON.parse(charD); // This is passed as JSON from the controller
        console.log(chartData);

        // Define chart options dynamically based on `reportType`
        var option;

        if (reportType === 'pie') {
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
        } else if(reportType === 'horizontal-bar') {
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
                        type: reportType, // Dynamic chart type
                        data: chartData.series, // Data points for the chart
                    },
                ],
            };
        }

        // Set the options for the chart and render it
        myChart.setOption(option);
    }
    else{
        // Get chart data passed from the controller
        var tabData = JSON.parse(charD); // This is passed as JSON from the controller
        console.log(tabData);
        var reptabHtml = getTableHtml(tabData);
        $('#echarts-container').html(reptabHtml);
    }
});

$(document).on('click', '#redirectDetail', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var site_url = $('#site_url').val();
    console.log(moduleId);
    console.log(moduleName);

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
                    $('#right-container-inner-content').empty().html(result);
                }
            });       
        }else{
            var DetailViewUrl = site_url+'/index.php?module=' + moduleName + '&action=DetailView&record=' + moduleId;
            console.log(DetailViewUrl);
            // Redirect to the detail view
            window.location.href = DetailViewUrl;
        }
    }
});

$(document).on('click', '#saveReport', function() {
    // Get the selected value
    var xAxisVal = $('#x-axis').val();
    var yAxisVal = $('#y-axis').val();
    var xAxisAggregateVal = $('#x-axis-aggregate').val();
    var yAxisAggregateVal = $('#y-axis-aggregate').val();
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var graphName = $('#graph-name').val();
 
    if (graphName === "") {
        alert("Please enter a name!");
        return;
    }
            
    // Log the selected value to the console (you can replace this with your custom action)
    var data = {
        'x-axis'               : xAxisVal,
        'y-axis'               : yAxisVal,
        'x-axis-aggregate'     : xAxisAggregateVal,
        'y-axis-aggregate'     : yAxisAggregateVal,
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
        'graphName'            : graphName,
    };
    console.log('Selected Collection: ' + data);
    showLoader();
    $.ajax({
        url : "index.php?module=pd_analytics&action=generateReports&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(response){
            var result = JSON.parse(response);
            console.log(result);
            if(result.success){
                hideLoader();
                var editViewData = {
                    'moduleId'             : moduleId,
                    'moduleName'           : moduleName,
                };
                loadEditView(editViewData);
            }
            // $('#dashboard-grid-data').empty().html(result);
        }
    });
});

$(document).on('click', '.type-button', function() {
    // Get the selected value
    var reportType = $(this).attr('report-type');
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');

            
    // Log the selected value to the console (you can replace this with your custom action)
    var data = {
        'reportType'           : reportType,
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
    };
    console.log('Selected Collection: ' + data);
    showLoader();
    $.ajax({
        url : "index.php?module=pd_analytics&action=changeReportType&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(response){
            var result = JSON.parse(response);
            console.log(result);
            if(result.success){
                hideLoader();
                var editViewData = {
                    'moduleId'             : moduleId,
                    'moduleName'           : moduleName,
                };
                loadEditView(editViewData);
            }
            // $('#dashboard-grid-data').empty().html(result);
        }
    });
});

$(document).on('click', '#reset_chart', function() {
    // Get the selected value
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');

            
    // Log the selected value to the console (you can replace this with your custom action)
    var data = {
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
    };
    console.log('Selected Collection: ' + data);
    showLoader();
    $.ajax({
        url : "index.php?module=pd_analytics&action=reset_charts&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(response){
            var result = JSON.parse(response);
            console.log(result);
            if(result.success){
                hideLoader();
                var editViewData = {
                    'moduleId'             : moduleId,
                    'moduleName'           : moduleName,
                };
                loadEditView(editViewData);
            }
            // $('#dashboard-grid-data').empty().html(result);
        }
    });
});


$(document).on('click', '#apply_filters', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var filterType = $('#filter_type').val();
    var filters = [];

    if(filterType == 'advance'){
    // Iterate over each group to capture its filters and logical operators
    $('#groups-div .group').each(function(index, group) {
        var groupFilters = [];
        var groupLogicalOperator = $(group).next().find('#group_logical_operator_select').val();

        // Capture field filters within the group
        $(group).find('.filter-row').each(function(idx, filterRow) {
            var field = $(filterRow).find('.filter_field').val();
            var operator = $(filterRow).find('.filter_operator').val();
            var value = $(filterRow).find('.filter_value').val();
            var logicalOperator = $(filterRow).next().find('.filter_logical_operator').val();

            if (field && operator && value) {
                groupFilters.push({
                    field: field,
                    operator: operator,
                    value: value,
                    fieldlogicalOperator: logicalOperator
                });
            }
        });

        // Capture date range filter within the group
        var dateFilterStart = $(group).find('#date_filter_start').val();
        var dateFilterEnd = $(group).find('#date_filter_end').val();
        var dateLogicalOperator = $(group).find('.filter_logical_operator').val();

        if (dateFilterStart && dateFilterEnd) {
            groupFilters.push({
                field: "date_range",
                operator: "BETWEEN",
                value: { start: dateFilterStart, end: dateFilterEnd },
                fieldlogicalOperator: dateLogicalOperator
            });
        }

        // Capture period filter within the group
        var filterFieldPeriod = $(group).find('#filter_field_period').val();
        var periodLogicalOperator = $(group).find('.filter_logical_operator').val();
        if (filterFieldPeriod && filter_field_period != 'Date Range') {
            groupFilters.push({
                field: "timeframe",
                operator: "=",
                value: filterFieldPeriod,
                fieldlogicalOperator: periodLogicalOperator
            });
        }

        // Capture user filter within the group
        var filterFieldUser = $(group).find('#filter_field_user').val();
        var userLogicalOperator = $(group).find('.filter_logical_operator').val();

        if (filterFieldUser) {
            groupFilters.push({
                field: "user",
                operator: "IN",
                value: filterFieldUser,
                fieldlogicalOperator: userLogicalOperator
            });
        }

        filters.push({
            filters: groupFilters,
            grouplogicalOperator: groupLogicalOperator
        });
    });
    }
    else{
        $('#basic-filters-tab-unq').each(function(index, group) {
            var groupFilters = [];
            var groupLogicalOperator = $(group).next().find('#group_logical_operator_select').val();
    
            // Capture date range filter within the group
            var dateFilterStart = $(group).find('#date_filter_start').val();
            var dateFilterEnd = $(group).find('#date_filter_end').val();
            var dateLogicalOperator = $(group).find('.filter_logical_operator_period').val();
    
            if (dateFilterStart && dateFilterEnd) {
                groupFilters.push({
                    field: "date_range",
                    operator: "BETWEEN",
                    value: { start: dateFilterStart, end: dateFilterEnd },
                    fieldlogicalOperator: dateLogicalOperator
                });
            }
    
            // Capture period filter within the group
            var filterFieldPeriod = $(group).find('#filter_field_period').val();
            var periodLogicalOperator = $(group).find('.filter_logical_operator_period').val();
            if (filterFieldPeriod && filterFieldPeriod != 'Date Range' && filterFieldPeriod != 'All Time') {
                groupFilters.push({
                    field: "timeframe", 
                    operator: "=",
                    value: filterFieldPeriod,
                    fieldlogicalOperator: periodLogicalOperator
                });
            }
    
            // Capture user filter within the group
            var filterFieldUser = $(group).find('#filter_field_user').val();
            var userLogicalOperator = $(group).find('.filter_logical_operator_user').val();
    
            if (filterFieldUser && filterFieldUser != '') {
                groupFilters.push({
                    field: "user",
                    operator: "IN",
                    value: filterFieldUser,
                    fieldlogicalOperator: userLogicalOperator
                });
            }
            // Capture field filters within the group
            $(group).find('.filter-row').each(function(idx, filterRow) {
                var field = $(filterRow).find('.filter_field').val();
                var operator = $(filterRow).find('.filter_operator').val();
                var value = $(filterRow).find('.filter_value').val();
                var logicalOperator = $(filterRow).next().find('.filter_logical_operator').val();
    
                if (field && operator && value) {
                    groupFilters.push({
                        field: field,
                        operator: operator,
                        value: value,
                        fieldlogicalOperator: logicalOperator
                    });
                }
            });

            filters.push({
                filters: groupFilters,
                grouplogicalOperator: groupLogicalOperator
            });
        });
    }
    // Prepare filters object for AJAX
    var filtersJson = JSON.stringify(filters);
    var data = {
        moduleId: moduleId,
        moduleName: moduleName,
        filter_data: filtersJson,
        filterType : filterType,
    };

    console.log('Prepared Filters:', filters);
    showLoader();

    $.ajax({
        url: "index.php?module=pd_analytics&action=saveFilter&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                if (result.success) {
                    hideLoader();
                    var editViewData = {
                        moduleId: moduleId,
                        moduleName: moduleName
                    };
                    loadEditView(editViewData);
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});


$(document).on('click', '#clear_filters', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');

    // Prepare data to send in AJAX request
    var data = {
        moduleId: moduleId,
        moduleName: moduleName,
    };

    console.log('Prepared Filters:', data);
    showLoader();

    $.ajax({
        url: "index.php?module=pd_analytics&action=clearFilter&sugar_body_only=true",
        type: 'POST',
        data: data,
        success: function(response) {
            try {
                var result = JSON.parse(response);
                console.log(result);
                if (result.success) {
                    hideLoader();
                    var editViewData = {
                        moduleId: moduleId,
                        moduleName: moduleName
                    };
                    loadEditView(editViewData);
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }
        }
    });
});

function showLoader() {
    $("#analyticsLoader").fadeIn();
  }

// Hide loader
function hideLoader() {
    $("#analyticsLoader").fadeOut();
}

function loadEditView(data){
    localStorage.clear();
    sessionStorage.clear();
    $.ajax({
        url : "index.php?module=pd_analytics&action=getReportsEditView&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            $('#right-container-inner-content').empty().html(result);
            getModulesAndFields();
        }
    });
}

// $(document).on('focusout', '#graph-name', function() {
//     // Get the selected value
//     var reportName = $(this).val();
//     var moduleId = $(this).attr('module-id');
//     var moduleName = $(this).attr('module-name');

            
//     // Log the selected value to the console (you can replace this with your custom action)
//     var data = {
//         'reportName'           : reportName,
//         'moduleId'             : moduleId,
//         'moduleName'           : moduleName,
//     };
//     console.log('Selected Collection: ' + data);
//     showLoader();
//     $.ajax({
//         url : "index.php?module=pd_analytics&action=changeFieldData&sugar_body_only=true",
//         type : 'POST',
//         data : data,
//         success : function(response){
//             var result = JSON.parse(response);
//             console.log(result);
//             if(result.success){
//                 hideLoader();
//             }
//             // $('#dashboard-grid-data').empty().html(result);
//         }
//     });
// });

$(document).on('change', '#filter_field_period', function() {
    // Get the selected value
    var value = $(this).val();

    if( value == 'Date Range'){
        $('#custom_date_range').show();
    }else{
        $('#custom_date_range').hide();
    }
});

$(document).on('change', '.filter_field', function() {
    // Get the selected value
    var filterField = $(this).val();
    var moduleId = $('#redirectDetail').attr('module-id');
    var moduleName = $('#redirectDetail').attr('module-name');

    let select_operator = $(this).closest('.column').next().find('.filter_operator');
    let next_field = $(this).closest('.column').next().next().find('.filter_value');

            
    // Log the selected value to the console (you can replace this with your custom action)
    var data = {
        'filterField'          : filterField,
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
    };
    console.log('Selected Collection: ' + data);
    $.ajax({
        url : "index.php?module=pd_analytics&action=getFieldType&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            if(result.success){
                appendOperatorsByFieldType(result.fieldType, select_operator, next_field);
            }
        }
    });
});

$(document).on('click', '#addNewFieldFilter', function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Create a new filter row
    const newFilterRow = `
        <div class="row filter-row">
            <div class="column">
                <label>Field:</label>
                <select class="filter_field drop-zone select-width" name="filter_field_new">
                    <option value="">Select Y-Axis</option>
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
                <input type="text" class="filter_value drop-zone select-width" name="filter_value_new" style="min-height: 50% !important;" placeholder="Enter Value" />
            </div>
            <div class="column">
                <label>Logical Operator:</label>
                <select class="filter_logical_operator drop-zone select-width">
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>
            </div>
        </div>
    `;

    // Append the new filter row above the button row
    $("#fieldFiltersContainer").append(newFilterRow);
});

function appendOperatorsByFieldType(fieldType, select_operator, next_field) {
    const operatorMap = {
        'varchar': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'like', label: 'Contains' },
            { value: 'not_like', label: 'Does Not Contain' },
            { value: 'starts_with', label: 'Starts With' },
            { value: 'ends_with', label: 'Ends With' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'text': [
            { value: 'like', label: 'Contains' },
            { value: 'not_like', label: 'Does Not Contain' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'int': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'greater_than', label: 'Greater Than' },
            { value: 'less_than', label: 'Less Than' },
            { value: 'greater_or_equal', label: 'Greater or Equal' },
            { value: 'less_or_equal', label: 'Less or Equal' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'decimal': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'greater_than', label: 'Greater Than' },
            { value: 'less_than', label: 'Less Than' },
            { value: 'greater_or_equal', label: 'Greater or Equal' },
            { value: 'less_or_equal', label: 'Less or Equal' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'date': [
            { value: 'on', label: 'On' },
            { value: 'before', label: 'Before' },
            { value: 'after', label: 'After' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'datetime': [
            { value: 'on', label: 'On' },
            { value: 'before', label: 'Before' },
            { value: 'after', label: 'After' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'enum': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'bool': [
            { value: 'is_true', label: 'True' },
            { value: 'is_false', label: 'False' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'relate': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ],
        'id': [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'is_empty', label: 'Is Empty' },
            { value: 'is_not_empty', label: 'Is Not Empty' }
        ]
    };

    // Default operators if field type not recognized
    const defaultOperators = [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' }
    ];

    // Get the appropriate operators
    const operators = operatorMap[fieldType] || defaultOperators;

    // Clear and append options
    select_operator.empty(); // Clear existing options

    $.each(operators, function (index, op) {
        select_operator.append($('<option>', {
            value: op.value,
            text: op.label
        }));
    });

    if(fieldType == 'date' || fieldType == 'datetime')
    {
        next_field.attr('type', 'date');
    }
}