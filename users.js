var $ = require('jquery');

var users = {
  list: {},
  init: function(nicks) {
    this.list = nicks;
    this.print();
  },
  add: function(nick) {
    this.list[nick] = '';
    this.print();
  },
  remove: function(nick) {
    delete this.list[nick];
    this.print();
  },
  print: function() {
    $('#users').html('');
    for(var user in this.list) {
      $('#users').append('<li>' + user + '</li>');
    }
  }
};

module.exports = users;