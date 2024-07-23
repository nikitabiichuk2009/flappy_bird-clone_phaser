import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const FLAP_VELOCITY = -250;
const GRAVITY = 400;
const BIRD_START_X = 80;
const BIRD_START_Y = 300;

new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

let bird;
let upperPipe;
let lowerPipe;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  bird = this.physics.add
    .sprite(BIRD_START_X, BIRD_START_Y, "bird")
    .setOrigin(0, 0);
  bird.body.gravity.y = GRAVITY;
  upperPipe = this.add.sprite(400, 200, "pipe").setOrigin(0, 1);
  lowerPipe = this.add.sprite(400, upperPipe.y + 100, "pipe").setOrigin(0, 0);

  this.input.on("pointerdown", () => flap.call(this));
  this.input.keyboard.on("keydown-SPACE", () => flap.call(this));
  this.input.keyboard.on("keydown-UP", () => flap.call(this));
}

function update(time, delta) {
  if (bird.y >= config.height - bird.height) {
    alert("You have lost!");
    restart();
  } else if (bird.y <= 0) {
    bird.y = 0;
    bird.body.velocity.y = 0;
  }
}

function flap() {
  bird.body.velocity.y = FLAP_VELOCITY;
}

function restart() {
  bird.x = BIRD_START_X;
  bird.y = BIRD_START_Y;
  bird.body.velocity.y = 0;
}
