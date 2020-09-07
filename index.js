const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const canvasSize = 400;
const imageWidth = 668;
const tileSize = 32;
const animationDelay = 100;

const assets = {
  sky: { image: new Image(), offset: 0, offset2: imageWidth, increment: 0.02, positionY: 0 },
  cloud: { image: new Image(), offset: 0, offset2: imageWidth, increment: 0.1, positionY: 20 },
  mountain: { image: new Image(), offset: 0, offset2: imageWidth, increment: 0.2, positionY: 140 },
  pine1: { image: new Image(), offset: 0, offset2: imageWidth, increment: 0.4, positionY: 200 },
  pine2: { image: new Image(), offset: 0, offset2: imageWidth, increment: 0.6, positionY: 250 },
  birds: { image: new Image(), frame: 0, delta: 0 }
};

const assetKeys = Object.keys(assets);

const loadAsset = assetName => {
  const asset = assets[assetName];
  new Promise((resolve, reject) => {
    asset.image.onload = () => resolve({ assetName, status: 'ok' });
    asset.image.onerror = () => reject({ assetName, status: 'error' });
    asset.image.src = `./assets/${assetName}.png`;
  });
};

const update = () => {
  assetKeys.forEach(assetName => {
    const asset = assets[assetName];
    const now = Date.now();
    const step = asset?.offset - asset?.increment;

    if (step) {
      asset.offset = step < -imageWidth - 1 ? 0 : step;
      asset.offset2 = asset.offset + imageWidth;
      return;
    }

    if (now >= asset.delta + animationDelay) {
      asset.frame = asset.frame + 1 === 3 ? 0 : asset.frame + 1;
      asset.delta = now;
    }
  });
};

const draw = () => {
  assetKeys.forEach(assetName => {
    const { image, frame, offset, offset2, positionY } = assets[assetName];
    if (assets[assetName].hasOwnProperty('frame')) {
      ctx.drawImage(image, frame * tileSize, 0 * tileSize, tileSize, tileSize, 80, 100, tileSize, tileSize);
      ctx.drawImage(image, frame * tileSize, 1 * tileSize, tileSize, tileSize, 150, 330, tileSize, tileSize);
      ctx.drawImage(image, frame * tileSize, 2 * tileSize, tileSize, tileSize, 260, 160, tileSize, tileSize);
      return;
    }

    ctx.drawImage(image, offset, positionY);
    ctx.drawImage(image, offset2, positionY);
  });

};

const main = () => {
  update();
  draw();
  requestAnimationFrame(main);
};

Promise.all(assetKeys.map(loadAsset)).then(() => {
  ctx.canvas.width = canvasSize;
  ctx.canvas.height = canvasSize;
  requestAnimationFrame(main);
});
