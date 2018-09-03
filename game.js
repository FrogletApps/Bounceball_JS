var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballX = canvas.width / 2;       //X dimension of ball
var ballY = canvas.height / 2;      //Y dimension of ball
var ballVelModX = 0;                //Modifier to change the speed in the X direction depending on size of window
var ballVelModY = 0;                //Modifier to change the speed in the Y direction depending on size of window
var balldx = 2;                     //Base speed of ball in the x direction without modifier
var balldy = -2;                    //Base speed of ball in the x direction without modifier
var ballVelX = 0;                   //Speed of ball with modifiers (balldx * ballVelModX)
var ballVelY = 0;                   //Speed of ball with modifiers (balldy * ballVelModY)
var ballRadius = 10;                //Radius of the ball

var paddleHeight = 100;
var paddleWidth = 10;
var rightpaddleY = 15;
var leftpaddleY = 15;
var paddleVel = 10;
//var leftComputerDifficulty = 1;  //Difficulty of game with computers (between 0.5 and 1)
//var rightComputerDifficulty = 1; //Difficulty of game with computers (between 0.5 and 1)

var leftscore = 0;
var rightscore = 0;
var winscore = 10;

var bouncecount = 0;

var debugMode = false;

var computerRight = true;
var computerLeft = false;

var missBallProbLeft = 0;
var missBallProbRight = 0;
var leftCPUmiss = 0;

var gameover = false;

var downPressed = false;
var upPressed = false;
var wPressed = false;
var sPressed = false;

var ballcolour = "#000";
var leftcolour = "#95DD00";
var rightcolour = "#00DD95";

var winner = "";

//Recognise keypresses
function keyDownHandler(e) {
    //Down key pressed
    if (e.keyCode == 40) {
        downPressed = true;
    }
    //Up key pressed
    else if (e.keyCode == 38) {
        upPressed = true;
    }
    //"s" key pressed
    if (e.keyCode == 83) {
        sPressed = true;
    }
    //"w" key pressed
    else if (e.keyCode == 87) {
        wPressed = true;
    }
    //"r" key pressed
    if (e.keyCode == 82) {
        resetGame();
    }
    //"j" key pressed  (Toggle debug mode)
    if (e.keyCode == 74) {
        debugMode = !debugMode;
    }
    //"1" key pressed  (Toggle whether computerLeft is active)
    if (e.keyCode == 49) {
        computerLeft = !computerLeft;
    }
    //"2" key pressed  (Toggle whether computerRight is active)
    else if (e.keyCode == 50) {
        computerRight = !computerRight;
    }
}

//Recognise when keys are released
function keyUpHandler(e) {
    //Down key released
    if (e.keyCode == 40) {
        downPressed = false;
    }
    //Up key released
    else if (e.keyCode == 38) {
        upPressed = false;
    }
    //"s" key released
    if (e.keyCode == 83) {
        sPressed = false;
    }
    //"w" key released
    else if (e.keyCode == 87) {
        wPressed = false;
    }
}

//Function to make numbers positive
function makePositive(number) {
    if (number < 0) {
        return number = number * -1;
    }
    else {
        return number;
    }
}

//Function to generate a random number
function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

//Debug text stuff
function debug() {
    //Middle of the screen
    var middleX = canvas.width / 2;

    if (debugMode == true) {
        ctx.textAlign = "center";
        ctx.font = "11px Consolas";
        ctx.fillStyle = "#AAA";
        ctx.fillText("DEBUG MODE", middleX, 10);
        ctx.fillText("Press J to hide", middleX, 20);

        ctx.font = "9px Consolas";
        ctx.fillText("Right Score: " + rightscore, middleX, 40);
        ctx.fillText("Left Score: " + leftscore, middleX, 50);
        ctx.fillText("ballX: " + ballX, middleX, 60);
        ctx.fillText("ballY: " + ballY, middleX, 70);
        ctx.fillText("balldx: " + balldx, middleX, 80);
        ctx.fillText("balldy: " + balldy, middleX, 90);
        ctx.fillText("bouncecount: " + bouncecount, middleX, 100);
        ctx.fillText("modX: " + ballVelModX, middleX, 110);
        ctx.fillText("modY: " + ballVelModY, middleX, 120);
        ctx.fillText("missballleft: " + missBallProbLeft, middleX, 130);
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ballcolour;
    ctx.fill();
    ctx.closePath();
}

function drawPaddleRight() {
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, rightpaddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = rightcolour;
    ctx.fill();
    ctx.closePath();
}

function drawPaddleLeft() {
    ctx.beginPath();
    ctx.rect(0, leftpaddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = leftcolour;
    ctx.fill();
    ctx.closePath();
}

function drawScores() {
    ctx.font = "100px Segoe UI Light";
    ctx.textAlign = "right";
    ctx.fillStyle = rightcolour;
    ctx.fillText(rightscore, canvas.width - 50, 100);
    ctx.textAlign = "left";
    ctx.fillStyle = leftcolour;
    ctx.fillText(leftscore, 50, 100);
}

//Dynamically resize canvas and change game objects to fit
function canvasResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ballVelModX = canvas.width/375;
    ballVelModY = canvas.height / 375;
    paddleHeight = canvas.height / 5;
    paddleWidth = canvas.width / 100;
    paddleVel = canvas.height / 100;
    ballRadius = ((canvas.height + canvas.width) / 2) / 50;
    //Reset ball position to middle if outside right border
    if (ballX + ballRadius > canvas.width) {
        //ballX = canvas.width/2;
        ballX = canvas.width - ballRadius*2
    }
    //Move ball up slightly if outside bottom border
    if (ballY + ballRadius> canvas.height) {
        ballY = canvas.height - ballRadius;
    }
    //Move left paddle if outside border
    if (leftpaddleY + paddleHeight > canvas.height) {
        leftpaddleY = canvas.height - paddleHeight
    }
    //Move right paddle if outside border
    if (rightpaddleY + paddleHeight > canvas.height) {
        rightpaddleY = canvas.height - paddleHeight
    }
}

function endGame(winner) {
    gameover = true;
    ctx.textAlign = "center";
    ctx.font = "50px Segoe UI";
    ctx.fillStyle = "#000";
    ctx.fillText(winner + " wins!", (canvas.width / 2), (canvas.height / 2) - 75);
    ctx.fillStyle = rightcolour;
    ctx.fillText("Right Score: " + rightscore, (canvas.width / 2), (canvas.height / 2));
    ctx.fillStyle = leftcolour;
    ctx.fillText("Left Score: " + leftscore, (canvas.width / 2), (canvas.height / 2) + 75);
}

function resetGame() {
    //Reset to initial values
    gameover = false;
    leftscore = 0;
    rightscore = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    balldx = 2;
    balldy = -2;
    ballcolour = "#000";
}

function ballControl() {
    //Make the ball move
    ballVelX = balldx * ballVelModX;
    ballVelY = balldy * ballVelModY;
    ballX += ballVelX;
    ballY += ballVelY;

    //If left hits ball
    if ((ballX + balldx) - paddleWidth < ballRadius && ballY > leftpaddleY && ballY < leftpaddleY + paddleHeight) {
        balldx = -(balldx * randomNum(1.01, 1.05));
        balldy = balldy * randomNum(1.01, 1.03);
        leftscore++;
        bouncecount++;
        ballcolour = "#95DD00";
        //Make the ball bounce back if paddle swipes it
        if (sPressed == true && balldy < 0) {
            balldy = -balldy;
        }
        if (wPressed == true && balldy > 0) {
            balldy = -balldy;
        }
        //This is the computer's chance of hitting the ball
        //missBallProbLeft = randomNum(0, 3);
    }

    //If left misses ball
    if (ballX + balldx < ballRadius) {
        balldx = -(balldx * randomNum(0.90, 0.99));
        balldy = balldy * randomNum(0.98, 1.00);
        leftscore--;
        bouncecount++;
        ballcolour = "#000";
        //This is the computer's chance of hitting the ball
        //missBallProbLeft = randomNum(0, 3);
    }

    //If right hits ball
    if ((ballX + balldx) + paddleWidth > canvas.width - ballRadius && ballY > rightpaddleY && ballY < rightpaddleY + paddleHeight) {
        balldx = -(balldx * randomNum(1.01, 1.05));
        balldy = balldy * randomNum(1.01, 1.03);
        rightscore++;
        bouncecount++;
        ballcolour = "#00DD95";
        //Make the ball bounce back if paddle swipes it
        if (downPressed == true && balldy < 0) {
            balldy = -balldy;
        }
        if (upPressed == true && balldy > 0) {
            balldy = -balldy;
        }
    }

    //If right misses ball
    if (ballX + balldx > canvas.width - ballRadius) {
        balldx = -(balldx * randomNum(0.9, 0.99));
        balldy = balldy * randomNum(0.98, 1.00);
        rightscore--;
        bouncecount++;
        ballcolour = "#000";
    }

    //If ball hits the top or bottom borders
    if (ballY + balldy > canvas.height - ballRadius || ballY + balldy < ballRadius) {
        balldy = -balldy * randomNum(0.9, 1.1);
    }
}

function paddleControl() {
    //Right paddle
    if (computerRight == false) {
        //Right - Player controls paddle
        //Right Paddle Up
        if (downPressed && rightpaddleY < canvas.height - paddleHeight) {
            rightpaddleY += paddleVel;
        }
        //Right paddle down
        else if (upPressed && rightpaddleY > 0) {
            rightpaddleY -= paddleVel;
        }
    }

    //Right - Computer controls paddle
    else {
        //Right paddle up
        if (ballY + ballRadius / 2 > rightpaddleY + paddleHeight / 4 && rightpaddleY < canvas.height - paddleHeight) {
            rightpaddleY += paddleVel / 2;
        }
        //Right paddle down
        else if (ballY + ballRadius / 2 < rightpaddleY + paddleHeight - paddleHeight / 4 && rightpaddleY > 0) {
            rightpaddleY -= paddleVel / 2;
        }
        //Ball in middle and is going up
        else if (balldy >= 0) {
            rightpaddleY += paddleVel /4;
        }
        //Ball in middle and is going down
        else if (balldy < 0) {
            rightpaddleY -= paddleVel / 4;
        }
    }

    //Left paddle
    if (computerLeft == false) {
        //Left player in control
        //Left paddle up
        if (sPressed && leftpaddleY < canvas.height - paddleHeight) {
            leftpaddleY += paddleVel;
        }
        //Left paddle down
        else if (wPressed && leftpaddleY > 0) {
            leftpaddleY -= paddleVel;
        }
    }

    //Right - Computer controls paddle
    else {
        //Right paddle up
        if (ballY + ballRadius / 2 > leftpaddleY + paddleHeight / 4 && leftpaddleY < canvas.height - paddleHeight) {
            leftpaddleY += paddleVel / 2;
        }
        //Right paddle down
        else if (ballY + ballRadius / 2 < leftpaddleY + paddleHeight - paddleHeight / 4 && leftpaddleY > 0) {
            leftpaddleY -= paddleVel / 2;
        }
        //Ball in middle and is going up
        else if (balldy >= 0) {
            leftpaddleY += paddleVel /4;
        }
        //Ball in middle and is going down
        else if (balldy < 0) {
            leftpaddleY -= paddleVel / 4;
        }
    }
}


//Do all the functions!
function draw() {
    canvasResize();
    drawBall();
    drawPaddleRight();
    drawPaddleLeft();
    drawScores();
    debug();
    //Check to see if either player has won the game
    if (leftscore >= winscore) {
        endGame("Left");
    }
    if (rightscore >= winscore) {
        endGame("Right");
    }
    //Only run these while the game is being played
    if (gameover == false) {
        ballControl();
        paddleControl();
    }
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
draw();