import fs from 'fs';
import sharp from 'sharp';
import  { createCanvas, loadImage } from 'canvas';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Storage } from '@google-cloud/storage';
import Dp from "./dp.jpg"

async function annotateImage(inputPath, outputPath, annotationOptions) {
  try {
    // Load the image using Sharp
    const image = await sharp(inputPath).toBuffer();

    // Create a canvas and draw the image on it
    const canvas = createCanvas();
    const context = canvas.getContext('2d');
    const img = await loadImage(image);
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    // Draw a rectangle on the canvas (annotation)
    context.strokeStyle = annotationOptions.strokeColor || 'red';
    context.lineWidth = annotationOptions.strokeWidth || 2;
    context.beginPath();
    context.rect(
      annotationOptions.x || 10,
      annotationOptions.y || 10,
      annotationOptions.width || 50,
      annotationOptions.height || 50
    );
    context.stroke();

    // Convert the canvas back to a Buffer
    const annotatedImage = canvas.toBuffer();

    // Save the annotated image using Sharp
    await sharp(annotatedImage).toFile(outputPath);

    console.log('Image annotated and saved successfully.');
  } catch (error) {
    console.error('Error annotating image:', error);
  }
}

// Example usage
const inputImagePath = Dp;
const outputImagePath = 'output.jpg';

const annotationOptions = {
  x: 50,
  y: 50,
  width: 100,
  height: 100,
  strokeColor: 'blue',
  strokeWidth: 5,
};

annotateImage(inputImagePath, outputImagePath, annotationOptions);
