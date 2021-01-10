const fs = require("fs");

function readCSV(file) {
  // read from csv/txt file.
  fs.readFile(file, 'utf8', function(err, data) {
    if(err) {
      throw err;
    }
    if(data) {
      // create a new arr from data read from file
      let dataArray = data.split(/\r?\n/);
      // combine data that are the same
      mergeData(dataArray);
    }
  })
}

function mergeData(data) {
  const hash = {};
  data.forEach(data => {
    // split each data
    const res = data.split(',');
    // check for equality of 1 and 2 index, if the same add 3 indexes
    let key = `${res[0]}-${res[1]}`;
    let value = res[2];
    // if already exist, then do summazation otherwise, create a new one
    if(hash[key] !== undefined) {
      let result = parseFloat(hash[key]) + parseFloat(value);
      // update the value
      hash[key] = parseFloat(result).toFixed(2); // round to 2 decimal places
    } else {
      hash[key] = value;
    }
  })

  writeToFile(hash);
}

function writeToFile(hashedData) {
  const timeTick = new Date().getTime();
  // create/append a file and append each to a new line -> fileName correspond to timeTick
  const fileStream = fs.createWriteStream(`./output/${timeTick}.txt`);
  // create an arr
  for(let [key, value] of Object.entries(hashedData)) {
    // split keys based on - used to create it
    const splittedKeys = key.split('-');
    // add value in splittedKeys arr
    splittedKeys.push(value);
    // create string for @ array
    let resStr = `${splittedKeys[0]},${splittedKeys[1]},${splittedKeys[2]}`;
    // write to the file
    fileStream.once('open', function(data) {
      fileStream.write(resStr+"\r\n");
    })
  }
}

// testing
readCSV('./rawfiles/example.txt');
