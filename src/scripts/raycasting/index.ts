import { decreasePerformance, drawFrame, increasePerformance } from "./draw";
import { updateDeltaTime } from "./time";
import "./movement";
import { updatePlayer } from "./movement";

const target_tick_time = 1000 / 60;

function tick(start: number) {
	updateDeltaTime(start);
	updatePlayer();
	drawFrame();
	const end = performance.now();
	const delta = end - start;
	if (delta >= target_tick_time) {
		increasePerformance();
	} else if (delta <= target_tick_time / 16) {
		decreasePerformance();
	}
	window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
