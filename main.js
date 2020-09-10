const INCREMENT = 0.5;

let set = [
  { label:'De Moivre', borderColor:'rgb(255, 92, 92)', pointBackgroundColor:'rgb(255, 92, 92, 0.8)'},
  { label:'Gompertz', borderColor:'rgb(54, 162, 235)', pointBackgroundColor:'rgb(54, 162, 235, 0.8)'},
  { label:'Makeham', borderColor:'rgb(255, 206, 86)', pointBackgroundColor:'rgb(255, 206, 86, 0.8)'},
  { label:'Weibull', borderColor:'rgb(75, 192, 192)', pointBackgroundColor:'rgb(75, 192, 192, 0.8)'},
  { label:'Constant Force', borderColor:'rgb(153, 102, 255)', pointBackgroundColor:'rgb(153, 102, 255, 0.8)'}
];

// create line chart
let chart = newLineChart('chart', set);
let op = chart.options;
op.title.text = 'Survival Function vs. Time';
op.scales.xAxes[0].scaleLabel.labelString = 'time (t)';
op.scales.yAxes[0].scaleLabel.labelString = 'Sₓ(t)';
op.tooltips.callbacks.label = function (tooltipItem, data) {
  return 'Sₓ(' + tooltipItem.xLabel + '): ' + Math.round(tooltipItem.yLabel * 100000) / 100000;
}

// add event listeners to forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.autocomplete = 'off';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputs = form.querySelectorAll('input');
    let result = {};
    if (!incomplete(inputs)) {
      result = validate(form);
    }
    if (result.isValid) {
      updateChart(result);
    }
  });
});

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
      dataPoints = deMoivre(param.x, param.lim);
      break;
    case "form2":
      dataPoints = gompertz(param.x, param.b, param.c);
      break;
    case "form3":
      dataPoints = makeham(param.x, param.a, param.b, param.c);
      break;
    case "form4":
      dataPoints = weibull(param.x, param.k, param.n);
      break;
    case "form5":
      dataPoints = constForce(param.mu);
      break;
  }

  // update Y-values
  let i = parseFloat(param.id.slice(-1)) - 1;
  chart.data.datasets[i].data = dataPoints;

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

// ----------------------------------
// BELOW: FUNCTIONS FOR CALCULATIONS

// De Moivre calculation x < limit
function deMoivre(x, limit) {
  const dataPoints = [];
  let t = 0;
  while (x + t <= limit) {
    let y = (limit - x - t) / (limit - x);
    dataPoints.push(y);
    t += INCREMENT;
  }
  return dataPoints;
}

// Gompertz calculation
function gompertz(x, b, c) {
  let t = 0;
  let y;
  let cutoff = 5;
  const dataPoints = [];
  while (t <= cutoff) {
    y = Math.exp(-b * (c ** x) * (c ** t - 1) / Math.log(c));
    dataPoints.push(y);
    t += INCREMENT;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return dataPoints;
}

// Makeham calculation
function makeham(x, a, b, c) {
  let t = 0;
  let y;
  let cutoff = 5;
  const dataPoints = [];
  while (t <= cutoff) {
    y = Math.exp(-(a * t) -b * (c ** x) * (c ** t - 1) / Math.log(c));
    dataPoints.push(y);
    t += INCREMENT;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return dataPoints;
}

// weibull calculation
function weibull(x, k, n) {
  let t = 0;
  let y;
  let cutoff = 5;
  const dataPoints = [];
  while (t <= cutoff) {
    y = Math.exp(-k * ((x+t) ** (n + 1) - x ** (n + 1)) / (n + 1) );
    dataPoints.push(y);
    t += INCREMENT;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return dataPoints;
}

// constant force calculation
function constForce(mu) {
  let t = 0;
  let y;
  let cutoff = 5;
  const dataPoints = [];
  while (t <= cutoff) {
    y = Math.exp(-mu * t);
    dataPoints.push(y);
    t += INCREMENT;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return dataPoints;
}
