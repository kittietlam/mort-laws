Chart.defaults.global.elements.point.radius = 2;
Chart.defaults.global.elements.line.fill = false;

// checks if all inputs are filled, returns parameters if valid
function incomplete(inputs) {
  let incomplete = false;
  inputs.forEach((input) => {
    if (input.value.trim() == '') incomplete = true;
  });
  return incomplete;
}

// template for line chart
function newLineChart(canvasID, datasets) {
  let ctx = document.getElementById(canvasID).getContext('2d');
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // X data
      datasets: datasets // Y data: data, label, fill, borderColor, pointRadius, backgroundColor
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        labels:{ boxWidth:15 }
      },
      title: { display: true, text: '', fontSize: 14, fontColor:'#555'},
      hover: { animationDuration: 0 },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: '', fontStyle: 'italic' },
          ticks: {
            maxRotation: 0, autoSkipPadding: 9, padding: 5,
            callback: function(n) { if (Number.isInteger(n)) return n; } // CUSTOMIZE
          },
          gridLines: { display: false }
        }],
        yAxes: [{
          scaleLabel: { display: true, labelString: '', fontStyle: 'italic'},
          ticks: { maxTicksLimit: 6, beginAtZero: true, padding: 5 } // CUSTOMIZE
        }]
      },
      tooltips: {
        backgroundColor: 'white',
        titleFontColor: 'black',
        bodyFontColor: 'black',
        borderColor: 'grey', borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: function(tooltipItem, data) { return null; },
        }
      }
    } // ends options
  });
  return chart;
}
