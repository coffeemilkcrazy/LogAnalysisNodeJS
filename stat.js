function mean(array) {
    if (array.length === 0) return NaN;
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}
module.exports.mean = mean;

function median(values) {
  if (values.length === 0) return NaN;
  values.sort( function(a,b) {return a - b;} );
  var half = Math.floor(values.length/2);

  if(values.length % 2)
      return values[half];
  else
      return (values[half-1] + values[half]) / 2.0;
}
module.exports.median = median;

function mode(array) {
  if (array.length === 0) return NaN;
  var maxValue, maxCount = 0;

  for (var i = 0; i < array.length; ++i) {
      var count = 0;
      for (var j = 0; j < array.length; ++j) {
          if (array[j] == array[i]) ++count;
      }
      if (count > maxCount) {
          maxCount = count;
          maxValue = array[i];
      }
  }
  return maxValue;
}
module.exports.mode = mode;
