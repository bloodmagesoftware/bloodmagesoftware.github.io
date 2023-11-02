import { drawFrame } from "./draw";
import { updateDeltaTime } from "./time";
import "./movement";
import { updatePlayer } from "./movement";

function tick() {
	updateDeltaTime();
	updatePlayer();
	drawFrame();
}

let tickInterval = 0;

function startGame() {
	if (tickInterval) {
		return;
	}
	tickInterval = window.setInterval(tick, 1000 / 30);
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
