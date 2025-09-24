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
});

$(document).on('click', '#redirectEdit', function() {
    var moduleId = $(this).attr('module-id');
    var moduleName = $(this).attr('module-name');
    var site_url = $('#site_url').val();
    console.log(moduleId);
    console.log(moduleName);

    if (moduleId != '' && moduleName != ''){
        var EditViewUrl = site_url+'/index.php?module=' + moduleName + '&action=EditView&record=' + moduleId;
        console.log(EditViewUrl);
        // Redirect to the detail view
        window.location.href = EditViewUrl;
    }
});