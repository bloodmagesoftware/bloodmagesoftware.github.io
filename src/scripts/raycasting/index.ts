import { decreasePerformance, drawFrame, increasePerformance } from "./draw";
import { updateDeltaTime } from "./time";
import "./movement";
import { updatePlayer } from "./movement";

const target_tick_time = 1000 / 60;

function tick() {
	const start = performance.now();
	updateDeltaTime();
	updatePlayer();
	drawFrame();
	const end = performance.now();
	const delta = end - start;
	if (delta > target_tick_time / 2) {
		increasePerformance();
	} else if (delta < target_tick_time / 16) {
		decreasePerformance();
	}
}

let tickInterval = 0;

function startGame() {
	if (tickInterval) {
		return;
	}
	tickInterval = window.setInterval(tick, target_tick_time);
}

function stopGame() {
	if (tickInterval) {
		window.clearInterval(tickInterval);
		tickInterval = 0;
	}
}

startGame();

window.addEventListener("blur", stopGame);
window.addEventListener("focus", startGame);
