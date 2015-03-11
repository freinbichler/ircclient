var config = {
  username: 'fr3ino',
  channel: '#schnitzelwirt'
};

var irc = require('irc');
var client = new irc.Client('chat.freenode.net', config.username, {
  channels: [config.channel]
});

var onlineUsers = {};

client.addListener('message', function (from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);
  var isPM = false;
  var beforeMessage = '';
  if(to == config.username) {
    isPM = true;
    beforeMessage = '@' + config.username + ': ';
  }
  showMessage(from, beforeMessage + message, false, isPM);
});

client.addListener('join', function (channel, nick, message) {
  console.log(nick + ' joined ' + channel);
  showMessage(nick, 'joined ' + channel, true, false);
  addToUserList(nick);
});

client.addListener('quit', function (nick, reason, channels, message) {
  console.log(nick + ' quit this channel');
  showMessage(nick, 'quit this channel', true, false);
  deleteFromUserList(nick);
});

client.addListener('part', function (channel, nick, reason, message) {
  console.log(nick + ' left this channel');
  showMessage(nick, 'left this channel', true, false);
  deleteFromUserList(nick);
});

client.addListener('registered', function (message) {
  showMessage('', 'joining channel...', true, false);
});

client.addListener('names', function (channel, nicks) {
  onlineUsers = nicks;
  refreshOnlineUsers();
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

function refreshOnlineUsers() {
  $('#users').html('');
  for(var user in onlineUsers) {
    $('#users').append('<li>' + user + '</li>');
  }
}

function deleteFromUserList(nick) {
  delete onlineUsers[nick];
  refreshOnlineUsers();
}

function addToUserList(nick) {
  onlineUsers[nick] = '';
  refreshOnlineUsers();
}

function sanitize(text) {
  return text.replace(/(<([^>]+)>)/ig, '');
}