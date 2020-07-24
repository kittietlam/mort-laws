let chart = loadChart();
const form = document.getElementById('form');
const xField = document.getElementById('x');
const bField = document.getElementById('b');
const cField = document.getElementById('c');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let x = xField.value.trim();
  let b = bField.value.trim();
  let c = cField.value.trim();
  if (validate(x, b, c)) {
    updateChart(chart, b, c);
  }
});

// Create blank chart object
function loadChart() {
  let ctx = document.getElementById('chart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // X-DATA
      datasets: [] // Y-DATA: data, label, fill, borderColor, pointRadius, backgroundColor
    },
    options: {
      maintainAspectRatio: false,
      legend: false,
      title: { display: true, text: 'Survival Function: Gompertz\'s Law', fontSize: 14 },
      hover: { animationDuration: 0 },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'time (t)', fontStyle: 'italic' },
          ticks: { maxRotation: 0, autoSkipPadding: 9, padding: 5 },
          gridLines: { display: false }
        }],
        yAxes: [{
          scaleLabel: { display: true, labelString: 'Sₓ(t)', fontStyle: 'italic'},
          ticks: { maxTicksLimit: 6, beginAtZero: true, padding: 5 }
        }]
      },
      tooltips: {
        backgroundColor: 'white',
        titleFontColor: 'black',
        bodyFontColor: 'black',
        borderColor: 'grey', borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(tooltipItem, data) {
              return 'Sₓ(' + tooltipItem.xLabel + '): ' + Math.round(tooltipItem.yLabel * 100000) / 100000;
          },
          title: function(tooltipItem, data) { return null; }
        }
      }
    } // ends options
  });
  return chart;
}

// function to validate input
function validate(x, b, c) {
  let valid = true;
  if (x == '' || b == '' || c == ''){
    valid = false;
  } else {
    if (isNaN(x) || parseFloat(x) < 0) {
      valid = false;
      alert('Error: X must be a numeric value greater than or equal to 0');
    }
    if (isNaN(b) || parseFloat(b) <= 0) {
      valid = false;
      alert('Error: B must be a numeric value greater than 0');
    }
    if (isNaN(c) || parseFloat(c) <= 1) {
      valid = false;
      alert('Error: C must be a numeric value greater than 1');
    }
  }
  return valid;
}

// update data points in chart - takes chart object as input
function updateChart(chart, b, c){
  let points = gompertz(b, c);
  let labels = points.xs; // X DATA
  let dataset = {
    data: points.ys, // Y DATA
    label: 'Gompertz',
    fill: false,
    pointRadius: 2,
    borderColor: 'rgb(153, 132, 212)',
    pointBackgroundColor: 'rgb(153, 132, 212, 0.8)'
  };
  chart.data.labels = labels;
  chart.data.datasets[0] = dataset;
  chart.update();
}

//data point calculation
function gompertz(b, c) {
  const xs = [];
  const ys = [];
  let cutoff = 0;
  let i = 1;
  while (i > 0.001) {
    cutoff+= 5;
    i = Math.exp(-b * (c ** cutoff - 1) / Math.log(c));
  }

  for (let x = 0; x <= cutoff; x++) {
    let y = Math.exp(-b * (c ** x - 1) / Math.log(c));
    xs.push(x);
    ys.push(y);
  }
  return {xs, ys};
}
