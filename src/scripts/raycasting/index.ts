import { drawFrame } from "./draw";
import { updateDeltaTime } from "./time";
import "./movement";
import { updatePlayer } from "./movement";

function tick() {
	updateDeltaTime();
	updatePlayer();
	drawFrame();
}

window.setInterval(tick, 1000 / 30);
