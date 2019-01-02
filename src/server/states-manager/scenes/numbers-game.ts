import State from '../state';
import { StateManager } from '../services/state-manager';
import scenesService from '../services/scenes-service';
import { ArduinoEvents } from '../constans';

class NumbersGame extends State {
  manager: StateManager;

  timer: NodeJS.Timeout;

  isArduinoEventReceived: boolean = false;

  readonly sceneName = 'NumbersGame';

  // send NumbersGameTimer to primary
  // send NumbersGame to Third

  execute = (manager: StateManager): void => {
    this.manager = manager;

    this.loadUnityScene(false, 'NumbersGameTimer');
    const clue = scenesService.getSceneClue(this.sceneName);
    this.timer = setTimeout(() => {
      super.loadUnityScene(false, clue);
    }, 1000 * 60 * 3);
  };
}

export default new NumbersGame();
