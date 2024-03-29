// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

	
	if (Meteor.isClient) {
	
	Template.leaderboard.players = function () {
    return Players.find({}, {sort: Session.get("sort_order")});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

	Template.leaderboard.sort_order = function () {
    var order = "Score";
    if (Session.get("is_name_order")) {
      order = "Name";
    }
    return order;
  };
    

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },
    'click input.sort': function () {
      Session.set("is_name_order", !Session.get("is_name_order"));
    },
    'click input.randomise': function() {
   		 	Players.find({}).forEach(function(player) {
      		Players.update(player, {$set: {score: randomScore()}});
    		});
  		},
  	'click input.add': function () {
    	var new_player_name = document.getElementById("new_player_name").value;
    		Players.insert({name: new_player_name, score: 0});
  	}
  });
	
	  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    },
    'click input.delete': function () {
    Players.remove(this._id);
  }
  });
 
  Template.leaderboard.players = function () {
    var order = Session.get("is_name_order") ?
    {name: 1, score: -1} :
    {score: -1, name: 1};
    return Players.find({}, {sort: order});
};

}

	var randomScore = function() {
  	return Math.floor(Math.random()*10)*5;
	}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
      		Players.insert({name: names[i], score: randomScore()});
	    }
  });
}
