
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rectangular {
  constructor(w, h) {
    this.pos = new Vector; // keskikohta
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
    this.vel = 300;
	this.angle = Math.PI / 4 * (Math.random() > .5 ? 1 : -1); //+/-45 deg
	this.alive = true;
  }
  
  get velocity_x() {
	return this.vel * Math.cos(this.angle);
  }
  get velocity_y() {
	return this.vel * Math.sin(this.angle);
  }
}

class Player extends Rectangular {
  constructor() {
    super(20, 100);
    this.score = 0;
	this.velocity = -50;
	this.visible = false;
  }
}

class Pong {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.ball = new Ball;

    this.players = [
      new Player,
      new Player,
	  new Player
    ];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this.canvas.width - 40;
    this.players[2].pos.x = this.canvas.width / 2;
    this.players.forEach(player => {
      player.pos.y = this.canvas.height / 2;
    });
	this.players[2].pos.y = this.canvas.height + 50;

    let lastTime; // previous page update
    const callback = (millis) => {
      if (lastTime) {
        this.update((millis -lastTime)/1000);
      }
      lastTime = millis;
      requestAnimationFrame(callback);
    } 

    callback();
  }

  collide(ball) {
	// player 0, mouse
    if (ball.velocity.x < 0 && ball.left < this.players[0].right && 
        ball.top > this.players[0].top && ball.bottom < this.players[0].bottom && ball.alive) {
      ball.vel = Math.min(ball.vel * 1.1, 700)
	  ball.angle = -Math.PI * 1/4 + Math.PI / 2 * Math.random();
	  ball.velocity.x = ball.velocity_x;
	  ball.velocity.y = ball.velocity_y;
	  this.players[0].score++
	  document.getElementById("score").innerHTML = this.players[0].score;
	  // blocker visibility
	  if (this.players[0].score >= 30) {
		  this.players[2].visible = true;
	  }
    } 
	// if pass the bat
	else if (ball.velocity.x < 0 && ball.left < this.players[0].right) {
      ball.alive = false
    }
	
	// player 1, computer
    if (ball.velocity.x > 0 && ball.right > this.players[1].left && 
        ball.top > this.players[1].top && ball.bottom < this.players[1].bottom) {
      
	  ball.vel = Math.min(ball.vel * 1.1, 700);
	  ball.angle = Math.PI * 3/4 + Math.PI / 2 * Math.random();
	  ball.velocity.x = ball.velocity_x;
	  ball.velocity.y = ball.velocity_y;
	}
	
	//player 2, blocker
	if(this.players[2].visible && ball.left < this.players[2].right && ball.right > this.players[2].left && 
        ball.top > this.players[2].top && ball.bottom < this.players[2].bottom) {
	  ball.velocity.x = -ball.velocity.x;
	}
	
  }

  draw() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawRect(this.ball);
    //this.players.forEach(player => this.drawRect(player));
	this.drawRect(this.players[0]);
	this.drawRect(this.players[1]);
	if (this.players[2].visible) {
		this.drawRect(this.players[2]);
	}
  }

  drawRect(rect) {
    this.context.fillStyle = '#fff';
    this.context.fillRect(rect.left, rect.top, 
                          rect.size.x, rect.size.y);
  }
  
  reset() {
    this.ball.pos.x = 200;
    this.ball.pos.y = canvas.height * (Math.random()); // Y axis position, 0 to canvas height;
    this.ball.vel = Math.max(this.ball.vel / 2, 50);
	this.ball.angle = Math.PI / 4 * (Math.random() > .5 ? 1 : -1); //+/-45 deg
	this.ball.velocity.x = this.ball.velocity_x;
    this.ball.velocity.y = this.ball.velocity_y;
	this.ball.alive = true;
  };

  update(dt) {
    this.ball.pos.x += this.ball.velocity.x *dt;
    this.ball.pos.y += this.ball.velocity.y *dt;
	// blocker
	if(this.players[2].visible) {
	  this.players[2].pos.y += this.players[2].velocity *dt;
	}
    
	if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
	  this.ball.pos.y += this.ball.velocity.y *dt;
    }

    this.players[1].pos.y = this.ball.pos.y;
	
	if (this.players[2].pos.y < -50 || this.players[2].pos.y > this.canvas.height + 50) {
		this.players[2].velocity = -this.players[2].velocity
	}
	
    this.collide(this.ball);
	
	// Detect if Ball touches bounds of Canvas
    if (this.ball.left < 0) {
      this.reset();
    }
  
    this.draw();
  }

}


const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;
});
