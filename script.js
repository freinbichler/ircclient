var myUserName = 'fr3ino';
var irc = require('irc');
var client = new irc.Client('chat.freenode.net', myUserName, {
  channels: ['#schnitzelwirt'],
});

var onlineUsers = {};

client.addListener('message', function (from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);
  var isPM = false;
  var beforeMessage = '';
  if(to == myUserName) {
    isPM = true;
    beforeMessage = '@' + myUserName + ': ';
  }
  showMessage(from, beforeMessage + message, false, isPM);
});

client.addListener('join', function (channel, nick, message) {
  console.log(nick + ' joined ' + channel);
  showMessage(nick, 'joined ' + channel, true, false);
  onlineUsers[nick] = '';
  showOnlineUsers();
});

client.addListener('quit', function (nick, reason, channels, message) {
  console.log(nick + ' left this channel');
  showMessage(nick, 'left this channel', true, false);
  delete onlineUsers[nick];
  showOnlineUsers();
});

client.addListener('registered', function (message) {
  showMessage('', 'joining channel...', true, false);
});

client.addListener('names', function (channel, nicks) {
  onlineUsers = nicks;
  showOnlineUsers();
  console.log(nicks);
});

$('button').on('click', send);

$('#message').on('keyup', function(e) {
  if(e.keyCode == 13) {
    send();
  }
});

function send() {
  var to = '#schnitzelwirt';

  var message = $('#message').val();

  client.say(to, message);
  showMessage(myUserName, message, false, false);
  $('#message').val('');
}

function showMessage(name, message, system, pm) {
  var systemClass = "";
  var pmClass = "";
  if(system) {
    systemClass = "text-muted";
  }
  if(pm) {
    pmClass = "text-primary";
  }
  $('#chat').append('<div class="row message '+systemClass+' '+pmClass+'"><div class="col-xs-4 name">' + name + '</div><div class="col-xs-8 text">' + message.replace(/(<([^>]+)>)/ig,"") + '</div></div>');
  $("body").animate({ scrollTop: $(document).height() }, "slow");
}

function showOnlineUsers() {
  $('#users').html('');
  for(var user in onlineUsers) {
    $('#users').append('<li>'+user+'</li>');
  }
}