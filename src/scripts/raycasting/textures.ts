const texture_cache = new Map<number, HTMLImageElement>();

export function getTexture(index: number) {
	if (!texture_cache.has(index)) {
		const texture = new Image();
		texture.src = `/textures/${index}.png`;
		texture_cache.set(index, texture);
	}
	return texture_cache.get(index)!;
}
