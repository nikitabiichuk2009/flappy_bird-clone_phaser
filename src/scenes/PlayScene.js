import Phaser from "phaser";

const BIRD_START_X = 20;
const BIRD_START_Y = 300;
const FLAP_VELOCITY = -250;
const GRAVITY = 400;
const PIPES_TO_RENDER = 6;

class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
    this.bird;
    this.pauseButton;
    this.pipes;
    this.score = 0;
    this.scoreText = "";
    this.bestScore = 0;
    this.bestScoreText = "";
    this.countDowntext = "";
    this.pauseEvent;
    this.isPaused = false;
    this.currentDifficulty = "";
    this.difficulties = {
      easy: {
        pipeVerticalDistanceRange: [280, 350],
        pipeHorizontalDistanceRange: [350, 400],
      },
      normal: {
        pipeVerticalDistanceRange: [290, 330],
        pipeHorizontalDistanceRange: [220, 290],
      },
      hard: {
        pipeVerticalDistanceRange: [250, 310],
        pipeHorizontalDistanceRange: [150, 210],
      },
    };
  }

  create() {
    this.currentDifficulty = localStorage.getItem("difficulty") || "normal";
    this.createBg();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createBestScore();
    this.handleInputs();
    this.listenToEvents();

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 8,
        end: 15,
      }),
      frameRate: 8,
      // repeat infinitely
      repeat: -1,
    });
    this.bird.play("fly");
  }

  update() {
    this.checkBirdStatus();
    this.recyclePipes();
  }

  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on("resume", () => {
      this.countDown();
    });
  }

  countDown() {
    let initialTime = 3;
    this.countDownText = this.add
      .text(200, 300, "Fly in: " + initialTime, {
        fontSize: "28px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    const timeEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        initialTime--;
        this.countDownText.setText("Fly in: " + initialTime);
        if (initialTime <= 0) {
          this.countDownText.setText("");
          this.physics.resume();
          timeEvent.remove();
          this.isPaused = false;
        }
      },
      loop: true,
    });
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score is ${this.score}`, {
      fontSize: "28px",
      fill: "#000",
    });
  }

  createBestScore() {
    this.bestScore = localStorage.getItem("bestScore") || 0;
    this.bestScoreText = this.add.text(
      16,
      50,
      `Best score is ${this.bestScore}`,
      {
        fontSize: "18px",
        fill: "#000",
      }
    );
  }

  checkBirdStatus() {
    if (
      this.bird.y >= this.sys.game.config.height - this.bird.height ||
      this.bird.y <= 0
    ) {
      this.restart();
    }
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.restart, null, this);
  }

  flap() {
    if (this.isPaused) return;
    this.bird.body.velocity.y = FLAP_VELOCITY;
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createBird() {
    this.bird = this.physics.add
      .sprite(BIRD_START_X, BIRD_START_Y, "bird")
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0, 0);

    this.bird.setBodySize(this.bird.body.width, this.bird.body.height - 6);
    this.bird.body.gravity.y = GRAVITY;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable(true)
        .setOrigin(0, 0);
      this.placePipes(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  handleInputs() {
    this.input.on("pointerdown", () => this.flap());
    this.input.keyboard.on("keydown-SPACE", () => this.flap());
    this.input.keyboard.on("keydown-UP", () => this.flap());
    this.input.keyboard.on("keydown-ESC", () => {
      this.isPaused = false;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
      this.isPaused = true;
    });
  }

  restart() {
    // this.bird.x = BIRD_START_X;
    // this.bird.y = BIRD_START_Y;
    // this.bird.body.velocity.y = 0;
    this.physics.pause();
    this.bird.setTint(0xb43f3f);
    this.updateBestScore();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  placePipes(upperPipe, lowerPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();

    const pipeVerticalDistance = Phaser.Math.Between(
      difficulty.pipeVerticalDistanceRange[0],
      difficulty.pipeVerticalDistanceRange[1]
    );
    const pipeHorizontalDistance = Phaser.Math.Between(
      difficulty.pipeHorizontalDistanceRange[0],
      difficulty.pipeHorizontalDistanceRange[1]
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.sys.game.config.height - 20 - pipeVerticalDistance
    );

    upperPipe.x = rightMostX + pipeHorizontalDistance;
    upperPipe.y = pipeVerticalPosition;

    lowerPipe.x = upperPipe.x;
    lowerPipe.y = upperPipe.y + pipeVerticalDistance;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.increaseScore();
          this.updateBestScore();
          this.placePipes(tempPipes[0], tempPipes[1]);
        }
      }
    });
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });
    return rightMostX;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score is ${this.score}`);
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem("bestScore", this.bestScore);
    }
  }
}

export default PlayScene;
