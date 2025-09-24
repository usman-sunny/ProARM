$(document).ready(function () {
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


    function toggleCreateReportButton() {
        const xAxis = $('#x-axis').val();
        const yAxis = $('#y-axis').val();
        const xAxisAggregate = $('#x-axis-aggregate').val();
        const yAxisAggregate = $('#y-axis-aggregate').val();

        if (xAxis && yAxis && xAxisAggregate && yAxisAggregate) {
            $('#saveReport').show();
        } else {
            $('#saveReport').hide();
        }
    }

    $('#x-axis').change(function () {
        if ($(this).val()) {
            $('#x-axis-aggregate-container').show();
        } else {
            $('#x-axis-aggregate-container').hide();
        }
        toggleCreateReportButton();
    });

    $('#y-axis').change(function () {
        if ($(this).val()) {
            $('#y-axis-aggregate-container').show();
        } else {
            $('#y-axis-aggregate-container').hide();
        }
        toggleCreateReportButton();
    });

    $('#x-axis-aggregate, #y-axis-aggregate').change(function () {
        toggleCreateReportButton();
    });

});

$(document).on('click', '#redirectDetail', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var site_url = $('#site_url').val();
    console.log(moduleId);
    console.log(moduleName);

    if (moduleId != '' && moduleName != ''){
        var DetailViewUrl = site_url+'/index.php?module=' + moduleName + '&action=DetailView&record=' + moduleId;
        console.log(DetailViewUrl);
        // Redirect to the detail view
        window.location.href = DetailViewUrl;
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
        url : "index.php?module=pd_reports&action=generateReports&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            if(result.success){
                hideLoader();
                window.location.reload();
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
        url : "index.php?module=pd_reports&action=changeReportType&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(data){
            var result = JSON.parse(data);
            console.log(result);
            if(result.success){
                hideLoader();
                window.location.reload();
            }
            // $('#dashboard-grid-data').empty().html(result);
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