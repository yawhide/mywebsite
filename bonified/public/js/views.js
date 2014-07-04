/**
 * this method serializes a form and returns an array with
    the contents of that form.
*/
$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

/**
 * Index view renders the home page into container in 
    the index.html
*/
var IndexView = Backbone.View.extend({
  el:'body > .container',
  render: function() {
    var source = $("#index_template").html();
    
    var template = Mustache.to_html(source);
    this.$el.html(template).trigger('create');
  }
});
/**
 * HighScore View renders the high score page into container 
  in index.html
  This view Fetches the top 10 scores of the in our MongoDB
*/
var HighScoreView = Backbone.View.extend({
  el:'body > .container',
  events: {
    'click #searchButton': 'searchUser'
  },
  render: function() {
    var user = new User();
    var that = this;
    user.fetch({
      success: function(response) {
       var object = response.attributes;

       var highscoreArray = [];
       for (var element in object) {
          var scores;
          scores = {"username": object[element].username, "highscore": object[element].highscore};
          highscoreArray.push(scores);
        }
        
    var source = $("#highscore_template").html();
    var template = Mustache.to_html(source, {"highscoreArray":highscoreArray});
    that.$el.html(template).trigger('create');
  },
      error: function(){
      console.log("Something failed here....");
      }
    });
  },
  searchUser: function(ev){
    console.log(ev);
    ev.preventDefault();
    var that = this;
    if($('#username').val() !== ''){
    $.ajax( {
      type: "POST",
      url: "/search",
      data: {"username": $("#username").val()},
      success: function(response) {
        var object = response;


       var highscoreArray = [];
       for (var element in object) {
          var scores;
          scores = {"username": object[element].username, "highscore": object[element].highscore};
          highscoreArray.push(scores);
        }
        
    var source = $("#highscore_template").html();
    var template = Mustache.to_html(source, {"highscoreArray":highscoreArray});
    that.$el.html(template).trigger('create');

      },
      error: function(){
        console.log("error");
      }
    });
    }
    else{
      this.render();
    }
  }
});

/**
 * GameOver View renders the Game Over page into container 
  in index.html
   Grabs the user information and the high score and saves it to MondoDB
*/
var GameoverView = Backbone.View.extend({
  el: 'body > .container',
  events: {
    'submit .addHS': 'addHS'
  },
  addHS: function(ev){
    ev.preventDefault();
    var userDetails = $(ev.currentTarget).serializeObject();
    var username = userDetails.username;
    var highscore = score;
    var user = new AddUser();
    var newUserDetails = {"username": username, "highscore": highscore};
    console.log(newUserDetails);
    user.save(newUserDetails, {
      success: function(){
        app_router.navigate("#/highscore", true);
      },
      error: function(){
        console.log("Failed to add user");
      }
    });
  },
  render: function(){
    if(score>1){
    }
    else{
      score=null;
    }
    var source = $("#gameover_template").html();
    var template = Mustache.to_html(source,{"score":score});
    this.$el.html(template).trigger('create');
  }
});

/**
 * Bonify View renders the Game page into container 
  in index.html
   Shows the game page and regenerates a new letter if needed
*/
var BonifyView = Backbone.View.extend({
  el: 'body > .container',
  events:{
    'click #guess': 'makeGuess',
    'click #goto_bonify':'startGame'
  },
  makeGuess: function(ev){
    ev.preventDefault();
    var guess = $('#guessInput').val().toUpperCase();
    if(guess != text){
        console.log("Your Score is: " + score);
        app_router.navigate("#/gameover", true);
    }
    else{
        score+=1;
        currText = '';
        makeid();
        var source = $("#bonify_template").html();
        var template = Mustache.to_html(source,{"currText": currText, "score": score});
        this.$el.html(template).trigger('create');
    }
   },
  startGame: function(){
    this.render();
  },
  render: function(){
    newGame();
      var source = $("#bonify_template").html();
        var template = Mustache.to_html(source,{"currText": currText, "score": score});
        this.$el.html(template).trigger('create');
         }
});
