<template>
    <div class="game-container" v-if="isGameSelectVisible">
            <GameSelect @updateGameMode="handleGameModeUpdate" @updateGameType="handleGameTypeUpdate"/>
    </div>
    <div class="loading-container" v-if="isOnlineGame">
            <LoadingComponent ></LoadingComponent>
    </div>
	<div class="conta-count" v-if="gameCountdown > 0">
		<div>
			Game starts in
		</div>
		<div >
			{{ gameCountdown }}
		</div>
    </div>
    <div class="canvas-container" v-show="isCanvasVisible">
		<div class="score" >
			<div class="left-side">
				<div class="login">
					{{ LoginPlayer1 }}
				</div>
				{{ leftPlayerScore }}
			</div>
			<font-awesome-icon icon="fa-solid fa-person-running" class="cursor-pointer"  @click=""/>
			<div class="right-side">
				<div class="login">
					{{ LoginPlayer2 }}
				</div>
				{{ rightPlayerScore }}
			</div>
		</div>
        <canvas width="900" height="600" ref="pongCanvas" id="pong"></canvas>
    </div>
	<Result v-if="winnerCompo" :winner="winnerLogin" class="winner">
	</Result>
    <!-- <LoadingComponent v-if="isOnlineGame"></LoadingComponent> -->
</template>


<script lang="ts" setup>
import { ref, onMounted , getCurrentInstance, onBeforeUnmount, reactive} from 'vue';
import WebSocketPlugin from '@/plugins/websocket-plugin';
import GameSelect from '@/components/GameSelect.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import Result from '@/components/Result.vue'

import { Socket } from 'socket.io-client';

    const isOnlineGame = ref<Boolean | false>(false);
    const rightPlayerScore = ref<number | 0>(0);
    const leftPlayerScore = ref<number | 0>(0);
    const winnerCompo = ref<boolean | false>(false);
	const LoginPlayer1 = ref<string | null>(null)
	const color_map = ref<string | null>(null);
	const LoginPlayer2 = ref<string | null>(null)
	const isGameSelectVisible = ref(true);
	const gameCountdown = ref(0);
	const isCanvasVisible = ref(true); 
    const winnerLogin = ref<string | null>(null);
    const pongCanvas =  ref<HTMLCanvasElement | null>(null);
    // color_map.value = "white";

    function handleGameModeUpdate(isOnline:Boolean) {
        console.log("this is the value ",isOnline);
        isOnlineGame.value = isOnline;
        isGameSelectVisible.value = false;
    }

    function handleGameTypeUpdate(isOnline:Boolean) {
        if (isOnline)
        {
            color_map.value = "#200E3A";
            console.log("from insde the ggame type");
        }
    }

	
	interface Paddle { 
		x: number,
		y: number,
		width:number,
		height:number,
		speed: number,
		color: string
		// Add other player properties here
	}
	interface Player {
		score: number;
		login: string;
		paddle: Paddle,
		game_type:string,
		status: string,
		// Add other player properties here
	}
	interface GameData {
		players: Player[];
		ball: {
			x:number,
			y:number,
			dx:number,
			dy:number,
			radius:number,
			color:string,
		};
	}
    
    const keys: { [key: string]: boolean } = {
        ArrowUp: false,
        ArrowDown: false,
    }

	let socket: Socket;
	const currentGameData = reactive<GameData>({
		players: [
			{ score: 0, login: '', game_type: '', status:'' ,paddle: { x: 0, y: 0, width: 0, height: 0, color: '', speed: 0 } },
			{ score: 0, login: '', game_type: '', status:'' ,paddle: { x: 0, y: 0, width: 0, height: 0, color: '', speed: 0 } },
		],
		ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 0, color: '' }
	});
	const handleKeyDown = (event: any) => {
        console.log(event);
			if (event.key === 'ArrowUp' || event.key === "ArrowUp") {
				// Move left paddle up
				// socket.emit('paddleMove','up');
                keys[event.key] = true;
                console.log("arrowUp set true");
			} else if (event.key === 'ArrowDown' || event.key === "ArrowDown") {
				// Move left paddle down
				// socket.emit('paddleMove','down');
                keys[event.key] = true;
                console.log("arrowDown set true");
			}
	};

    const handleKeyUp = (event: any) => {
        console.log(event);
			if (event.key === 'ArrowUp' || event.key === "ArrowUp") {
				// Move left paddle up
				// socket.emit('paddleMove','up');
                keys[event.key] = false;
                console.log("arrowUp set false.");
			} else if (event.key === 'ArrowDown' || event.key === "ArrowDown") {
				// Move left paddle down
				// socket.emit('paddleMove','down');
                keys[event.key] = false;
			}
	};
	// Function to add the event listener
const addEventListener = () => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
};

// Function to remove the event listener
const removeEventListener = () => {
    document.removeEventListener('keydown', handleKeyDown);
};
	function calculateGameElementPositions(canvas: HTMLCanvasElement, gameData: GameData) {
    const leftPaddle = gameData.players[0].paddle;
    const rightPaddle = gameData.players[1].paddle;
    const ball = gameData.ball;
    leftPlayerScore.value = gameData.players[0].score;
    rightPlayerScore.value = gameData.players[1].score;
    LoginPlayer1.value = gameData.players[0].login;
    LoginPlayer2.value = gameData.players[1].login;

    // console.log("this is the player1", gameData.players[0].login)
    // console.log("this is the player2", gameData.players[1].login)
    return {
        leftPaddle: {
            x: leftPaddle.x * canvas.width,
            y: leftPaddle.y * canvas.height,
            width: leftPaddle.width * canvas.width,
            height: leftPaddle.height * canvas.height
        },
        rightPaddle: {
            x: (rightPaddle.x * canvas.width) - (rightPaddle.width * canvas.width),
            y: rightPaddle.y * canvas.height,
            width: rightPaddle.width * canvas.width,
            height: rightPaddle.height * canvas.height
        },
        ball: {
            x: ball.x * canvas.width - ball.radius,
            y: ball.y * canvas.height - ball.radius,
            radius: ball.radius * Math.min(canvas.width, canvas.height)
        }
    };
}

	const drawRect = (ctx: any, x:number, y:number, width:number, height:number, color:string) => {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	};

	const drawCircle = (ctx: any, x:number, y:number, radius:number, color:string) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	};
	let animationFrameId : any;

// document.addEventListener('keydown', handleKeyDown);
    onMounted(() => {
		addEventListener()
		const instance = getCurrentInstance();
        const canvas = pongCanvas.value;
		if (canvas)
		{
		// 	const aspectRatio = 16 / 9;
        // let canvasWidth = window.innerWidth;
        // let canvasHeight = window.innerWidth / aspectRatio;

        // // Ensure the canvas is not larger than the window height
        // if (canvasHeight > window.innerHeight) {
        //     canvasHeight = window.innerHeight;
        //     canvasWidth = canvasHeight * aspectRatio;
        // }

        // canvas.width = canvasWidth;
        // canvas.height = canvasHeight;
            // canvas.width = 800;
            // canvas.height = 450;
			const ctx = canvas.getContext('2d');
			if (ctx)
			{
				const render = () => { 
						if (ctx && pongCanvas.value)
                        {
							// ctx.clearRect(0, 0, pongCanvas.value.width, pongCanvas.value.height);
							// drawRect(ctx, 0, 0, pongCanvas.value.width, pongCanvas.value.height, "white");
							// drawRect(ctx, currentGameData.players[0].paddle.x, currentGameData.players[0].paddle.y, currentGameData.players[0].paddle.width, currentGameData.players[0].paddle.height,currentGameData.players[0].paddle.color);
							// // Draw right paddle
							// drawRect(ctx, currentGameData.players[1].paddle.x, currentGameData.players[1].paddle.y, currentGameData.players[1].paddle.width, currentGameData.players[1].paddle.height, currentGameData.players[1].paddle.color);
							// // Draw ball
							// drawCircle(ctx, currentGameData.ball.x, currentGameData.ball.y, currentGameData.ball.radius, currentGameData.ball.color);
							ctx.clearRect(0, 0, pongCanvas.value.width, pongCanvas.value.height);

							drawRect(ctx, 0, 0, pongCanvas.value.width, pongCanvas.value.height, color_map.value || "white");
							// Calculate positions
							const positions = calculateGameElementPositions(pongCanvas.value, currentGameData);

							// Draw left paddle
							drawRect(ctx, positions.leftPaddle.x, positions.leftPaddle.y, positions.leftPaddle.width, positions.leftPaddle.height,  currentGameData.players[0].paddle.color);

							// Draw right paddle
							drawRect(ctx, positions.rightPaddle.x, positions.rightPaddle.y, positions.rightPaddle.width, positions.rightPaddle.height, currentGameData.players[1].paddle.color);

							// Draw ball
							drawCircle(ctx, positions.ball.x, positions.ball.y, positions.ball.radius, currentGameData.ball.color);
                        }
                    }
					const game = () => {
							calculateGameElementPositions(canvas,currentGameData);
                            render();
                            animationFrameId = requestAnimationFrame(game);
                        };
                        requestAnimationFrame(game);
			}
		}
		// document.addEventListener('keydown', handleKeyDown);
        if (instance?.proxy)
        {
             socket = instance.proxy.$socket.socket;
             if (socket)
             {
                 socket.on('game-data', (data: GameData) => {
                     console.log("this is data ", data);
                     Object.assign(currentGameData, data);
                     movePaddle();
             });
                 socket.on('game-over', (payload:any) => {
                     winnerCompo.value = true;
                     winnerLogin.value = payload.login;
                     isCanvasVisible.value = false;
             });
             socket.on('game-count', (data: any) => {
                     gameCountdown.value = data;
                     console.log("this is game count",gameCountdown.value)
                     isGameSelectVisible.value = false;
                     isOnlineGame.value = false;
                     if (gameCountdown.value <= 0 )
                     {
                         isCanvasVisible.value = true;
                     }
             });
             }
    }
    });
	onBeforeUnmount(() => {
		// document.addEventListener('keydown', handleKeyDown);
		removeEventListener();
		cancelAnimationFrame(animationFrameId);
		console.log("this is call for before onmounted ")
		socket.off('game-data');
		socket.off('game-count');
		socket.off('game-over');
	});

    const movePaddle = () => {
        console.log("Test");
        console.log(keys);
        if (keys.ArrowUp) {
            console.log("Test2");
            socket.emit('paddleMove','up');
        } else if (keys.ArrowDown) {
            socket.emit('paddleMove','down');
        }
    }
</script>

<style>
body {
	height: 100vh;
}
 /* #pong {
 padding: 10%;
 display: flex;
 justify-content: center;
 align-items: center;
 align-self: center;
 align-content: center;
} */
.canvas-container {
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  width: 100%;
}
/* .canvas-container {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
} */
.winner {
	z-index: 3;
}
.canvas-container  .score{
	display: flex;
	width: 30%;
	height: 30%;
	padding: 10px;
	justify-content: space-around;
	align-items: center;
	background-color: #650580;
	margin-top: 15px;
	color: white;
	margin-bottom: 15px;
}
.left-side, .right-side {
	display: flex;
    flex-direction: column;
    align-items: center;
	/* justify-content: center; */
}
.conta-count {
	display: flex;
	flex-direction: column;
	background-color: transparent;
	font-size: 5rem;
	justify-content: center;
	align-items: center;
	margin: 90px auto;
	width: 50%;
	height: 50vh;
}
  .game-container {
	/* width: fit-content; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
	background: linear-gradient(to right, #451952, #451952, #ae4188);
  	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5); 
	margin-top: 5%;
	padding: 20px;
	padding-bottom: 50px;
	padding-top: 50px;
	border-radius: 5px;
	width: 100%;
	color: white;
}
.loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to right, #451952, #451952, #ae4188);
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5); 
      margin-top: 5%;
      padding: 20px;
      padding-bottom: 50px;
      padding-top: 50px;
      border-radius: 5px;
      width: 100%;
      height: 50vh;
      color: white;

  }
  .game {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin-left: 35rem;
    margin-top: 10rem;
  }
</style>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  <!--
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  const canvas = ref<HTMLCanvasElement | null>(null);
  
  onMounted(() => {
	if (canvas.value) {
	  const PLAYER_WIDTH = 20;
	  const PLAYER_HEIGHT = 100;
	  const BALL_START_SPEED = 1;
	  const player = {
		x: 0,
		y: canvas.value.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#9336B4",
		score: 0,
	  };
	  const computer = {
		x: canvas.value.width - PLAYER_WIDTH,
		y: canvas.value.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#9336B4",
		score: 0,
	  };
	  const net = {
		x: canvas.value.width / 2 - 1,
		y: 0,
		width: 2,
		height: 10,
		color: "#9336B4",
	  };
	  interface Ball {
		x: number;
		y: number;
		radius: number;
		speed: number;
		dirx: number;
		diry: number;
		color: string;
	  }
	  interface Paddle {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		score: number;
	  }
	  const ball: Ball = {
		x: canvas.value.width / 2,
		y: canvas.value.height / 2,
		radius: 10,
		speed: BALL_START_SPEED,
		dirx: 5,
		diry: 5,
		color: "#19A7CE",
	  };
	  const ctx = canvas.value.getContext("2d");
	  if (ctx) {
		const drawRect = (
		  x: number,
		  y: number,
		  w: number,
		  h: number,
		  color: string
		) => {
		  ctx.fillStyle = color;
		  ctx.fillRect(x, y, w, h);
		};
		const drawCircle = (x: number, y: number, r: number, color: string) => {
		  ctx.fillStyle = color;
		  ctx.beginPath();
		  ctx.arc(x, y, r, 0, Math.PI * 2, false);
		  ctx.closePath();
		  ctx.fill();
		};
		const drawText = (text: string, x: number, y: number, color: string) => {
		  ctx.fillStyle = color;
		  ctx.font = "45px fantasy";
		  ctx.fillText(text, x, y);
		};
		const drawNet = () => {
		  if (canvas.value) {
			for (var i = 0; i <= canvas.value.height; i += 15) {
			  drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
		  }
		};
		// check collisions
		const collision = (b: Ball, p: Paddle): boolean => {
		  let paddleTopEdge = p.y;
		  let paddleBottomEdge = p.y + p.height;
		  let paddleLeftEdge = p.x;
		  let paddleRightEdge = p.x + p.width;
		  let ballTopEdge = b.y - b.radius;
		  let ballBottomEdge = b.y + b.radius;
		  let ballLeftEdge = b.x - b.radius;
		  let ballRightEdge = b.x + b.radius;
		  if (
			ballRightEdge > paddleLeftEdge &&
			ballLeftEdge < paddleRightEdge &&
			ballBottomEdge > paddleTopEdge &&
			ballTopEdge < paddleBottomEdge
		  ) {
			// Determine which side the ball hit
			let hitTop = Math.abs(ballBottomEdge - paddleTopEdge);
			let hitBottom = Math.abs(ballTopEdge - paddleBottomEdge);
			let hitLeft = Math.abs(ballRightEdge - paddleLeftEdge);
			let hitRight = Math.abs(ballLeftEdge - paddleRightEdge);
			let minHit = Math.min(hitTop, hitBottom, hitLeft, hitRight);
			if (minHit === hitTop || minHit === hitBottom) {
			  b.diry = -b.diry;
			} else {
			  b.dirx = -b.dirx;
			}
			return true;
		  }
		  return false;
		};
		// Variable to keep track of the player's movement
		let playerMovement = 0;
		let keyDownHandler = (event: KeyboardEvent) => {
		  if (event.key === "w" || event.key === "W") {
			// Move the player paddle up
			playerMovement = -7;
		  } else if (event.key === "s" || event.key === "S") {
			// Move the player paddle down
			playerMovement = 7;
		  }
		};
		let keyUpHandler = (event: KeyboardEvent) => {
		  if (
			event.key === "w" ||
			event.key === "W" ||
			event.key === "s" ||
			event.key === "S"
		  ) {
			// Stop moving the player paddle when key is released
			playerMovement = 0;
		  }
		};
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		const update = () => {
		  // Check for scoring
		  if (canvas.value) {
			if (ball.x - ball.radius < 0) {
			  // Ball has passed the left edge, point for computer
			  computer.score += 1;
			  // Reset ball to the center
			  ball.x = canvas.value.width / 2;
			  ball.y = canvas.value.height / 2;
			} else if (ball.x + ball.radius > canvas.value.width) {
			  // Ball has passed the right edge, point for player
			  player.score += 1;
			  // Reset ball to the center
			  ball.x = canvas.value.width / 2;
			  ball.y = canvas.value.height / 2;
			}
			{
			  ball.x += ball.dirx;
			  ball.y += ball.diry;
			  if (
				ball.y + ball.radius > canvas.value.height ||
				ball.y - ball.radius < 0
			  ) {
				ball.diry = -ball.diry;
			  }
			  // which player
			  var selectedPlayer: Paddle =
				ball.x < canvas.value.width / 2 ? player : computer;
			  var collisionSide = collision(ball, selectedPlayer);
			  if (collisionSide) {
				// ball.dirx = -ball.dirx;
			  }
			  // computer controal
			  var targetPos = ball.y - computer.height / 2;
			  // let current
			  computer.y = targetPos;
			  // Update the player's position based on playerMovement
			  player.y += playerMovement;
			  // Ensure the player paddle stays within the canvas boundaries
			  player.y = Math.max(
				0,
				Math.min(player.y, canvas.value.height - player.height)
			  );
			}
		  }
		};
		const render = () => {
		  if (canvas.value) {
			// Clear the entire canvas
			drawRect(0, 0, canvas.value.width, canvas.value.height, "#F6F1F1");
			// Draw elements as before
			drawNet();
			drawText(
			  player.score.toString(),
			  canvas.value.width / 4.5,
			  canvas.value.height / 5,
			  "#9336B4"
			);
			drawText(
			  computer.score.toString(),
			  (3 * canvas.value.width) / 4,
			  canvas.value.height / 5,
			  "#9336B4"
			);
			drawRect(
			  player.x,
			  player.y,
			  player.width,
			  player.height,
			  player.color
			);
			drawRect(
			  computer.x,
			  computer.y,
			  computer.width,
			  computer.height,
			  computer.color
			);
			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		  }
		};
		const game = () => {
		  update();
		  render();
		  requestAnimationFrame(game);
		};
		requestAnimationFrame(game);
	  }
	}
  });
  </script>
  
  <style scoped>
  * {
	padding: 0;
	margin: 0;
  }
  
  body {
	/* height: 100vh; */
	background: red !important;
	font-family: sans-serif;
  }
  
  .game-container {
	/* border: 3px solid #59CE8F; */
	/* border-radius: 50PX; */
	width: fit-content;
	margin: 6rem auto;
  }
  </style> -->
  

<!-- <template>
	<div class="game-container">
		<div class="game-canvas">
			<canvas ref="canvas" id="pong" width="900" height="400"></canvas>
		</div>
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  const canvas = ref<HTMLCanvasElement | null>(null);
  
  onMounted(() => {
	if (canvas.value) {
	  const PLAYER_WIDTH = 20;
	  const PLAYER_HEIGHT = 100;
	  const BALL_START_SPEED = 1;
	  const player = {
		x: 0,
		y: canvas.value.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#9336B4",
		score: 0,
	  };
	  const computer = {
		x: canvas.value.width - PLAYER_WIDTH,
		y: canvas.value.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#9336B4",
		score: 0,
	  };
	  const net = {
		x: canvas.value.width / 2 - 1,
		y: 0,
		width: 2,
		height: 10,
		color: "#9336B4",
	  };
	  interface Ball {
		x: number;
		y: number;
		radius: number;
		speed: number;
		dirx: number;
		diry: number;
		color: string;
	  }
	  interface Paddle {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
		score: number;
	  }
	  const ball: Ball = {
		x: canvas.value.width / 2,
		y: canvas.value.height / 2,
		radius: 10,
		speed: BALL_START_SPEED,
		dirx: 5,
		diry: 5,
		color: "#19A7CE",
	  };
	  const ctx = canvas.value.getContext("2d");
	  if (ctx) {
		const drawRect = (
		  x: number,
		  y: number,
		  w: number,
		  h: number,
		  color: string
		) => {
		  ctx.fillStyle = color;
		  ctx.fillRect(x, y, w, h);
		};
		const drawCircle = (x: number, y: number, r: number, color: string) => {
		  ctx.fillStyle = color;
		  ctx.beginPath();
		  ctx.arc(x, y, r, 0, Math.PI * 2, false);
		  ctx.closePath();
		  ctx.fill();
		};
		const drawText = (text: string, x: number, y: number, color: string) => {
		  ctx.fillStyle = color;
		  ctx.font = "45px fantasy";
		  ctx.fillText(text, x, y);
		};
		const drawNet = () => {
		  if (canvas.value) {
			for (var i = 0; i <= canvas.value.height; i += 15) {
			  drawRect(net.x, net.y + i, net.width, net.height, net.color);
			}
		  }
		};
		// check collisions
		const collision = (b: Ball, p: Paddle): boolean => {
		  let paddleTopEdge = p.y;
		  let paddleBottomEdge = p.y + p.height;
		  let paddleLeftEdge = p.x;
		  let paddleRightEdge = p.x + p.width;
		  let ballTopEdge = b.y - b.radius;
		  let ballBottomEdge = b.y + b.radius;
		  let ballLeftEdge = b.x - b.radius;
		  let ballRightEdge = b.x + b.radius;
		  if (
			ballRightEdge > paddleLeftEdge &&
			ballLeftEdge < paddleRightEdge &&
			ballBottomEdge > paddleTopEdge &&
			ballTopEdge < paddleBottomEdge
		  ) {
			// Determine which side the ball hit
			let hitTop = Math.abs(ballBottomEdge - paddleTopEdge);
			let hitBottom = Math.abs(ballTopEdge - paddleBottomEdge);
			let hitLeft = Math.abs(ballRightEdge - paddleLeftEdge);
			let hitRight = Math.abs(ballLeftEdge - paddleRightEdge);
			let minHit = Math.min(hitTop, hitBottom, hitLeft, hitRight);
			if (minHit === hitTop || minHit === hitBottom) {
			  b.diry = -b.diry;
			} else {
			  b.dirx = -b.dirx;
			}
			return true;
		  }
		  return false;
		};
		// Variable to keep track of the player's movement
		let playerMovement = 0;
		let keyDownHandler = (event: KeyboardEvent) => {
		  if (event.key === "w" || event.key === "W") {
			// Move the player paddle up
			playerMovement = -7;
		  } else if (event.key === "s" || event.key === "S") {
			// Move the player paddle down
			playerMovement = 7;
		  }
		};
		let keyUpHandler = (event: KeyboardEvent) => {
		  if (
			event.key === "w" ||
			event.key === "W" ||
			event.key === "s" ||
			event.key === "S"
		  ) {
			// Stop moving the player paddle when key is released
			playerMovement = 0;
		  }
		};
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		const update = () => {
		  // Check for scoring
		  if (canvas.value) {
			if (ball.x - ball.radius < 0) {
			  // Ball has passed the left edge, point for computer
			  computer.score += 1;
			  // Reset ball to the center
			  ball.x = canvas.value.width / 2;
			  ball.y = canvas.value.height / 2;
			} else if (ball.x + ball.radius > canvas.value.width) {
			  // Ball has passed the right edge, point for player
			  player.score += 1;
			  // Reset ball to the center
			  ball.x = canvas.value.width / 2;
			  ball.y = canvas.value.height / 2;
			}
			{
			  ball.x += ball.dirx;
			  ball.y += ball.diry;
			  if (
				ball.y + ball.radius > canvas.value.height ||
				ball.y - ball.radius < 0
			  ) {
				ball.diry = -ball.diry;
			  }
			  // which player
			  var selectedPlayer: Paddle =
				ball.x < canvas.value.width / 2 ? player : computer;
			  var collisionSide = collision(ball, selectedPlayer);
			  if (collisionSide) {
				// ball.dirx = -ball.dirx;
			  }
			  // computer controal
			  var targetPos = ball.y - computer.height / 2;
			  // let current
			  computer.y = targetPos;
			  // Update the player's position based on playerMovement
			  player.y += playerMovement;
			  // Ensure the player paddle stays within the canvas boundaries
			  player.y = Math.max(
				0,
				Math.min(player.y, canvas.value.height - player.height)
			  );
			}
		  }
		};
		const render = () => {
		  if (canvas.value) {
			// Clear the entire canvas
			drawRect(0, 0, canvas.value.width, canvas.value.height, "#F6F1F1");
			// Draw elements as before
			drawNet();
			drawText(
			  player.score.toString(),
			  canvas.value.width / 4.5,
			  canvas.value.height / 5,
			  "#9336B4"
			);
			drawText(
			  computer.score.toString(),
			  (3 * canvas.value.width) / 4,
			  canvas.value.height / 5,
			  "#9336B4"
			);
			drawRect(
			  player.x,
			  player.y,
			  player.width,
			  player.height,
			  player.color
			);
			drawRect(
			  computer.x,
			  computer.y,
			  computer.width,
			  computer.height,
			  computer.color
			);
			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		  }
		};
		const game = () => {
		  update();
		  render();
		  requestAnimationFrame(game);
		};
		requestAnimationFrame(game);
	  }
	}
  });
  </script>
  
  <style>

  .game-container {

	width: fit-content;
	background: linear-gradient(to right, #451952, #451952, #ae4188);
  	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5); 
	margin: 20px;
	padding: 20px;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	color: white;
  }
  .game-canvas {
	display: flex;
	justify-content: center;
	padding: 0;
	width: 100%;
	margin: 0;
	text-align: center;
  }
  </style>
   -->

   