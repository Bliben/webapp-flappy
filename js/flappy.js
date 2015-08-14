// the Game object used by the phaser.io library

jQuery("#greeting-form").on("submit", function (event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    var changeJump = 300;


    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");


    //  event_details.preventDefault();
});

var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
var pipeGap = 100;
var yarn = [];
//var checkBonus

var stateActions = {preload: preload, create: create, update: update};
var score = -2;
var width = 700;
var height = 400;

var pipes = [];


var gameGravity = 300;
var gameSpeed = 200;
var jumpPower = -90;
var pipeInterval = 1.75;


// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);
var labelScore;
var player;
var gameOverText;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {

//preload = called once at the very beginning it uploads resources e.g images and sounds
    // resources can be given a name here

    game.load.image("playerImg", "../assets/kitten.png");
    // this loads the image into the program
    game.load.audio("score", "../assets/point.ogg");

    game.load.image("pipe", "../assets/pipe.png");

    game.load.image("pipeEnd", "../assets/pipe-end.png");

    game.load.image("yarn", "../assets/yarn1.png");
    //game.load.image("" , "../assets/png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // create is called after preload to set up elements of game
    //when this function ends the game starts
    game.stage.setBackgroundColor("#8FD8D8");
    //this line sets the colour of the background using hexadecimal
    // make sure to put the content of brackets into " "

    //  game.add.text(230, 150, "Welcome to my game" ,
    //this adds text to the screen 350 = x and 150 = y
    //y works in opposite to go up it is negative to go down it is positive
    //  {font: "30px Arial" , fill : "#FFFFFF"});
    //30px = size of the text
    //fill = colour of the text


    gameOverText = game.add.text(200, 70, "Game Over", {font: "30px Arial", fill: "#FFFFFF"});
    gameOverText.visible = false;


//game.add.sprite(10, 150, "playerImg");
//this calls an image so it appears in the game


// game.input
//  .onDown
//  .add(clickHandler) ;


    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);


    labelScore = game.add.text(20, 20, "0");


    player = game.add.sprite(80, 200, "playerImg");
    player.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable(player);

    player.body.gravity.y = 190;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND, generate);
//generate();


}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
//update is called for each frame of the game
    //lets you set up tests and actions for every instant of your game

    player.rotation = Math.atan(player.body.velocity.y / 200);
    checkBonus(yarn, -50);


    for (var i = yarn.length - 1; i >= 0; i--) {
        game.physics.arcade.overlap(player, yarn[i], function () {
            changeGravity(-100);
            yarn[i].destroy();
            yarn.splice(i, 1);
        });
    }

    //for(var index=0; index<pipes.length; index++) {
    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);

    if (player.y > 400) {

        gameOver();
    }
    if (player.body.y < 0) {

        gameOver();

    }

    //player.rotation += 1;


    // if(gameOver){
    //
    //
    //    game.add.text(20,70, "Game Over",
    //        {font: "30px Arial", fill: "#FFFFFF"});
    //
    //}

}
function gameOver() {
    gameOverText.visible = true;
    game.paused = true;
    gameGravity = 200;

    //location.reload();
    $("#score").val(score);
    $("#greeting").show();
}

function clickHandler(event) {

    // alert("The position is: " + Math.floor(event.x) + " , " + Math.floor(event.y) );
    //Math.floor strips decimal places
//pauses a program and displays a message for the user
    // event.x provides the x coordinate and event.y provides the y coordinate

    game.add.sprite(event.x, event.y, "playerImg");
    //adds an the image where you click
}

function spaceHandler() {
    game.sound.play("score");
    player.body.velocity.y = jumpPower;
}

function changeScore() {
    score += 1;

    // can use ++
    //labelScore.setText(score.toString());
    labelScore.destroy();
    labelScore = game.add.text(20, 20, score.toString());

}


function moveRight() {
    player.body.velocity.x = 100;

}


function generatePipe() {
    var gapStart = game.rnd.integerInRange(50, height - 50 - pipeGap);

    addPipeEnd(width - 5, gapStart - 25);
    for (var y = gapStart - 75; y > -50; y -= 50) {
        addPipeBlock(width, y);
    }
    addPipeEnd(width - 5, gapStart + pipeGap);
    for (var y = gapStart + pipeGap + 25; y < height; y += 50) {
        addPipeBlock(width, y);
    }
    changeScore();


}


function addPipeBlock(x, y) {
    var block = game.add.sprite(x, y, "pipe");
    pipes.push(block);

    game.physics.enable(block);
    block.body.velocity.x = -200
}

function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeEnd");
    pipes.push(block);

    game.physics.enable(block);
    block.body.velocity.x = -200


}


$.get("/score", function (scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;


}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 2);
    if (diceRoll == 1) {
        generateYarn();
    }
    else {
        generatePipe();

    }
}

function generateYarn() {
    var bonus = game.add.sprite(width, height, "yarn");
    yarn.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);


}


function checkBonus(bonusArray, bonusEffect) {
    // Step backwards in the array to avoid index errors from splice
    for (var i = bonusArray.length - 1; i >= 0; i--) {
        game.physics.arcade.overlap(player, bonusArray[i], function () {
            // destroy sprite
            bonusArray[i].destroy();
            // remove element from array
            bonusArray.splice(i, 1);
            // apply the bonus effect
            changeGravity(bonusEffect);
        });
    }


}

// function Name (arguments)

