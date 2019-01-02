import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class MazeGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = 'MazeGame';

  execute = (manager: StateManager): void => {
    this.manager = manager;
    super.loadUnityScene(false);
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 3);
  };

  handleArduinoMessage(data: string) {
    if (data === ArduinoEvents.GlassesDrawerOpened && !this.isArduinoEventReceived) {
      this.isArduinoEventReceived = true;
      clearTimeout(this.timer);
      super.loadUnityScene(false, 'GenesisAfterMazeDrawerOpened');
    }
  }
}

export default new MazeGame();
