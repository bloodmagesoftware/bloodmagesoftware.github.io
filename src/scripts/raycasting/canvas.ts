import { panic } from "../errorhandling";

export const canvasEl =
	document.querySelector("canvas") ?? panic("No canvas element");
export const ctx =
	canvasEl.getContext("2d", {
		alpha: false,
		colorSpace: "srgb",
		desynchronized: true,
		willReadFrequently: false,
	}) ?? panic("No canvas context");
ctx.imageSmoothingEnabled = false;
const pixel_size = 1;

function setCanvasSize() {
	canvasEl.width = Math.ceil(window.innerWidth / pixel_size);
	canvasEl.height = Math.ceil(window.innerHeight / pixel_size);
}

setCanvasSize();

let resizeTimeout: number = 0;

function onResize() {
	if (resizeTimeout) {
		window.clearTimeout(resizeTimeout);
	}
	resizeTimeout = window.setTimeout(setCanvasSize, 100);
}

window.addEventListener("resize", onResize, { passive: true });
