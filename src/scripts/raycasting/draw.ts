import { canvasEl, ctx } from "./canvas";
import { map } from "./map";
import { player } from "./player";
import { getTexture } from "./textures";

const fov = Math.PI / 3;
const half_fov = fov / 2;
const max_depth = 16;
const epsilon = 1e-6;

export function drawFrame() {
	ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

	const num_rays = Math.floor(canvasEl.width / 2);
	const delta_angle = fov / num_rays;
	const x_map = Math.floor(player.pos_x);
	const y_map = Math.floor(player.pos_y);

	let ray_angle = player.angle - half_fov + epsilon;
	let texture_x = 0;
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

				texture_x = x_hor % 1;
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
			ray << 1,
			wall_top,
			2,
			wall_height,
		);

		// draw sky
		ctx.fillStyle = "rgb(30, 40, 75)";
		ctx.fillRect(ray * 2, 0, 2, wall_top);

		// draw floor
		ctx.fillStyle = "#212124";
		const floor_top = wall_top + wall_height;
		ctx.fillRect(ray * 2, floor_top, 2, canvasEl.height - floor_top);

		ray_angle += delta_angle;
	}
}
