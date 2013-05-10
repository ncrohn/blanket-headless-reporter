define([],function meltreporter(){

  var isHeadless = false;

  if(window.navigator.userAgent.match(/PhantomJS/)) {
    isHeadless = true;
  }

  // Borrowed from colors.js by marak: https://github.com/Marak/colors.js/blob/master/colors.js#L61
  var styles = {
    //styles
    'bold'      : ['\033[1m',  '\033[22m'],
    'italic'    : ['\033[3m',  '\033[23m'],
    'underline' : ['\033[4m',  '\033[24m'],
    'inverse'   : ['\033[7m',  '\033[27m'],
    //grayscale
    'white'     : ['\033[37m', '\033[39m'],
    'grey'      : ['\033[90m', '\033[39m'],
    'black'     : ['\033[30m', '\033[39m'],
    //colors
    'blue'      : ['\033[34m', '\033[39m'],
    'cyan'      : ['\033[36m', '\033[39m'],
    'green'     : ['\033[32m', '\033[39m'],
    'magenta'   : ['\033[35m', '\033[39m'],
    'red'       : ['\033[31m', '\033[39m'],
    'yellow'    : ['\033[33m', '\033[39m']
  };

  function color(str, c) {
    if(isHeadless) {

      if(typeof c === 'string') {
        return styles[c][0] + str + styles[c][1];
      }

      var output = str;
      for(var ci=0;ci<c.length;ci++) {
        output = color(output, c[ci]);
      }
      return output;
    }

    return str;
  }

  function getColorStyle(percentage) {
    var colorStyle = 'yellow';

    if(percentage > 80) {
      colorStyle = 'green';
    } else if (percentage < 70) {
      colorStyle = 'red';
    }

    return colorStyle;
  }

  var totals = {
    totalCovered: 0,
    totalLines: 0
  };

  var summary = [];

  var writeLog = function ( filename,data) {

    var lineTotal = 0;
    var lineCovered = 0;

    var linesMissed = [];

    for(var i=0;i<data.length;i++) {
      if(data[i] !== undefined) {
        if(data[i] > 0) {
          lineCovered++;
        } else {
          linesMissed.push(i);
        }

        lineTotal++;
      }
    }

    var percentage = ((lineCovered/lineTotal)*100).toFixed(2);

    console.log( '\r\n' +
      color(filename + ': ', 'blue') +
      color(lineTotal + ' lines, ', 'blue') +
      color(percentage + '% coverage', getColorStyle(percentage))
    );

    totals.totalCovered += lineCovered;
    totals.totalLines += lineTotal;

    //console.log(data.join('\r\n'));

    var buffer = 5;
    for(var j=0;j<linesMissed.length;j++) {
      var line = linesMissed[j];
      console.log(color('showing lines '+ (line-buffer) + ' to '+ (line+buffer), 'bold'));
      console.log(color('--------------------------------------------------', 'bold'));

      for(var x=(line-buffer-1);x<(line+buffer);x++) {
        if(x === line-1) {
          console.warn(color('>> '+x+': '+data.source[x], ['red', 'inverse']));
        } else {
          console.log('   '+x+': '+data.source[x]);
        }
      }

    }

    summary.push(color(filename + ': ' + lineTotal + ' lines, ' + percentage + '% coverage', getColorStyle(percentage)));

  };

  var writeStats = function (stats) {
    for (var key in stats) {
      console.log(key+': '+stats[key]);
    }
  };

  return function(coverageData){

    console.log('\r\n\r\n'+color('QUnit Code Coverage', 'yellow'));

    writeStats(coverageData.stats);

    for (var filename in coverageData.files) {
      var data = coverageData.files[filename];
      writeLog(filename,data);
    }

    var percentage = ((totals.totalCovered/totals.totalLines)*100).toFixed(2);

    console.log('\r\n');

    for(var i=0;i<summary.length;i++) {
      console.log(summary[i]);
    }

    console.log(color('Total coverage: ', 'bold') + color(percentage +'%', getColorStyle(percentage)) + '\r\n');
  };
});
