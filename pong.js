
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rectangular {
  constructor(w, h) {
    this.pos = new Vector;
    this.size = new Vector(w, h);
  }
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rectangular {
  constructor() {
    super(10, 10);
    this.velocity = new Vector;
  }
}

class Player extends Rectangular {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.ball = new Ball;

    this.ball.pos.x = 100;
    this.ball.pos.y = 100;
    this.ball.velocity.x = 100;
    this.ball.velocity.y = 100;

    this.players = [
      new Player,
      new Player
    ];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this.canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this.canvas.height / 2;
    });

    let lastTime;
    const callback = (millis) => {
      if (lastTime) {
        this.update((millis -lastTime)/1000);
      }
      lastTime = millis;
      requestAnimationFrame(callback);
    } 

    callback();
  }

  /* collide(player, ball) {
    if (ball.left < player.right && ball.right > player.left && 
      ball.bottom > player.top && ball.top < player.bottom) {
      ball.velocity.x = - ball.velocity.x * 1.05;
    }
  } */
  collide(ball) {
    if (ball.velocity.x < 0 && ball.left < this.players[0].right && 
        ball.top > this.players[0].top && ball.bottom < this.players[0].bottom) {
      ball.velocity.x = - ball.velocity.x * 1.1;
    } else if (ball.velocity.x < 0 && ball.right > this.players[0].left && 
              ball.left < this.players[0].right &&
              ball.bottom > this.players[0].top && ball.top < this.players[0].bottom) {
      ball.velocity.y = - ball.velocity.y;
    }
    if (ball.velocity.x > 0 && ball.right > this.players[1].left && 
        ball.top > this.players[1].top && ball.bottom < this.players[1].bottom) {
    ball.velocity.x = - ball.velocity.x * 1.1;
    } 
  }

  draw() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }

  drawRect(rect) {
    this.context.fillStyle = '#fff';
    this.context.fillRect(rect.left, rect.top, 
                          rect.size.x, rect.size.y);
  }

  update(dt) {
    this.ball.pos.x += this.ball.velocity.x *dt;
    this.ball.pos.y += this.ball.velocity.y *dt;
  
    if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
      this.ball.velocity.x = -this.ball.velocity.x;
    }
    if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    }

    //this.players[0].pos.y = this.ball.pos.y;
    this.players[1].pos.y = this.ball.pos.y;

    //this.players.forEach(player => this.collide(player, this.ball));
    this.collide(this.ball);
  
    this.draw();
  }
  
}


const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;
});
