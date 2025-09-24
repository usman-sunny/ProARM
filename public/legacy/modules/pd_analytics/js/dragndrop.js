$(document).ready(function() {

  let dragItem = null;

  const reportItems = document.querySelectorAll(".report-item");
  const canvases = document.querySelectorAll(".canvas-content");

  // Make reports draggable
  reportItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
  });

  // Allow dropping into canvases
  canvases.forEach((canvas) => {
    canvas.addEventListener("dragover", dragOver);
    canvas.addEventListener("dragenter", dragEnter);
    canvas.addEventListener("dragleave", dragLeave);
    canvas.addEventListener("drop", dragDrop);
  });

  // Enable canvas dragging
  const canvasHeaders = document.querySelectorAll(".canvas-header");
  canvasHeaders.forEach((header) => {
    header.addEventListener("mousedown", (e) => {
      const canvas = header.parentElement;
      let offsetX = e.clientX - canvas.offsetLeft;
      let offsetY = e.clientY - canvas.offsetTop;

      function mouseMoveHandler(e) {
        canvas.style.position = "absolute";
        canvas.style.left = `${e.clientX - offsetX}px`;
        canvas.style.top = `${e.clientY - offsetY}px`;
      }

      function mouseUpHandler() {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      }

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    });
  });

  // Attach event listener to the "Add New Canvas" button
  document.getElementById("addNewCanvas").addEventListener("click", createNewCanvas);

});

function dragStart(e) {
  dragItem = this;
  const moduleId = this.getAttribute("module-id");
  const moduleName = this.getAttribute("module-name");
  
  // Ensure dataTransfer data is set
  e.dataTransfer.setData("module-id", moduleId);
  e.dataTransfer.setData("module-name", moduleName);
  e.dataTransfer.setData("text/plain", this.innerHTML);
  setTimeout(() => (this.classList.add("invisible")), 0);
}

function dragEnd() {
  this.classList.remove("invisible");
  dragItem = null;
}



function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.style.background = "#f0f0f0";
}

function dragLeave() {
  this.style.background = "#fff";
}

function dragDrop(e) {
    e.preventDefault();
    this.style.background = "#fff";
    const moduleId = e.dataTransfer.getData("module-id");
    const moduleName = e.dataTransfer.getData("module-name");
    var dropdata = {
        'moduleId'             : moduleId,
        'moduleName'           : moduleName,
    };
    this.setAttribute('module-id', dropdata.moduleId);
    // Hide the dragged report item after it's dropped
    if (dragItem) {
      dragItem.style.display = "none"; // Hides the dragged report
    }
    loadReportDetailView(this, dropdata);
}







function loadReportDetailView(canvas, data) {
    console.log("Custom function triggered!");
    console.log("Canvas:", canvas);
    console.log("Module ID:", data);  

    $.ajax({
        url : "index.php?module=pd_analytics&action=getReportsDetailViewDashboard&sugar_body_only=true",
        type : 'POST',
        data : data,
        success : function(response){
            var result = JSON.parse(response);
            console.log(result);
            canvas.innerHTML = result.html;
            const chartContainerId = 'echarts-container-$'+data.moduleId;
            console.log(chartContainerId);
            const chartContainer = document.getElementById(chartContainerId);
            if(result.reporttype != 'tabular'){
              var myChart = echarts.init(chartContainer); // Select the container using jQuery

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
              console.log(tabData);
              var reptabHtml = getTableHtml(tabData);
              chartContainer.innerHTML = reptabHtml;
            }
        }
    });
  }

// Function to create a new draggable canvas
function createNewCanvas() {
  const newCanvas = document.createElement("div");
  newCanvas.className = "canvas";
  newCanvas.setAttribute("module-id", "");
  newCanvas.setAttribute("draggable", "true");

  const newCanvasContent = document.createElement("div");
  newCanvasContent.className = "canvas-content";
  newCanvasContent.setAttribute("module-id", "");
  newCanvasContent.innerHTML = "Drop reports here";

  newCanvas.appendChild(newCanvasContent);

  // Add drag and drop event listeners
  newCanvasContent.addEventListener("dragover", dragOver);
  newCanvasContent.addEventListener("dragenter", dragEnter);
  newCanvasContent.addEventListener("dragleave", dragLeave);
  newCanvasContent.addEventListener("drop", dragDrop);

  // Append the new canvas to the right panel
  document.querySelector(".right-panel").appendChild(newCanvas);
}

