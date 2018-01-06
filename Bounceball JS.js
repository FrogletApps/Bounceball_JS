var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;


var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = 2;
var dy = -2;
var ballRadius = 10;

var paddleHeight = 100;
var paddleWidth = 10;
var rightpaddleY = 0;
var leftpaddleY = 0;

var leftscore = 0;
var rightscore = 0;

var bouncecount = 0;

var debugmode = true;

var menu = false;

var downPressed = false;
var upPressed = false;
var wPressed = false;
var sPressed = false;

var ballcolour = "#000";
var leftcolour = "#95DD00";
var rightcolour = "#00DD95";

function keyDownHandler(e) {
    if (e.keyCode == 40) {
        //down
        downPressed = true;
    }
    else if (e.keyCode == 38) {
        //up
        upPressed = true;
    }
    if (e.keyCode == 83) {
        //a
        sPressed = true;
    }
    else if (e.keyCode == 87) {
        //w
        wPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 40) {
        //down
        downPressed = false;
    }
    else if (e.keyCode == 38) {
        //up
        upPressed = false;
    }
    if (e.keyCode == 83) {
        //s
        sPressed = false;
    }
    else if (e.keyCode == 87) {
        //w
        wPressed = false;
    }
}
function debug() {
    if (debugmode == true) {
        ctx.font = "9px Roboto";
        ctx.fillStyle = "#AAA";
        ctx.fillText("Debug Mode", canvas.width / 2, 10);
        ctx.fillText("Right Score: " + rightscore, canvas.width / 2, 20);
        ctx.fillText("Left Score: " + leftscore, canvas.width / 2, 30);
        ctx.fillText("x: " + x, canvas.width / 2, 40);
        ctx.fillText("y: " + y, canvas.width / 2, 50);
        ctx.fillText("dx: " + dx, canvas.width / 2, 60);
        ctx.fillText("dy: " + dy, canvas.width / 2, 70);
        ctx.fillText("bouncecount: " + bouncecount, canvas.width / 2, 80);
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
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
    ctx.font = "100px Roboto";
    ctx.fillStyle = rightcolour;
    ctx.fillText(rightscore, canvas.width - 100, 100);
    ctx.fillStyle = leftcolour;
    ctx.fillText(leftscore, 50, 100);
}

function canvasResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //reset ball position if outside canvas
    if (x > canvas.width || x < 0 || y > canvas.height || y < 0) {
        x = canvas.width / 2;
        y = canvas.height / 2;
    }
}
//find a way to dynamically adjust speed?  Is this really needed?
//This could be used if you resize the canvas to fit the page
//
//dx = dx * 1 + canvas.width / 50000;
//canvasspeedmodify = 1 + canvas.width / 50000;

function draw() {
    if (menu == false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //do all the functions!
        //canvasResize();
        drawBall();
        drawPaddleRight();
        drawPaddleLeft();
        drawScores();
        debug();
        //make the ball move
        x += dx;
        y += dy;

        //If Left Hits Ball
        if ((x + dx) - paddleWidth < ballRadius && y > leftpaddleY && y < leftpaddleY + paddleHeight) {
            dx = -(dx * 1.05);
            dy = dy * 1.02;
            leftscore++;
            bouncecount++;
            ballcolour = "#95DD00";
            //Make the ball bounce back if sideswiped
            if (sPressed == true && dy < 0) {
                dy = -dy;
            }
            if (wPressed == true && dy > 0) {
                dy = -dy;
            }
        }
    }
    //If Left Misses Ball
    if (x + dx < ballRadius) {
        dx = -(dx * 0.95);
        dy = dy * 0.99;
        leftscore--;
        bouncecount++;
        ballcolour = "#000";
    }

    //If Right Hits Ball
    if ((x + dx) + paddleWidth > canvas.width - ballRadius && y > rightpaddleY && y < rightpaddleY + paddleHeight) {
        dx = -(dx * 1.05);
        dy = dy * 1.02;
        rightscore++;
        bouncecount++;
        ballcolour = "#00DD95";
        //Make the ball bounce back if sideswiped
        if (downPressed == true && dy < 0) {
            dy = -dy;
        }
        if (upPressed == true && dy > 0) {
            dy = -dy;
        }
    }

    //If Right Misses Ball
    if (x + dx > canvas.width - ballRadius) {
        dx = -(dx * 0.95);
        dy = dy * 0.99;
        rightscore--;
        bouncecount++;
        ballcolour = "#000";
    }

    if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }
    //Control right paddle
    if (downPressed && rightpaddleY < canvas.height - paddleHeight) {
        rightpaddleY += 7;
    }
    else if (upPressed && rightpaddleY > 0) {
        rightpaddleY -= 7;
    }
    //Control left paddle
    if (sPressed && leftpaddleY < canvas.height - paddleHeight) {
        leftpaddleY += 7;
    }
    else if (wPressed && leftpaddleY > 0) {
        leftpaddleY -= 7;
    }
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
draw();