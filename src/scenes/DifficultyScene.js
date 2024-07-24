import Phaser from "phaser";

class DifficultyScene extends Phaser.Scene {
  constructor() {
    super("DifficultyScene");
    this.difficulties = [
      { key: "easy", text: "Easy", color: "#00FF00" },
      { key: "normal", text: "Normal", color: "#FFFF00" },
      { key: "hard", text: "Hard", color: "#FF0000" },
    ];
  }

  create() {
    this.createBg();
    const backButton = this.add
      .image(390, 590, "back")
      .setScale(2)
      .setOrigin(1)
      .setInteractive();
    backButton.on("pointerup", () => {
      this.scene.start("MenuScene");
    });
    this.addChooseDifficultyText();
    this.createMenu();
    this.displayCurrentDifficulty();
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createMenu() {
    let identaion = 0;
    this.difficulties.forEach((item) => {
      const menuPosition = [200, 200 + identaion];
      const menuText = this.add
        .text(...menuPosition, item.text, {
          fontSize: "32px",
          fill: item.color,
        })
        .setInteractive()
        .setOrigin(0.5, 1);

      menuText.on("pointerover", () => {
        this.tweens.add({
          targets: menuText,
          scale: 1.2,
          duration: 200,
          ease: "Power1",
          onUpdate: () => menuText.setStyle({ fontSize: "36px" }),
        });
      });

      menuText.on("pointerout", () => {
        this.tweens.add({
          targets: menuText,
          scale: 1,
          duration: 200,
          ease: "Power1",
          onUpdate: () => menuText.setStyle({ fontSize: "32px" }),
        });
      });

      menuText.on("pointerup", () => {
        localStorage.setItem("difficulty", item.key);
        this.scene.start("MenuScene");
        window.location.reload();
      });

      identaion += 50;
    });
  }

  displayCurrentDifficulty() {
    const currentDifficulty = localStorage.getItem("difficulty") || "normal";
    const currentText = `Current difficulty is ${currentDifficulty}`;
    this.add
      .text(200, 100, currentText, {
        fontSize: "20px",
        fill: "#000",
      })
      .setOrigin(0.5, 0.5);
  }

  addChooseDifficultyText() {
    this.add
      .text(200, 50, "Choose difficulty", {
        fontSize: "24px",
        fill: "#000",
      })
      .setOrigin(0.5, 0.5);
  }
}

export default DifficultyScene;
