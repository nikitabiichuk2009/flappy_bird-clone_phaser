import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";
import DifficultyScene from "./scenes/DifficultyScene";
const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    // arcade: {
    //   debug: true,
    // },
  },
  scene: [
    PreloadScene,
    MenuScene,
    PlayScene,
    ScoreScene,
    PauseScene,
    DifficultyScene,
  ],
};

new Phaser.Game(config);
