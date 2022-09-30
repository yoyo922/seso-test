"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

/**
 * Sort dates using a hash-table. and merge algorithm to get the latest item to print.
 * get initial log entry from all the log series find the smallest one, print the log,
 * find the corresponding log source and pop another log entry wait for request to finish and compare again.
 * repeat till all logs are drained
 * 
 * @param {*} logSources - array of log sources
 * @param {*} printer - printer object
 * @returns 
 */

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    let hashArray = [];
    for (let i = 0; i < logSources.length; i++) {
      let d = logSources[i].popAsync()
      let log = await d.then((res)=>{
        return res
      })
      hashArray.push({log, index: i});
    }

    while(1) {
      let allDrained = false;
      hashArray = await printLogs(hashArray, printer, logSources);

      if (hashArray.length === 1 && hashArray[0].log === false) {
        allDrained = true
      } 
      
      if (allDrained) {
        printer.done();
        break;
      }
    }

    resolve(console.log("Async sort complete."));
  });
};

/**
 * The current hash object contains the latest log from each log,
 * find the latest one from each log and print that one, replace the printed log
 * with another new log with pop async and wait for response to complete 
 * @param {*} hashArray - current hash object to sort
 * @param {*} printer  - printer class
 * @param {*} logSources - array of log sources
 * @returns 
 */
async function printLogs(hashArray, printer, logSources) {
  hashArray.sort((a, b) => {
    return (
      Math.floor(new Date(a.log.date).valueOf()) -
      Math.floor(new Date(b.log.date).valueOf())
    );
  });

  if (hashArray[0].log) {
    printer.print(hashArray[0].log);
    let newLogPromise = logSources[hashArray[0].index].popAsync();
    let log = await newLogPromise.then((res)=>{
      return res
    });
    hashArray[0].log = log    
  } else {
    hashArray.shift();
  }
  return hashArray;
}
