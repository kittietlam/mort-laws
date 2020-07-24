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
    updateChart(chart, parseFloat(x), parseFloat(b), parseFloat(c));
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
      title: { display: true, text: '', fontSize: 14 },
      hover: { animationDuration: 0 },
      scales: {
        xAxes: [{
          scaleLabel: { display: true, labelString: 'time (t)', fontStyle: 'italic' },
          ticks: {
            maxRotation: 0, autoSkipPadding: 9, padding: 5,
            callback: function(n) { if (Number.isInteger(n)) return n; }
          },
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
function updateChart(chart, x, b, c){
  let points = gompertz(x, b, c);
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

// Gompertz calculation
function gompertz(currAge, b, c) {
  const xs = [];
  const ys = [];
  let t = 0;
  let y;
  let cutoff = 5;
  let d = cGompertz(currAge, b, c);
  while (t <= cutoff) {
    if (d === 0) {
      if (t === 0) y = 1;
      else y = 0;
    } else {
      y = cGompertz(currAge + t, b, c) / d;
    }
    xs.push(t);
    ys.push(y);
    t += 0.5;
    if (t === cutoff && y > 0.001) cutoff += 5;
  }
  return {xs, ys};
}

function cGompertz(x, b, c) {
  return Math.exp(-b * (c ** x - 1) / Math.log(c));
}

// De Moivre calculation currAge < limit
function deMoivre(currAge, limit) {
  const xs = [];
  const ys = [];
  let t = 0;
  while (currAge + t <= limit) {
    let y = (limit - currAge - t) / (limit - currAge);
    xs.push(t);
    ys.push(y);
    t++;
  }
  return {xs, ys};
}
