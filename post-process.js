// Helper library written for useful postprocessing tasks with Flat Data
// Has helper functions for manipulating csv, txt, json, excel, zip, and image files
// You can test this script locally on your computer by runinng `deno run -A --unstable postprocess.ts data.json`
import { readImageFromURL, readJSON, writeImage } from 'https://deno.land/x/flat@0.0.11/mod.ts';
const causewayCam = '2701';
const hours = 8;
const getLocalHours = () => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  return (new Date(Date.now() - tzoffset)).getHours();
}

const convertUtcToLocal = (hours) => {
  const date = (new Date().getHours()) + hours;
  return date > 23 ? date - 24 : date;
}

// Get the data filename as the first argument
const filename = Deno.args[0]
const data = await readJSON(filename)
const cameras = data.items[0].cameras;
const imageURL = cameras
  .filter(cam => cam.camera_id === causewayCam)[0].image; // fetch the URL key in the json

// Postprocess steps
const image = await readImageFromURL(imageURL) // fetch the image
const imageName = convertUtcToLocal(hours);
await writeImage(image.bytes, `./causeway-${imageName}.jpg`) // create a jpg file

