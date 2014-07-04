var text = '';
var currText = '';
var score = 0;
/**
 * this method randomly generates whatever is in the possible variable,
    in this case its all the uppercase letters in the english alphabet
 * when ran it changes currText to whatever the randomly generated
    letter is and concatenates the currText onto text (making it 
    progressively longer)
*/
var makeid = function(){
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";//abcdefghijklmnopqrstuvwxyz0123456789";
    currText += possible.charAt(Math.floor(Math.random() * possible.length));
    text+=currText;
};

/**
 * makes a new game by making the currText and text empty strings then
    calling makeid() to generate a new currText/text. It also sets 
    the score to 0.
*/
var newGame = function(){
    currText = '';
    text = '';
    makeid();
    score = 0;
};


$(function(){
    $('html').on('click', '#keyboard li', function(){
        var character = $(this).html(); // If it's a lowercase letter, nothing happens to this variable
        
       // Delete
        if ( $(this).hasClass('delete')) {
                       
            $('input[name="write"]').val($('input[name="write"]').val().substr(0, $('input[name="write"]').val().length - 1));
            return false;
        }
        // Add the character
        
        $('input[name="write"]').val($('input[name="write"]').val() + character);
    });
});
