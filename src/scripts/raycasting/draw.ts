import { canvasEl, ctx } from "./canvas";
import { map } from "./map";
import { player } from "./player";
import { getTexture } from "./textures";

const fov = Math.PI / 3;
const half_fov = fov / 2;
const max_depth = 16;
const epsilon = 1e-6;
let slice_width = 4;

export function increasePerformance() {
	slice_width = Math.min(16, slice_width * 2) | 0;
}

export function decreasePerformance() {
	slice_width = Math.max(1, slice_width / 2) | 0;
}

function drawSky() {
	const sky_texture = getTexture("sky");
	const sky_start_x = Math.floor(
		player.angle * -canvasEl.width + sky_texture.width / 2,
	);
	ctx.drawImage(
		sky_texture,
		0,
		0,
		sky_texture.width,
		sky_texture.height,
		sky_start_x,
		0,
		canvasEl.width,
		canvasEl.height / 2,
	);
	ctx.drawImage(
		sky_texture,
		0,
		0,
		sky_texture.width,
		sky_texture.height,
		-(canvasEl.width - sky_start_x),
		0,
		canvasEl.width,
		canvasEl.height / 2,
	);
}

export function drawFrame() {
	drawSky();

	const num_rays = Math.ceil(canvasEl.width / slice_width);
	const delta_angle = fov / num_rays;
	const x_map = Math.floor(player.pos_x);
	const y_map = Math.floor(player.pos_y);

	let ray_angle = player.angle - half_fov + epsilon;
	for (let ray = 0; ray != num_rays; ++ray) {
		let texture_hor = 1;
		let texture_vert = 1;
		const sin_a = Math.sin(ray_angle);
		const cos_a = Math.cos(ray_angle);
		let y_vert = 0;
		let x_hor = 0;

		// horizontal
		let depth_hor = max_depth;
		{
			let [y_hor, dy] =
				sin_a > 0 ? [y_map + 1, 1] : [y_map - epsilon, -1];

			depth_hor = (y_hor - player.pos_y) / sin_a;
			x_hor = player.pos_x + depth_hor * cos_a;

			const delta_depth = dy / sin_a;
			const dx = delta_depth * cos_a;

			for (let i = 0; i <= max_depth; ++i) {
				const tile_hor_x = Math.trunc(x_hor);
				const tile_hor_y = Math.trunc(y_hor);
				if (map[tile_hor_y] && map[tile_hor_y]![tile_hor_x]) {
					texture_hor = map[tile_hor_y]![tile_hor_x]!;
					break;
				}
				y_hor += dy;
				x_hor += dx;
				depth_hor += delta_depth;
			}
		}

		// vertical
		let depth_vert = max_depth;
		{
			let [x_vert, dx] =
				cos_a > 0 ? [x_map + 1, 1] : [x_map - epsilon, -1];

			depth_vert = (x_vert - player.pos_x) / cos_a;
			y_vert = player.pos_y + depth_vert * sin_a;

			const delta_depth = dx / cos_a;
			const dy = delta_depth * sin_a;

			for (let i = 0; i != max_depth; ++i) {
				const tile_vert_x = Math.trunc(x_vert);
				const tile_vert_y = Math.trunc(y_vert);
				if (map[tile_vert_y] && map[tile_vert_y]![tile_vert_x]) {
					texture_vert = map[tile_vert_y]![tile_vert_x]!;
					break;
				}
				x_vert += dx;
				y_vert += dy;
				depth_vert += delta_depth;
			}
		}

		// depth
		let depth = 0;
		let texture = 0;
		let offset = 0;
		if (depth_vert < depth_hor) {
			depth = depth_vert * Math.cos(ray_angle - player.angle);
			texture = texture_vert;
			y_vert %= 1;
			if (cos_a > 0) {
				offset = y_vert;
			} else {
				offset = 1 - y_vert;
			}
		} else {
			depth = depth_hor * Math.cos(ray_angle - player.angle);
			texture = texture_hor;
			x_hor %= 1;
			if (sin_a > 0) {
				offset = 1 - x_hor;
			} else {
				offset = x_hor;
			}
		}

		// draw walls
		const wall_height = Math.floor(canvasEl.width / depth);
		const wall_top = Math.floor((canvasEl.height - wall_height) / 2);
		const texImg = getTexture(texture);
		ctx.drawImage(
			texImg,
			Math.floor(offset * texImg.width),
			0,
			1,
			texImg.height,
			ray * slice_width,
			wall_top,
			slice_width,
			wall_height,
		);
		const darken = Math.min(1, depth / max_depth);
		ctx.fillStyle = `rgba(0,0,0,${darken})`;
		ctx.fillRect(ray * slice_width, wall_top, slice_width, wall_height);

		// draw floor
		ctx.fillStyle = "rgb(24,25,22)";
		const floor_top = wall_top + wall_height;
		ctx.fillRect(
			ray * slice_width,
			floor_top,
			slice_width,
			canvasEl.height - floor_top,
		);

		ray_angle += delta_angle;
	}
}
