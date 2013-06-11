var
jsonrpc = require('./jsonrpc.js');

var
config = require('./config.json'),
lang = 102, //D
user = config.ideone.user,
pass = config.ideone.pass,
base_src = [
  'import std.stdio;',
  'import std.array;',
  'import std.algorithm;',
  'import std.bigint;',
  '',
  'void main(){',
  '%s',
  '}'].join('\n'),
input = '';

var
client = jsonrpc.client('http://ideone.com/api/1/service.json');

function evaluate(src, callback) {
  var
  link;
  
  src = src.split('\n').map(function(s) {
    return '    ' + s;
  }).join('\n');
  src = base_src.replace('%s', src);
  
  console.log(src);
  function start() {
    client.call('createSubmission',  [user, pass, src, lang, input, true, false], function(result) {
      if(result['error'] !== 'OK') {
        console.log(result);
        onError('createSubmission', result);
        return;
      }
      console.log('done createSubmission');
      link = result['link'];
      next();
    }, function(err){
      console.log(err);
      setTimeout(start, 1000);
    });
  }
  
  function next() {
    console.log(link);
    
    client.call('getSubmissionStatus', [user, pass, link], function(result) {
      if(+result['status'] === 0) {
        console.log('done getSubmissionStatus');
        done();
      }else{
        console.log('continue getSubmissionStatus');
        setTimeout(next, 100);
      }
    }, callback);
  }
  
  function done() {
    client.call('getSubmissionDetails', [user, pass, link, false, true, true, true, true], function(result) {
      if(result['error'] !== 'OK') {
        console.log(result);
        onError('getSubmissionDetails', result);
        return;
      }
      
      console.log(result);
      
      console.log('done getSubmissionDetils');
      callback(null, result);
    }, callback);
  }
  
  function onError(name, result) {
    var
    err = new Error(name);
    err.data = result;
    callback(err);
  }
  
  start();
}

module.exports = {
  evaluate: evaluate,
};
