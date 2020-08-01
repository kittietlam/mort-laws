// De Moivre calculation x < limit
function deMoivre(x, limit, inc) {
  let borderColor = 'rgb(255, 92, 92)';
  let pointBackgroundColor = 'rgb(255, 92, 92, 0.8)';
  const yData = [];
  let t = 0;
  while (x + t <= limit) {
    let y = (limit - x - t) / (limit - x);
    yData.push(y);
    t += inc;
  }
  return { yData, borderColor, pointBackgroundColor };
}

// Gompertz calculation
function gompertz(x, b, c, inc) {
  let borderColor = 'rgb(54, 162, 235)';
  let pointBackgroundColor = 'rgb(54, 162, 235, 0.8)';
  let t = 0;
  let y;
  let cutoff = 5;
  const yData = [];
  while (t <= cutoff) {
    y = Math.exp(-b * (c ** x) * (c ** t - 1) / Math.log(c));
    yData.push(y);
    t += inc;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return { yData, borderColor, pointBackgroundColor };
}

// Makeham calculation
function makeham(x, a, b, c, inc) {
  let borderColor = 'rgb(255, 206, 86)';
  let pointBackgroundColor = 'rgb(255, 206, 86, 0.8)';
  let t = 0;
  let y;
  let cutoff = 5;
  const yData = [];
  while (t <= cutoff) {
    y = Math.exp(-(a * t) -b * (c ** x) * (c ** t - 1) / Math.log(c));
    yData.push(y);
    t += inc;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return { yData, borderColor, pointBackgroundColor };
}

// weibull calculation
function weibull(x, k, n, inc) {
  let borderColor = 'rgb(75, 192, 192)';
  let pointBackgroundColor = 'rgb(75, 192, 192, 0.8)';
  let t = 0;
  let y;
  let cutoff = 5;
  const yData = [];
  while (t <= cutoff) {
    y = Math.exp(-k * ((x+t) ** (n + 1) - x ** (n + 1)) / (n + 1) );
    yData.push(y);
    t += inc;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return { yData, borderColor, pointBackgroundColor };
}

function constForce(mu, inc) {
  let borderColor = 'rgb(153, 102, 255)';
  let pointBackgroundColor = 'rgb(153, 102, 255, 0.8)';
  let t = 0;
  let y;
  let cutoff = 5;
  const yData = [];
  while (t <= cutoff) {
    y = Math.exp(-mu * t);
    yData.push(y);
    t += inc;
    if (t === cutoff && y > 0.00001) cutoff += 5;
  }
  return { yData, borderColor, pointBackgroundColor };
}
