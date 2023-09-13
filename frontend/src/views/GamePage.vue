<template>
  <div class="game">
    <h2>Ping Pong</h2>
    <div class="field">
      <canvas ref="canvas" width="600" height="400"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;
}

export default {
  setup() {
    const canvas = ref<HTMLCanvasElement | null>(null);
    const context = ref<CanvasRenderingContext2D | null>(null);
    const framePerSecond = 50;
    let loop: number | null = null;

    const player: Player = {
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      color: "white",
      score: 0,
    };

    const com: Player = {
      x: 590,
      y: 0,
      width: 10,
      height: 100,
      color: "white",
      score: 0,
    };

    const net = {
      x: 300,
      y: 0,
      width: 2,
      height: 10,
      color: "white",
    };

    const ball = {
      x: 0,
      y: 0,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
      color: "white",
    };

    const initGame = () => {
      if (canvas.value && context.value) {
        ball.x = canvas.value!.width / 2;
        ball.y = canvas.value!.height / 2;

        player.score = 0;
        com.score = 0;
      }
    };

    const movePaddle = (evt: MouseEvent) => {
      const rect = canvas.value!.getBoundingClientRect();
      player.y = evt.clientY - rect.top - player.height / 2;
    };

    const update = () => {
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      const computerLevel = 0.1;
      com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

      if (
        ball.y + ball.radius > canvas.value!.height ||
        ball.y - ball.radius < 0
      ) {
        ball.velocityY = -ball.velocityY;
      }

      const user =
        ball.x + ball.radius < canvas.value!.width / 2 ? player : com;
      if (collision(ball, user)) {
        let collidePoint = ball.y - (user.y + user.height / 2);
        collidePoint = collidePoint / (user.height / 2);

        const angleRad = (Math.PI / 4) * collidePoint;
        const direction =
          ball.x + ball.radius < canvas.value!.width / 2 ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        ball.speed += 0.1;
      }
    };

    const collision = (ball: any, player: any): boolean => {
      player.top = player.y;
      player.bottom = player.y + player.height;
      player.left = player.x;
      player.right = player.x + player.width;

      ball.top = ball.y - ball.radius;
      ball.bottom = ball.y + ball.radius;
      ball.left = ball.x - ball.radius;
      ball.right = ball.x + ball.radius;

      return (
        ball.right > player.left &&
        ball.top < player.bottom &&
        ball.left < player.right &&
        ball.bottom > player.top
      );
    };

    const render = () => {
      if (canvas.value && context.value) {
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
        drawRect(0, 0, canvas.value.width, canvas.value.height, "black");
        drawText(
          player.score,
          canvas.value.width / 4,
          canvas.value.height / 5,
          "white"
        );
        drawText(
          com.score,
          (3 * canvas.value.width) / 4,
          canvas.value.height / 5,
          "white"
        );
        drawNet();
        drawRect(player.x, player.y, player.width, player.height, player.color);
        drawRect(com.x, com.y, com.width, com.height, com.color);
        drawCircle(ball.x, ball.y, ball.radius, ball.color);
      }
    };

    const drawRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string
    ) => {
      if (context.value) {
        context.value.fillStyle = color;
        context.value.fillRect(x, y, w, h);
      }
    };

    const drawCircle = (x: number, y: number, r: number, color: string) => {
      if (context.value) {
        context.value.fillStyle = color;
        context.value.beginPath();
        context.value.arc(x, y, r, 0, Math.PI * 2, true);
        context.value.closePath();
        context.value.fill();
      }
    };

    const drawText = (text: number, x: number, y: number, color: string) => {
      if (context.value) {
        context.value.fillStyle = color;
        context.value.font = "75px fantasy";
        context.value.fillText(text.toString(), x, y);
      }
    };

    const drawNet = () => {
      if (context.value) {
        for (let i = 0; i <= canvas.value!.height; i += 15) {
          drawRect(net.x, net.y + i, net.width, net.height, net.color);
        }
      }
    };

    const game = () => {
      update();
      render();
    };

    onMounted(() => {
      canvas.value = canvas.value as HTMLCanvasElement;
      context.value = canvas.value?.getContext("2d");
      if (canvas.value && context.value) {
        initGame();
        loop = setInterval(game, 1000 / framePerSecond);
      }
    });

    onBeforeUnmount(() => {
      if (loop) {
        clearInterval(loop);
      }
    });

    return {
      canvas,
      movePaddle,
    };
  },
};
</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #24272c;
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  color: white;
}

.field {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #34373d;
  margin-bottom: 5px;
  width: 98%;
  height: 100%;
  margin-bottom: 5px;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
}
</style>
