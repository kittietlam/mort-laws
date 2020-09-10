const INCREMENT = 0.05;

let set1 = [
  { label:'UDD', borderColor:'rgb(255, 92, 92)', pointBackgroundColor:'rgb(255, 92, 92, 0.8)' },
  { label:'Constant Force', borderColor:'rgb(54, 162, 235)', pointBackgroundColor:'rgb(54, 162, 235, 0.8)' },
  { label:'Balducci', borderColor: 'rgb(255, 206, 86)', pointBackgroundColor: 'rgb(255, 206, 86, 0.8)' }
];

let set2 = JSON.parse(JSON.stringify(set1));

// first chart
let survivalChart = newLineChart('chart1', set1);
let op = survivalChart.options;
op.title.text = 'Fractional Ages: Survival Probabilities';
op.scales.xAxes[0].scaleLabel.labelString = 'time (t)';
op.scales.yAxes[0].scaleLabel.labelString = 'S₀(x+t)';
op.tooltips.callbacks.label = function (tooltipItem, data) {
  return 'S₀(x+' + tooltipItem.xLabel + '): ' + Math.round(tooltipItem.yLabel * 100000) / 100000;
}

// second chart
let mortalityChart = newLineChart('chart2', set2);
op = mortalityChart.options;
op.title.text = 'Fractional Ages: Force of Mortality';
op.scales.xAxes[0].scaleLabel.labelString = 'time (t)';
op.scales.yAxes[0].scaleLabel.labelString = 'μ(x+t)';
op.tooltips.callbacks.label = function (tooltipItem, data) {
  return 'μ(x+'+ tooltipItem.xLabel + '):' + Math.round(tooltipItem.yLabel * 100000) / 100000;
}

// add event listeners to forms
const form = document.querySelector('form');
form.autocomplete = 'off';
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let inputs = form.querySelectorAll('input');
  let result = {};
  if (!incomplete(inputs)) {
    result = validate();
  }
  if (result.isValid) {
    updateChart(result);
  }
});

// checks user input parameters
function validate() {
  let result = { isValid:true }
  let isValid = true;

  let beg = document.getElementById('begin').value;
  if (isNaN(beg) || parseFloat(beg) < 0 || parseFloat(beg) > 1) {
    alert('Error: S₀(x) must be a number between 0 and 1');
    result.isValid = false;
  } else {
    result.beg = parseFloat(beg);
  }

  let end = document.getElementById('end').value;
  if (isNaN(end) || parseFloat(end) < 0 || parseFloat(end) > 1) {
    alert('Error: S₀(x+1) must be a number between 0 and 1');
    result.isValid = false;
  } else if (parseFloat(end) > result.beg) {
    alert('Error: S₀(x+1) must be less than S₀(x)');
    result.isValid = false;
  } else {
    result.end = parseFloat(end);
  }
  return result;
}

function updateChart(param) {
  let dataPoints = [ UDD(param.beg, param.end), constForce(param.beg, param.end), balducci(param.beg, param.end)];
  for (i = 0; i < 3; i++)
    addPoints(survivalChart, dataPoints[i].survData, i);
  for (i = 0; i < 3; i++)
    addPoints(mortalityChart, dataPoints[i].mortData, i);
  survivalChart.update();
  mortalityChart.update();
}

function addPoints(chart, yData, i) {
  chart.data.datasets[i].data = yData;
  // update X-values
  if (chart.data.labels.length == 0) {
    let i = 0;
    while (i <= 1) {
      chart.data.labels.push(i);
      i = Math.round((i + INCREMENT) * 100) / 100;
    }
  }
}

// BELOW: CALCULATIONS

// udd calculations
function UDD(beg, end) {
  let t = 0;
  let y;
  const survData = [];
  const mortData = [];
  while (t <= 1) {
    y = (1 - t) * beg + t * end;
    survData.push(y);
    y = (beg - end) / (1 - t * (beg - end));
    mortData.push(y);
    t = Math.round((t + INCREMENT) * 100) / 100;
  }
  return { survData, mortData };
}

// constant force calculations
function constForce(beg, end) {
  let t = 0;
  const survData = [];
  const mortData = [];
  let y;
  while (t <= 1) {
    y = beg * ((end / beg) ** t);
    survData.push(y);
    mortData.push(-Math.log(1 - beg + end));
    t = Math.round((t + INCREMENT) * 100) / 100;
  }
  return { survData, mortData };
}

// balducci calculations
function balducci(beg, end) {
  let t = 0;
  const survData = [];
  const mortData = [];
  let y;
  while (t <= 1) {
    y = 1 / ((1-t)/ beg + t / end);
    survData.push(y);
    y = (beg - end) / (1 - (1-t) * (beg - end));
    mortData.push(y);
    t = Math.round((t + INCREMENT) * 100) / 100;
  }
  return { survData, mortData };
}
