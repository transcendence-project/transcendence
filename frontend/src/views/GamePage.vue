<template>
    <!-- <div class="game-container"> -->
         <canvas ref="pongCanvas" id="pong" :width="canvasWidth" :height="canvasHeight"></canvas>
    <!-- </div> -->
      <div>
          <button @click="startGame">Start Game</button>
      </div>
</template>


<script lang="ts" setup>
import { ref, onMounted , getCurrentInstance, onBeforeUnmount  } from 'vue';
import WebSocketPlugin from '@/plugins/websocket-plugin';
const { appContext } = getCurrentInstance();
    const socket = appContext.config.globalProperties.$socket;
    const canvasWidth = ref(900); // Default width, can be dynamically adjusted
    const canvasHeight = ref(400); // Default height, can be dynamically adjusted
    const pongCanvas =  ref<HTMLCanvasElement | null>(null);;

	let keyDownHandler = (event: KeyboardEvent) => {
		if (event.key === "w" || event.key === "W") {
			sendPaddleMovement('up');
		} else if (event.key === "s" || event.key === "S") {
			sendPaddleMovement('down');
		}
	};

	let keyUpHandler = (event: KeyboardEvent) => {
		if (
			event.key === "w" ||
			event.key === "W" ||
			event.key === "s" ||
			event.key === "S"
		) {
			sendPaddleMovement('stop')
		}
	};
	const sendPaddleMovement = (direction: string) => {
		socket.emit('paddleMove', { direction });
	};
    onMounted(() => {
    if (socket)
    {
        socket.on('table', (message: any) => {
            console.log(message);
        if (pongCanvas.value)
        {
            const ctx = pongCanvas.value.getContext('2d');
            if (ctx)
            {
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
                const render = () => { 
					if (pongCanvas.value)
					{
						drawRect(0, 0, pongCanvas.value.width, pongCanvas.value.height, "#F6F1F1");
						drawRect(0, message.paddleRe.y,message.paddleRe.width, message.paddleRe.height,"#9336B4");
						drawRect(message.compRe.x, message.compRe.y,message.compRe.width, message.compRe.height,"#9336B4");
						drawCircle(message.ball.x, message.ball.y, message.ball.radius, "#19A7CE")
					}
                }
				document.addEventListener("keydown", keyDownHandler);
				document.addEventListener("keyup", keyUpHandler);
                const game = () => {
                    // update();
                    render();
                    requestAnimationFrame(game);
                };
                requestAnimationFrame(game);
            }
        }
        });
    }
    });
    const startGame = () => {
        // if (socket) {
        //     console.log(canvas.value.offsetWidth);
        //     const canvasDimensions = {
        //         width: canvas.value.offsetWidth,
        //         height: canvas.offsetHeight,
        //     };
        //     socket.emit('start-game', canvasDimensions);
        // }
    if (pongCanvas.value) 
    {
		console.log(pongCanvas.value.offsetWidth);
        const canvasDimensions = {
            width: pongCanvas.value.offsetWidth,
            height: pongCanvas.value.offsetHeight,
        };
        socket.emit('start-game', canvasDimensions);
    } 
    else 
    {
        console.log('Canvas element not found in startGame');
    }
    };
	onBeforeUnmount(() => {
		window.removeEventListener("keyup", keyUpHandler, false);
		window.removeEventListener("keydown", keyDownHandler, false);
	});
</script>

<style>
  .game-container {
	/* width: fit-content; */
    display: flex;
    justify-content: center;
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

   