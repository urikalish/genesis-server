import { StateManager } from './services/state-manager';
import UnityRestService from '../services/unity-rest-service';

import { Constans } from './constans';
import scenesService from './services/scenes-service';

export default abstract class State {
  manager: StateManager;

  abstract readonly sceneName: string;

  constructor() {}

  loadUnityScene(sendToSecondaryUnity: boolean, alternaticeSceneName?: string) {
    const sceneToLoad = alternaticeSceneName || this.sceneName;
    const message = `${Constans.LOAD_SCENE}:${sceneToLoad}`;
    UnityRestService.sendPrimaryUnityMessage('load-scene', message);

    if (sendToSecondaryUnity) {
      UnityRestService.sendSecondryUnityMessage('load-scene', message);
    }
  }

  getSceneName() {
    return this.sceneName;
  }

  moveToNextScene() {
    console.log(`SceneEnd: ${this.sceneName}`);
    const nextScene = scenesService.getNextSceneByName(this.sceneName);
    console.log(`nextScene: ${nextScene.sceneName}`);
    this.manager.setState(nextScene);
    this.manager.execute();
  }

  getCurrentStateName() {
    return this.sceneName;
  }

  handleRestRequest(request, response) {
    if (request.body && request.body.SceneEnd === '') {
      this.moveToNextScene();
    }
    response.status(200).json({ msg: 'OK' });
  }

  handleArduinoMessage(data: string) {
    console.log(`Arduino message recive: ${data}`);
  }

  handleCommand(data: string) {
    console.log(`Command recive: ${data}`);
    return false;
  }

  abstract execute: (manager: StateManager) => void;

  destroy(): void {}
}
