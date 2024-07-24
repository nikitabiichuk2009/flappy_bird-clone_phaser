class PauseScene extends Phaser.Scene {
  constructor() {
    super("PauseScene");
    this.menu = [
      {
        scene: "PlayScene",
        text: "Continue",
      },
      {
        scene: "MenuScene",
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
        if (item.text === "Exit") {
          this.scene.stop();
          this.scene.stop("PlayScene");
          window.location.reload();
          this.scene.start("MenuScene");
        } else {
          this.scene.stop();
          this.scene.resume("PlayScene");
        }
      });

      identaion += 42;
    });
  }
}

export default PauseScene;
