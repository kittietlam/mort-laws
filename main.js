plot(); // add error handling

// Plot line graph
async function plot() {
  const points = await gompertz(0.002, 2);
  let ctx = document.getElementById('chart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: points.xs,
      datasets: [{
          label: 'S₀(t)',
          fill: false,
          borderColor: 'rgb(153, 132, 212)', //rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(153, 132, 212, 0.8)',
          pointRadius: 2,
          data: points.ys
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: false,
      title: {
        display: true,
        text: 'Survival Distribution: Gompertz\'s Law',
        fontSize: 14
      },
      scales: {
        // X-axis options
        xAxes: [{
          scaleLabel:{
            display: true,
            labelString: 'time (t)',
            fontStyle: 'italic'
          },
          ticks: {
            maxRotation: 0,
            autoSkipPadding: 9,
            padding: 5
          }
        }],
        // Y-axis options
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'S₀(t)',
            fontStyle: 'italic'
          },
          ticks: {
            maxTicksLimit: 6,
            beginAtZero: true,
            padding: 5
          }
        }]
      },
      tooltips: {
        backgroundColor: 'white',
        titleFontColor: 'black',
        bodyFontColor: 'black',
        borderColor: 'grey',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              label += Math.round(tooltipItem.yLabel * 100000) / 100000;
              return label;
            },
          title: function(tooltipItem, data) {
            return null;
          }
        }
      },
      hover: {
        animationDuration: 0
      }
    } // ends options
  }) // ends new Chart
}

// Compute data points
async function deMoivre(limit){
  const xs = [];
  const ys = [];
  const freq = 20;
  const cutoff = limit;
  for (let i = 0; i <= freq; i++) {
    let x = i * cutoff / freq;
    let y = (1 - x / cutoff);
    xs.push(x);
    ys.push(y);
  }
  return {xs, ys};
}

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
