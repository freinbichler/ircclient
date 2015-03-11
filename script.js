var config = require('./config');
var users = require('./users');
var irc = require('irc');
var $ = require('jquery');

var client = new irc.Client(config.server, config.username, {
  channels: [config.channel]
});

client.addListener('message', function (from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);
  var isPM = false;
  var beforeMessage = '';
  if(to == config.username) {
    isPM = true;
  }
  showMessage(from, message, false, isPM);
});

client.addListener('join', function (channel, nick, message) {
  console.log(nick + ' joined ' + channel);
  showMessage(nick, 'joined ' + channel, true, false);
  users.add(nick);
});

client.addListener('quit', function (nick, reason, channels, message) {
  console.log(nick + ' quit this channel');
  showMessage(nick, 'quit this channel', true, false);
  users.remove(nick);
});

client.addListener('part', function (channel, nick, reason, message) {
  console.log(nick + ' left this channel');
  showMessage(nick, 'left this channel', true, false);
  users.remove(nick);
});

client.addListener('registered', function (message) {
  showMessage('', 'joining channel...', true, false);
});

client.addListener('names', function (channel, nicks) {
  users.init(nicks);
  console.log(nicks);
});

$('button').on('click', send);

$('#message').on('keyup', function(e) {
  if(e.keyCode == 13) {
    send();
  }
});

function send() {
  var message = $('#message').val();
  var to = config.channel;

  if(message.charAt(0) == '@') {
    var recipient = message.split(' ')[0];
    to = recipient.replace('@', '');
  }

  client.say(to, message);
  showMessage(config.username, message, false, false);
  $('#message').val('');
}

function showMessage(name, message, system, pm) {
  var systemClass = '';
  var pmClass = '';
  if(system) {
    systemClass = 'text-muted';
  }
  if(pm) {
    pmClass = "text-primary";
  }
  $('#chat').append('<div class="row message ' + systemClass + ' ' + pmClass + '"><div class="col-xs-4 name">' + name + '</div><div class="col-xs-8 text">' + sanitize(message) + '</div></div>');
  $("body").animate({ scrollTop: $(document).height() }, "slow");
}

function sanitize(text) {
  return text.replace(/(<([^>]+)>)/ig, '');
}
