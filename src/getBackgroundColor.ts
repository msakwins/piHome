import { RGBColor } from './types/sensor';

export const getBackgroundColor = (imageSrc: string, callback: (color: RGBColor) => void): void => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageSrc;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    let sampledPixels = 0;

    for (let i = 0; i < data.length; i += 40) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      sampledPixels += 1;
    }

    r = Math.floor(r / sampledPixels);
    g = Math.floor(g / sampledPixels);
    b = Math.floor(b / sampledPixels);

    callback({ r, g, b });
  };
};
