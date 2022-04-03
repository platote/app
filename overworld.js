import * as THREE from 'three';
// import metaversefile from 'metaversefile';
import {localPlayer} from './players.js';
import {world} from './world.js';
import {scene} from './renderer.js';
import {ScenePreviewer} from './scene-previewer.js';

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();

const range = 30;

const overworldObject = new THREE.Object3D();
overworldObject.name = 'overworld';
scene.add(overworldObject);

class OverworldApp {
  constructor(chunk) {
    let {name, start_url, position, quaternion, scale, size, focus} = chunk;
    size = new THREE.Vector3().fromArray(size);

    this.name = name;
    this.size = size;
    // const enterNormals = [];
    // this.enterNormals = enterNormals;

    const previewer = new ScenePreviewer({
      size,
      enterNormals: [],
    });
    previewer.setFocus(focus);
    const {skyboxMeshes, sceneObject} = previewer;
  
    position && previewer.position.fromArray(position);
    quaternion && previewer.quaternion.fromArray(quaternion);
    scale && previewer.scale.fromArray(scale);
    previewer.updateMatrixWorld();
    
    for (const skyboxMesh of skyboxMeshes) {
      skyboxMesh.position.copy(previewPosition);
      skyboxMesh.quaternion.copy(previewQuaternion);
      overworldObject.add(skyboxMesh);
      skyboxMesh.updateMatrixWorld();
    }
  
    overworldObject.add(sceneObject);
  
    // this.previewer = previewer;
    // app.hasSubApps = true;
  
    this.position = previewer.position;
    this.quaternion = previewer.quaternion;
    this.scale = previewer.scale;

    this.loadPromise = previewer.loadScene(start_url)
      .then(() => {});








    
    /* position = position && localVector.fromArray(position);
    quaternion = quaternion && localQuaternion.fromArray(quaternion);
    scale = scale && localVector2.fromArray(scale);
    const [chunkApp, chunkAppPromise] = metaversefile.createAppPair({
      start_url,
      position,
      quaternion,
      scale,
      components,
    }); */




    
  
    // return app;
  }
  waitForLoad() {
    return this.loadPromise;
  }
}
/* export default e => {
  const sceneUrl = app.getComponent('sceneUrl') ?? '';
  const focus = app.getComponent('focus') ?? false;
  const sizeArray = app.getComponent('size') ?? [100, 100, 100];
  const size = new THREE.Vector3().fromArray(sizeArray);
  const enterNormalsArray = app.getComponent('enterNormals') ?? [];
  const enterNormals = enterNormalsArray.map(a => new THREE.Vector3().fromArray(a));

  const previewer = new ScenePreviewer({
    size,
    enterNormals,
  });
  previewer.setFocus(focus);

  previewer.matrixWorld.copy(app.matrixWorld);
  previewer.matrix.copy(app.matrix);
  previewer.position.copy(app.position);
  previewer.quaternion.copy(app.quaternion);
  previewer.scale.copy(app.scale);

  const {skyboxMeshes, sceneObject} = previewer;
  for (const skyboxMesh of skyboxMeshes) {
    app.add(skyboxMesh);
    skyboxMesh.updateMatrixWorld();
  }

  app.add(sceneObject);

  app.previewer = previewer;
  app.hasSubApps = true;

  e.waitUntil((async () => {
    await previewer.loadScene(sceneUrl);
  })());

  return app;
}; */


const loadOverworld = async () => {
  // const {useLocalPlayer, useFrame} = metaversefile;
  // const localPlayer = useLocalPlayer();

  const chunks = [
    {
      name: 'street',
      position: [0, 0, 0],
      quaternion: [0, 0, 0, 1],
      start_url: "./scenes/street.scn",
      size: [300, 150, 300],
      focus: false,
      chunkPriority: -1,
    },
    {
      name: 'shadows',
      position: [0, 0, 0],
      quaternion: [0, 1, 0, 0],
      start_url: "./scenes/shadows.scn",
      size: [200, 150, 200],
      focus: false,
      chunkPriority: -1,
    },
  ];
  // const _getChunkComponent = (chunk, key) => chunk.components.find(component => component.key === key);
  // const _getChunkComponentValue = (chunk, key) => _getChunkComponent(chunk, key)?.value;
  const _setChunksLinearPositions = chunks => {
    if (chunks.length > 0) {
      const firstSize = chunks[0].size;
      let z = firstSize[2]/2;
      for (const chunk of chunks) {
        const size = chunk.size;
        z -= size[2]/2;
        chunk.position[2] = z;
        z -= size[2]/2;
      }
    }
  };
  _setChunksLinearPositions(chunks);
  
  const _setChunkFocus = focusChunk => {
    for (const chunk of chunks) {
      chunk.focus = chunk === focusChunk;
      chunk.chunkPriority = chunk.focus ? 0 : -1;
    }
  };
  const _findChunkByPosition = position => {
    for (const chunk of chunks) {
      const chunkPosition = chunk.position;
      const chunkSize = chunk.size;
      if (
        position.x >= chunkPosition[0] - chunkSize[0]/2 &&
        position.x <= chunkPosition[0] + chunkSize[0]/2 &&
        position.z >= chunkPosition[2] - chunkSize[2]/2 &&
        position.z <= chunkPosition[2] + chunkSize[2]/2
      ) {
        return chunk;
      }
    }
    return null;
  };
  const _getChunksInRange = (position, range) => {
    const result = [];
    for (const chunk of chunks) {
      const chunkPosition = chunk.position;
      const chunkSize = chunk.size;
      if (
        position.x >= chunkPosition[0] - chunkSize[0]/2 - range &&
        position.x <= chunkPosition[0] + chunkSize[0]/2 + range &&
        position.z >= chunkPosition[2] - chunkSize[2]/2 - range &&
        position.z <= chunkPosition[2] + chunkSize[2]/2 + range
      ) {
        result.push(chunk);
      }
    }
    return result;
  };
  const _setChunkFocusFromPosition = position => {
    const chunk = _findChunkByPosition(position);
    _setChunkFocus(chunk);
  };
  const _setChunkAppFocus = focusChunkApp => {
    for (const chunkApp of chunkApps) {
      const focus = chunkApp === focusChunkApp;
      chunkApp.setComponent('focus', focus);
      chunkApp.chunkPriority = focus ? 0 : -1;
    }
  };
  const _findChunkAppByPosition = position => {
    for (const chunkApp of chunkApps) {
      const chunkAppPosition = chunkApp.position;
      const chunkAppSize = localVector.fromArray(chunkApp.size);
      if (
        position.x >= chunkAppPosition.x - chunkAppSize.x/2 &&
        position.x <= chunkAppPosition.x + chunkAppSize.x/2 &&
        position.z >= chunkAppPosition.z - chunkAppSize.z/2 &&
        position.z <= chunkAppPosition.z + chunkAppSize.z/2
      ) {
        return chunkApp;
      }
    }
    return null;
  };
  const _setChunkAppFocusFromPosition = position => {
    const chunkApp = _findChunkAppByPosition(position);
    if (chunkApp !== lastChunkApp) {
      _setChunkAppFocus(chunkApp);
      lastChunkApp = chunkApp;
    }
  };
  const _getChunkAppsInRange = (position, range) => {
    const result = [];
    for (const chunkApp of chunkApps) {
      const chunkAppPosition = chunkApp.position;
      const chunkAppSize = localVector.fromArray(chunkApp.size);
      if (
        position.x >= chunkAppPosition.x - chunkAppSize.x/2 - range &&
        position.x <= chunkAppPosition.x + chunkAppSize.x/2 + range &&
        position.z >= chunkAppPosition.z - chunkAppSize.z/2 - range &&
        position.z <= chunkAppPosition.z + chunkAppSize.z/2 + range
      ) {
        result.push(chunkApp);
      }
    }
    return result;
  };

  //

  const _reifyChunk = chunk => {
    const chunkApp = new OverworldApp(chunk);
    const chunkAppPromise = chunkApp.waitForLoad.bind(chunkApp);
    return [chunkApp, chunkAppPromise];
  };
  const _reifyChunks = chunks => {
    const chunkAppPromises = Array(chunks.length).fill(null);
    const chunkApps = chunks.map((chunk, i) => {
      const [chunkApp, chunkAppPromise] = _reifyChunk(chunk);
      chunkAppPromises[i] = chunkAppPromise;
      return chunkApp;
    });
    return {
      chunkApps,
      chunkAppPromises,
    };
  };

  //

  _setChunkFocusFromPosition(localPlayer.position);
  let currentChunks = _getChunksInRange(localPlayer.position, range);
  let {
    chunkApps,
    chunkAppPromises,
  } = _reifyChunks(currentChunks);
  let lastChunkApp = _findChunkAppByPosition(localPlayer.position);

  //

  const _sortApps = () => {
    overworldObject.children.sort((a, b) => {
      const aPriority = a.chunkPriority;
      const bPriority = b.chunkPriority;
      const diff = aPriority - bPriority;
      if (diff !== 0) {
        return diff;
      } else {
        const aIndex = chunks.findIndex(o => o.name === a.name);
        const bIndex = chunks.findIndex(o => o.name === b.name);
        return aIndex - bIndex;
      }
    });
  };
  _sortApps();

  world.appManager.addEventListener('frame', () => {
    const newChunks = _getChunksInRange(localPlayer.position, range);

    for (const newChunk of newChunks) {
      if (!currentChunks.includes(newChunk)) {
        currentChunks.push(newChunk);

        const {
          chunkApp,
          chunkAppPromise,
        } = _reifyChunk(newChunk);
        chunkApps.push(chunkApp);
        chunkAppPromises.push(chunkAppPromise);
        _sortApps();
      }
    }
  });

  overworldObject.hasSubApps = true;

  await Promise.all(chunkAppPromises);
  
  console.log('all chunk apps loaded');
};
export {
  loadOverworld,
};