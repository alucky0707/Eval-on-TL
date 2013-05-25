'use strict';

var
request = require('request');

var
API_URL = 'http://api.dan.co.jp/lleval.cgi';

function evaluate(lang, src, callback) {
  if(callback === undefined) {
    callback = src;
    src = lang;
    lang = '';
  }
  
  var
  query = lang === '' ? {s: src} : {s: src, l: lang};
  
  request(API_URL, {json: true, qs: query}, function(err, res, body) {
    if(res.statusCode !== 200) {
      err = new Error('HTTP request Error!');
      err.data = res;
    }else if(body && 'error' in body) {
      err = new Error(body.err);
    }
    if(err) {
      callback(err);
      return;
    }
    
    callback(null, body, res);
  });
}

function languages(callback) {
  request(API_URL, {json: true, qs: {q: 1}}, function(err, res, body) {
    if(res.statusCode !== 200) {
      err = new Error("HTTP request Error!");
      err.data = res;
    }
    if(err) {
      callback(err);
      return;
    }
    
    callback(null, body);
  });
}

module.exports = {
  evaluate: evaluate,
  languages: languages,
};
