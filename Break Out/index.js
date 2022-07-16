const grid=document.querySelector(".grid")
const scoreDisplay=document.querySelector("#score")

const blockWidth=100;
const blockHight=20;
const boardWidth=560;
const boardHeight=300;

const userStart=[230,10];
let userCurrentPosition=userStart;

const ballStart=[270,30];
let ballCurrentPosition=ballStart;

let timerID;

const ballDiameter=20;

let xDirection=2;
let yDirection=2;

let score=0;



//#region BLOCKS

//Create Block
class Block{
    constructor(xAxis,yAxis){
       
        //this.style=([xAxis,yAxis]+"px")+([xAxis+blockWidth,yAxis]+"px")+([xAxis,yAxis+blockHight]+"px")+([xAxis+blockWidth,yAxis+blockHight]+"px")

        this.bottomLeft=[xAxis,yAxis]
        this.bottomRight=[xAxis+blockWidth,yAxis]
        this.topLeft=[xAxis,yAxis+blockHight]
        this.topRight=[xAxis+blockWidth,yAxis+blockHight]

     }
}

// All my Blocks
const blocks=[
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),

    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),

    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210)
   
]


// Draw all my Blocks
function addBlocks(){
    for(i=0; i<blocks.length;i++){
        const block=document.createElement("div");
        block.classList.add("block")
        block.style.left=blocks[i].bottomLeft[0]+"px"
        block.style.bottom=blocks[i].bottomLeft[1]+"px"

        grid.appendChild(block)
    }
}

addBlocks()

//#endregion

//#region USER

//Draw User
function drawUser(){
    user.style.left=userCurrentPosition[0]+"px"
    user.style.bottom=userCurrentPosition[1]+"px"
}

// Add User 
const user =document.createElement("div");
user.classList.add("user")
drawUser()
grid.appendChild(user)

//Move User
function moveUser(e){
   
    switch(e.key){
        case "ArrowLeft":
            if(userCurrentPosition[0]>0){
                userCurrentPosition[0] -=10
                user.style.left=userCurrentPosition[0]+"px"
                drawUser()
            }
            break;
           
        case "ArrowRight":
             if(userCurrentPosition[0]<boardWidth-blockWidth){      //   boardWidth-blockWidth=460
                userCurrentPosition[0] +=10
                 user.style.right=userCurrentPosition[0]+"px"
                drawUser()
            }
            break;
    }
}

document.addEventListener("keydown",moveUser)

//#endregion

//#region BALL

//Draw Ball
function drawBall(){
    ball.style.left=ballCurrentPosition[0]+"px"
    ball.style.bottom=ballCurrentPosition[1]+"px"
}

//Add Ball
const ball=document.createElement("div")
ball.classList.add("ball")
drawBall()
grid.appendChild(ball)

//Move Ball
function moveBall(){
    ballCurrentPosition[0] +=xDirection;
    ballCurrentPosition[1] +=yDirection;
    drawBall();
    checkForCollisions()
}

timerID=setInterval(moveBall,10)

//#endregion

//Change Direction
function changeDirection(){

   if(xDirection===2 && yDirection===2){
      yDirection=-2;
      return
   }

   if(xDirection===2 && yDirection===-2){
      xDirection=-2;
      return
   }

  if(xDirection===-2 && yDirection===-2){
      yDirection=2;
      return
   }

  if(xDirection===-2 && yDirection===2){
      xDirection=2;
      return
   }

}

//Check for Collisions
function checkForCollisions(){

    //Check for Block Collisions
    for(let i=0; i<blocks.length; i++){
      
        if(  
            (ballCurrentPosition[0]>blocks[i].bottomLeft[0]) && 
            (ballCurrentPosition[0]<blocks[i].bottomRight[0] ) &&
            ( (ballCurrentPosition[1]+ballDiameter) > blocks[i].bottomLeft[1]) &&
            (ballCurrentPosition[1]<blocks[i].topLeft[1]) 
             ){
           
          const allBlocks=Array.from(document.querySelectorAll(".block"))
          allBlocks[i].classList.remove("block")
          blocks.splice(i,1)
          changeDirection()
          score++
          scoreDisplay.innerHTML=score;

          winGame()

        }
    }

    //Check for User Collisions
    if( 
        (ballCurrentPosition[0]>userCurrentPosition[0]) &&
        (ballCurrentPosition[0]<userCurrentPosition[0]+blockWidth ) &&
        (ballCurrentPosition[1]>userCurrentPosition[1]) &&
        (ballCurrentPosition[1]<userCurrentPosition[1]+blockHight)
        ){

        changeDirection()
    }


   //Check for Wall of Collisions
   if( (ballCurrentPosition[0]>=(boardWidth-ballDiameter))||
       (ballCurrentPosition[1]>=(boardHeight-ballDiameter))||
       (ballCurrentPosition[0]<0)
       ){
       changeDirection()
   }



  
   gameover()


}


//check for Game Over
function gameover(){
    if(ballCurrentPosition[1]<0){
        clearInterval(timerID)
        document.removeEventListener("keydown",moveUser)
        scoreDisplay.innerHTML="you Lose"
       }
}

//Win the Game
function winGame(){
    if(blocks.length===0){
        scoreDisplay.innerHTML="You Win !!!"
        clearInterval(timerID)
        document.removeEventListener("keydown",moveUser)
    }
}