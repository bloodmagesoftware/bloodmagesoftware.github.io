const texture_cache = new Map<number | string, HTMLImageElement>();

export function getTexture(key: number | string) {
	if (!texture_cache.has(key)) {
		const texture = new Image();
		texture.src = `/textures/${key}.png`;
		texture_cache.set(key, texture);
	}
	return texture_cache.get(key)!;
}
