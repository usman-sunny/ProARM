$(document).ready(function () {
    console.log('reportsData:', reportsData);

    // Parse the top-level reportsData array
    var ReportData = JSON.parse(reportsData);

    // Select the dashboard container
    var dashboard = document.getElementById('dashboard');

    // Iterate through the reportsData array
    ReportData.forEach(function (report) {
        try {
            // Parse the chart_data field
            var chartData = JSON.parse(report.chart_data.replace(/\\/g, ''));
            console.log('Chart Data:', chartData);

            // Create a column div
            var colDiv = document.createElement('div');
            colDiv.className = 'col-md-6'; // Adjust column size (6 for 2 per row, 4 for 3 per row)

            // Create a chart container
            var chartContainer = document.createElement('div');
            chartContainer.id = 'chart-' + report.id; // Unique container ID
            chartContainer.className = 'chart-container'; // Add chart-specific styles
            chartContainer.style.width = '100%'; // Full width of the column
            chartContainer.style.height = '400px'; // Fixed height for charts

            // Append chart container to column
            colDiv.appendChild(chartContainer);

            // Append column to dashboard row
            dashboard.appendChild(colDiv);

            // Initialize the chart
            var myChart = echarts.init(chartContainer);

            // Define chart options dynamically based on report type
            var option;

            if (report.report_type === 'pie') {
                // Options for pie chart
                option = {
                    title: {
                        text: chartData.title,
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)',
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: 'Data',
                            type: 'pie',
                            radius: '50%', // Adjust pie radius
                            data: chartData.series.map(function (value, index) {
                                return { value: value, name: chartData.xAxis[index] };
                            }),
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
            } else if(report.report_type === 'horizontal-bar') {
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
                // Options for other chart types (line, bar, etc.)
                option = {
                    title: {
                        text: chartData.title,
                        left: 'center',
                    },
                    tooltip: {},
                    xAxis: {
                        type: 'category',
                        data: chartData.xAxis,
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name: 'Data',
                            type: report.report_type, // Dynamic report type
                            data: chartData.series,
                        },
                    ],
                };
            }

            // Set the chart options
            myChart.setOption(option);
        } catch (e) {
            console.error('Error parsing chart_data for report ID:', report.id, e);
        }
    });
});
