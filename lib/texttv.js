var request = require('request');
var clc = require('cli-color');
var page = process.argv[2] || 100;

var yleApi = require(__dirname + '/../yleConfig.json');

var colorify = function(color) {
  switch(color) {
    case 'tgre':
      return clc.green;
    case 'tcya':
      return clc.cyan;
    case 'twhi':
      return clc.white;
    case 'tblu':
      return clc.blue;
    case 'tred':
      return clc.red;
    case 'tyel':
      return clc.yellow;
    default:
      return clc;
  }
};

function stylize(right, left, color, middle) {
  left = typeof left !== 'undefined' ? left : '';
  middle = typeof middle !== 'undefined' ? middle : '';
  
  if (/^#{39}/g.test(right)) {
    right = right.replace(/#/g, ' ');
  }
  var startIndex = right.indexOf("[");
  var endIndex = right.indexOf("]");
  // basecase
  if (startIndex === -1) {
    middle = " " + right.substring(0, right.length);
    left += colorify(color)(middle);
    return left;
  } else {
    if (startIndex !== 0) {
      middle = " " + right.substring(0, startIndex);
    } else if (startIndex === 0) {
      middle = ' ';
    }
    var tag = right.substring(startIndex + 1, endIndex);
    right = right.substring(endIndex + 1, right.length);
    left += colorify(color)(middle);

    return stylize(right, left, tag, middle);
  }
}

request(yleApi.baseUrl + yleApi.path + "?a=" + yleApi.apiKey + "&p=" + page + "&c=true", function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(clc.reset);
    var res = JSON.parse(body);
    res.pages.forEach(function(page) {
      page.subpages.forEach(function(subpage) {
        console.log("");
        var content = subpage.content.split(/\n/);
        content.forEach(function(line) {
          var new_line = stylize(line);
          process.stdout.write(new_line);
          if (new_line.length > 1) {
            process.stdout.write(" |\n");
          }
        });
        console.log("-----------------------------------------´");
        
      });
    });
  } else {
    console.log("Page does not exist or something went wrong.");
  }
});
