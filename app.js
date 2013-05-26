'use strict';

var
ntwitter = require('ntwitter'),
html = require('ent'),
lleval = require('./lleval.js');

var
config = require('./config.json'),
is_tweet_valid = new RegExp('^\\s*@' + config.screen_name + '\\s*');

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
  tweet_id = data.id_str,
  screen_name = data.user.screen_name,
  text = html.decode(data.text);
  if(is_tweet_valid.test(text)) {
    console.log('on tweet');
    text = text.replace(is_tweet_valid, '').match(/^(\w+)\s*((?:.|\n)*)$/);
    if(text === null) return;
    lang = text[1];
    src = text[2];
    console.log(lang, src);
    if(lang === 'langs'){
      lleval.languages(function(err, langs) {
        if(err) {
          console.log(err);
          return;
        }
        replyTo(screen_name, tweet_id, Object.keys(langs).join(','));
      });
    }else{
      lleval.evaluate(lang, src, function(err, res) {
        if(err) {
          console.log(err);
          return;
        }
        replyTo(screen_name, tweet_id, res.stdout + '\n' + res.stderr);
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
          return;
        }
        console.log('done re-follow');
      });
    }
    break;
  }
}

function replyTo(screen_name, tweet_id, text) {
  twitter.updateStatus('@' + screen_name + ' ' + text, {in_reply_to_status_id: tweet_id}, function(err, res) {
    if(err) {
      console.log(err);
      return;
    }
    console.log('done reply');
  });
}

startStream();
