"use strict";

const { has } = require("lodash");

// Print all entries, across all of the sources, in chronological order.

/**
 * Sort dates using a hash-table. and merge algorithm to get the latest item to print.
 * get initial log entry from all the log series find the smallest one, print the log,
 * find the corresponding log source and pop another log entry and compare again.
 * repeat till all logs are drained
 * 
 * @param {*} logSources - array of log sources
 * @param {*} printer - printer object
 * @returns 
 */

module.exports = (logSources, printer) => {
  let hashArray = [];
  for (let i = 0; i < logSources.length; i++) {
    let log = logSources[i].pop();
    hashArray.push({log, index: i});
  }
  

  while(1) {
    let allDrained = false;
    hashArray = printLogs(hashArray, printer, logSources);

    if (hashArray.length === 1 && hashArray[0].log === false) {
      allDrained = true
    } 
    
    if (allDrained) {
      printer.done();
      break;
    }
  }

  // Brute force method, combine arrays, store in memory, sort them and print
  // Unfortunately this is faster than than the sort using hash array, but it will
  // have to load the entire data into memory 

  /*let list = [];

  for (let i = 0; i < logSources.length; i++) {
    while (1) {
      let log = logSources[i].pop();
      if (log) {
        list.push(log);
      } else {
        break;
      }
    }
  }
  
  list.sort((a,b)=> {
    return (Math.floor(new Date(a.date).valueOf()) - Math.floor(new Date(b.date).valueOf()));
  });

  list.forEach((item)=> {
    printer.print(item);
  })

  printer.done();*/
  return console.log("Sync sort complete.");
};

/**
 * The current hash object contains the latest log from each log,
 * find the latest one from each log and print that one, replace the printed log
 * with another new log with pop 
 * @param {*} hashArray - current hash object to sort
 * @param {*} printer  - printer class
 * @param {*} logSources - array of log sources
 * @returns 
 */
function printLogs(hashArray, printer, logSources) {

  hashArray.sort((a,b)=> {
    return (Math.floor(new Date(a.log.date).valueOf()) - Math.floor(new Date(b.log.date).valueOf()));
  });

  if (hashArray[0].log) {
    printer.print(hashArray[0].log)
    hashArray[0].log = logSources[hashArray[0].index].pop();
  } else {
    hashArray.shift();
  }
  
  return hashArray
}
