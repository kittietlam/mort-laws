// this file contains javascript for loading the chart and forms
let chart = loadChart();
const forms = document.querySelectorAll('form');
const INCREMENT = 0.5;

forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputs = form.querySelectorAll('input');
    let result = {};
    if (!incomplete(inputs)) {
      result = validate(form);
    }
    if (result.isValid) {
      let index = parseFloat(result.id.slice(-1)) - 1; // get index in parameters
      updateChart(result);
    }
  });
});

// checks if all inputs are filled, returns parameters if valid
function incomplete(inputs) {
  let incomplete = false;
  inputs.forEach((input) => {
    if (input.value.trim() == '') incomplete = true;
  });
  return incomplete;
}

// checks user input parameters
function validate(form) {
  let result = { isValid:true, id:form.id };

  // check if current age is valid
  let x = form.querySelector('.x').value;
  if (isNaN(x) || parseFloat(x) < 0) {
    alert('Error: X must be a number greater than or equal to 0');
    result.isValid = false;
    return result;
  } else { result.x = parseFloat(x); }

  // check other inputs
  let y;
  switch (form.id) {
    case 'form1':
      y = document.getElementById('lim').value;
      if (isNaN(y) || parseFloat(y) < result.x) {
        alert('Error: ω must be a number greater than X');
        result.isValid = false;
      } else { result.lim = parseFloat(y); }
      break;

    case 'form2':
      y = document.getElementById('b2').value;
      if (isNaN(y) || parseFloat(y) <= 0) {
        alert('Error: B must be a number greater than 0');
        result.isValid = false;
      } else { result.b = parseFloat(y); }
      y = document.getElementById('c2').value;
      if (isNaN(y) || parseFloat(y) <= 1) {
        alert('Error: C must be a number greater than 1');
        result.isValid = false;
      } else { result.c = parseFloat(y); }
      break;

    case 'form3':
      y = document.getElementById('b3').value;
      if (isNaN(y) || parseFloat(y) <= 0) {
        alert('Error: B must be a number greater than 0');
        result.isValid = false;
        return result;
      } else { result.b = parseFloat(y); }
      let temp = y;
      y = document.getElementById('a3').value;
      if (isNaN(y) || parseFloat(y) < -temp) {
        alert('Error: A must be a number greater than or equal to -B');
        result.isValid = false;
      } else { result.a = parseFloat(y); }
      y = document.getElementById('c3').value;
      if (isNaN(y) || parseFloat(y) <= 1) {
        alert('Error: C must be a number greater than 1');
        result.isValid = false;
      } else { result.c = parseFloat(y); }
      break;

    case 'form4':
      y = document.getElementById('k4').value;
      if (isNaN(y) || parseFloat(y) <= 0) {
        alert('Error: k must be a number greater than 0');
        result.isValid = false;
      } else { result.k = parseFloat(y); }
      y = document.getElementById('n4').value;
      if (isNaN(y) || parseFloat(y) <= -1) {
        alert('Error: n must be a number greater than -1');
        result.isValid = false;
      } else { result.n = parseFloat(y); }
      break;

    case 'form5':
      y = document.getElementById('mu5').value;
      if (isNaN(y) || parseFloat(y) < 0) {
        alert('Error: μ must be a number greater than or equal to 0');
        result.isValid = false;
      } else { result.mu = parseFloat(y); }
      break;
  }
  return result;
}

// add a line to the chart
function updateChart(param){
  let dataPoints;
  switch (param.id) {
    case "form1":
      dataPoints = deMoivre(param.x, param.lim, INCREMENT);
      break;
    case "form2":
      dataPoints = gompertz(param.x, param.b, param.c, INCREMENT);
      break;
    case "form3":
      dataPoints = makeham(param.x, param.a, param.b, param.c, INCREMENT);
      break;
    case "form4":
      dataPoints = weibull(param.x, param.k, param.n, INCREMENT);
      break;
    case "form5":
      dataPoints = constForce(param.mu, INCREMENT);
      break;
  }
  // update Y-values
  let i = parseFloat(param.id.slice(-1)) - 1;
  chart.data.datasets[i] = {
    fill: false,
    pointRadius: 2,
    label: chart.data.datasets[i].label,
    data: dataPoints.yData, // Y DATA
    borderColor: dataPoints.borderColor,
    pointBackgroundColor: dataPoints.pointBackgroundColor
  };
  // update X-values
  let maxDataPoints = 0;
  chart.data.datasets.forEach(set => {
    if (set.data.length > maxDataPoints)
      maxDataPoints = set.data.length;
  });
  let lastX;
  while (maxDataPoints > chart.data.labels.length){
    lastX = INCREMENT * (chart.data.labels.length - 1);
    chart.data.labels.push(lastX + INCREMENT);
  }
  while (maxDataPoints < chart.data.labels.length) {
    chart.data.labels.pop();
  }
  chart.update();
}

// Create blank chart object
function loadChart() {
  let ctx = document.getElementById('chart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // X-DATA
      datasets: [{ label:'De Moivre' },{ label:'Gompertz' },{ label:'Makeham' },{ label:'Weibull' },{ label:'Constant Force'}]
      // Y-DATA: data, label, fill, borderColor, pointRadius, backgroundColor
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        labels:{ boxWidth:15 }
      },
      title: { display: true, text: 'Survival Function vs. Time', fontSize: 14, fontColor:'#555'},
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
