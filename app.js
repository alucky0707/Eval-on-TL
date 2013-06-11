'use strict';

var
util = require('util'),
ntwitter = require('ntwitter'),
html = require('ent'),
lleval = require('lleval'),
csharp = require('./csharp.js'),
dlang = require('./dlang.js');

var
config = require('./config.json'),
is_tweet_valid = new RegExp('^\\s*(\\.?)\\s*@' + config.screen_name + '\\s+');

var
twitter = new ntwitter(config.keys);

function startStream() {
  twitter.stream('user', {'track': "@eval_of"},function(stream) {
    stream.on('data', function (data) {
      if(data.event) {
        onEvent(data);
      }else if(data.user) {
        onTweet(data);
      }
    });
    stream.on('end', function (response) {
      setTimeout(startStream, 60 * 1000);
    });
    stream.on('destroy', function (response) {
      setTimeout(startStream, 60 * 1000);
    });
  });
}

function onTweet(data) {
  var
  lang, src,
  rt_flag,
  tweet_id = data.id_str,
  screen_name = data.user.screen_name,
  text = html.decode(data.text);
  if(is_tweet_valid.test(text)) {
    console.log('on tweet');
    rt_flag = !!text.match(is_tweet_valid)[1];
    text = text.replace(is_tweet_valid, '').match(/^(\w+)\s*([\w\W]*)$/);
    if(text === null) return;
    lang = text[1];
    src = text[2];
    console.log(lang, src);
    if(lang === 'langs'){
      lleval.languages(function(err, langs) {
        if(err) {
          console.log(err);
          onError('languages', err);
          return;
        }
        replyTo(screen_name, tweet_id, Object.keys(langs).join(','));
      });
    }else if(lang === 'csharp' || lang === 'cs'){
      csharp.evaluate(src, function(err, res) {
        if(err) {
          console.log(err);
          onError('evaluate', err);
          return;
        }
        replyTo(screen_name, tweet_id, res.output + '\n' + res.stderr + '\n' + res.cmpinfo);
        if(rt_flag) retweet(tweet_id);
      });
    }else if(lang === 'dlang' || lang === 'd'){
      dlang.evaluate(src, function(err, res) {
        if(err) {
          console.log(err);
          onError('evaluate', err);
          return;
        }
        replyTo(screen_name, tweet_id, res.output + '\n' + res.stderr + '\n' + res.cmpinfo);
        if(rt_flag) retweet(tweet_id);
      });
    }else{
      lleval.evaluate(lang, src, function(err, res) {
        if(err) {
          console.log(err);
          onError('evaluate', err);
          return;
        }
        replyTo(screen_name, tweet_id, res.stdout + '\n' + res.stderr);
        if(rt_flag) retweet(tweet_id);
      });
    }
  }
}

function onEvent(data) {
  switch(data.event) {
  case 'follow':
    if(data.source.screen_name !== config.screen_name) {
      console.log('on follow');
      twitter.createFriendship(data.source.screen_name,function(err, data) {
        if(err) {
          console.log(err);
          onError('follow', err);
          return;
        }
        console.log('done re-follow');
      });
    }
    break;
  }
}

function onError(name, err) {
  console.log('on error');
  twitter.updateStatus(util.format('@%s %s:%j', config.developer_screen_name, name, err).slice(0,140), function(err, res) {
    if(err) {
      console.log(err);
      return;
    }
    console.log('done error-report');
  });
}

function replyTo(screen_name, tweet_id, text) {
  twitter.updateStatus(('@' + screen_name + ' ' + text.replace(/@/g, "@ ")).slice(0, 140), {in_reply_to_status_id: tweet_id}, function(err, res) {
    if(err) {
      console.log(err);
      onError('reply', err);
      return;
    }
    console.log('done reply');
  });
}

function retweet(tweet_id) {
  twitter.retweetStatus(tweet_id, function(err, res) {
    if(err) {
      console.log(err);
      onError('retweet', err);
      return;
    }
    console.log('done retweet');
  });
}

startStream();
