        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        var ballX = canvas.width / 2;       //X dimension of ball
        var ballY = canvas.height / 2;      //Y dimension of ball
        var ballVelModX = 0;                //Modifiers to change the speed depending on size of window
        var ballVelModY = 0;
        var balldx = 2;                     //Base speed of ball without modifier
        var balldy = -2;
        var ballVelX = 0;                   //speed of ball with modifiers (balldx * ballVelModX)
        var ballVelY = 0;                   //(balldy * ballVelModY)
        var ballRadius = 10;

        var paddleHeight = 100;
        var paddleWidth = 10;
        var rightpaddleY = 15;
        var leftpaddleY = 15;
        var paddleVel = 10;
//        var leftComputerDifficulty = 1;  //difficulty of game with computers (between 0.5 and 1)
//        var rightComputerDifficulty = 1;

        var leftscore = 0;
        var rightscore = 0;
        var winscore = 10;

        var bouncecount = 0;

        var debugmode = true;
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

        //Recognise keypresses
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
            if (e.keyCode == 82) {
                //r
                resetGame();
            }
            if (e.keyCode == 74) {
                //j
                debugToggle();
            }
            if (e.keyCode == 49) {
                //1
                if (computerLeft == true) {
                    computerLeft = false;
                }
                else {
                    computerLeft = true;
                }
            }
            else if (e.keyCode == 50) {
                //2
                if (computerRight == true) {
                    computerRight = false;
                }
                else {
                    computerRight = true;
                }
            }
        //when keys released
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

        //Toggle whether debug text is shown
        function debugToggle() {
            if (debugmode == true) {
                debugmode = false;
            }
            else {
                debugmode = true;
            }
        }

        //stuff in debug text
        function debug() {
            if (debugmode == true) {
                ctx.textAlign = "center";
                ctx.font = "9px Consolas";
                ctx.fillStyle = "#AAA";
                ctx.fillText("Debug Mode", canvas.width / 2, 10);
                ctx.fillText("Right Score: " + rightscore, canvas.width / 2, 20);
                ctx.fillText("Left Score: " + leftscore, canvas.width / 2, 30);
                ctx.fillText("ballX: " + ballX, canvas.width / 2, 40);
                ctx.fillText("ballY: " + ballY, canvas.width / 2, 50);
                ctx.fillText("balldx: " + balldx, canvas.width / 2, 60);
                ctx.fillText("balldy: " + balldy, canvas.width / 2, 70);
                ctx.fillText("bouncecount: " + bouncecount, canvas.width / 2, 80);
                ctx.fillText("modX: " + ballVelModX, canvas.width / 2, 90);
                ctx.fillText("modY: " + ballVelModY, canvas.width / 2, 100);
                ctx.fillText("missballleft: " + missBallProbLeft, canvas.width / 2, 110);
                ctx.fillText("PRESS J TO HIDE", canvas.width / 2, 120);
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
            ctx.fillStyle = rightcolour;
            ctx.fillText(rightscore, canvas.width - 100, 100);
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
            //reset ball position to middle if outside right border
            if (ballX + ballRadius > canvas.width) {
                ballX = canvas.width/2;
            }
            //move ball up slightly if outside bottom border
            if (ballY + ballRadius> canvas.height) {
                ballY = canvas.height - ballRadius;
            }
            //move left paddle if outside border
            if (leftpaddleY + paddleHeight > canvas.height) {
                leftpaddleY = canvas.height - paddleHeight
            }
            //move right paddle if outside border
            if (rightpaddleY + paddleHeight > canvas.height) {
                rightpaddleY = canvas.height - paddleHeight
            }
        }

        function endGame() {
            gameover = true;
            ctx.textAlign = "center";
            ctx.font = "50px Segoe UI";
            ctx.fillStyle = rightcolour;
            ctx.fillText("Right Score: " + rightscore, (canvas.width / 2), (canvas.height / 2) + 75);
            ctx.fillStyle = leftcolour;
            ctx.fillText("Left Score: " + leftscore, (canvas.width / 2), (canvas.height / 2) - 75);
        }

        function resetGame() {
            //reset to initial values
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
            //make the ball move
            ballVelX = balldx * ballVelModX;
            ballVelY = balldy * ballVelModY;
            ballX += ballVelX;
            ballY += ballVelY;

            //If Left Hits Ball
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
                //this is the computer's chance of hitting the ball
                missBallProbLeft = randomNum(0, 3);
            }

            //If Left Misses Ball
            if (ballX + balldx < ballRadius) {
                balldx = -(balldx * randomNum(0.90, 0.99));
                balldy = balldy * randomNum(0.98, 1.00);
                leftscore--;
                bouncecount++;
                ballcolour = "#000";
                //this is the computer's chance of hitting the ball
                missBallProbLeft = randomNum(0, 3);
            }

            //If Right Hits Ball
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

            //If Right Misses Ball
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
                //Right Paddle Down
                else if (upPressed && rightpaddleY > 0) {
                    rightpaddleY -= paddleVel;
                }
            }

            //Right - Computer controls paddle
            else {
                //Right Paddle Up
                if (ballY + ballRadius / 2 > rightpaddleY + paddleHeight / 4 && rightpaddleY < canvas.height - paddleHeight) {
                    rightpaddleY += paddleVel / 2;
                }
                //Right Paddle Down
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
                //Left Player in control
                //Left Paddle Up
                if (sPressed && leftpaddleY < canvas.height - paddleHeight) {
                    leftpaddleY += paddleVel;
                }
                //Left Paddle Down
                else if (wPressed && leftpaddleY > 0) {
                    leftpaddleY -= paddleVel;
                }
            } else {

            }
        }

        function draw() {
            //do all the functions!
            canvasResize();
            drawBall();
            drawPaddleRight();
            drawPaddleLeft();
            drawScores();
            debug();
            if (leftscore >= winscore || rightscore >= winscore) {
                //check to see if either player has won the game
                endGame();
            }
            if (gameover == false) {
                //run only while the game is being played
                ballControl();
                paddleControl();
            }
            requestAnimationFrame(draw);
        }
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
draw();