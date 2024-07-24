import Phaser from "phaser";

class ScoreScene extends Phaser.Scene {
  constructor() {
    super("ScoreScene");
  }

  create() {
    this.createBg();
    this.displayBestCore();
    const backButton = this.add
      .image(390, 590, "back")
      .setScale(2)
      .setOrigin(1)
      .setInteractive();
    backButton.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  displayBestCore() {
    const bestScore = localStorage.getItem("bestScore") || 0;
    this.add
      .text(200, 300, `Your best score is ${bestScore}.\nCongratulations!`, {
        fontSize: "28px",
        fill: "#fff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
  }
}

export default ScoreScene;
