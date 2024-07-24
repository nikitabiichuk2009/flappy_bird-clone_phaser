class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.menu = [
      {
        scene: "PlayScene",
        text: "Play",
      },
      {
        scene: "ScoreScene",
        text: "Score",
      },
      {
        scene: "DifficultyScene",
        text: "Difficulty",
      },
      {
        scene: null,
        text: "Exit",
      },
    ];
  }

  create() {
    this.createBg();
    this.createMenu();
  }

  createBg() {
    this.add.image(0, 0, "sky").setOrigin(0, 0);
  }

  createMenu() {
    let identaion = 0;
    this.menu.forEach((item) => {
      const menuPosition = [200, 300 + identaion];
      const menuText = this.add
        .text(...menuPosition, item.text, {
          fontSize: "32px",
          fill: "#fff",
        })
        .setInteractive()
        .setOrigin(0.5, 1);

      menuText.on("pointerover", () => {
        this.tweens.add({
          targets: menuText,
          scale: 1.2,
          duration: 200,
          ease: "Power1",
          onUpdate: () => menuText.setStyle({ fill: "#ff0" }),
        });
      });

      menuText.on("pointerout", () => {
        this.tweens.add({
          targets: menuText,
          scale: 1,
          duration: 200,
          ease: "Power1",
          onUpdate: () => menuText.setStyle({ fill: "#fff" }),
        });
      });

      menuText.on("pointerup", () => {
        if (item.scene) {
          this.scene.stop();
          this.scene.start(item.scene);
        } else if (item.text === "Exit") {
          this.game.destroy(true);
        }
      });

      identaion += 42;
    });
  }
}

export default MenuScene;
