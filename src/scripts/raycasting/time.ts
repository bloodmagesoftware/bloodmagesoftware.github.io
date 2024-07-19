let last_frame_time = Date.now();
let delta_time = 0;

export function updateDeltaTime(now: number) {
	delta_time = now - last_frame_time;
	last_frame_time = now;
}

export function getDeltaTime() {
	return delta_time;
}
