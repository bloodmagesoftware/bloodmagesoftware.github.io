import { map } from "./map";
import { player } from "./player";
import { getDeltaTime } from "./time";

const player_max_anle = Math.PI / 16;

function getScrollPercent() {
  return (
    (document.documentElement.scrollTop || document.body.scrollTop) /
    ((document.documentElement.scrollHeight || document.body.scrollHeight) -
      document.documentElement.clientHeight)
  );
}

function onScroll() {
  player.target_pos_x = getScrollPercent() * (map[0]!.length - 3) + 0.5;
}

function onMouseMove(ev: MouseEvent) {
  player.target_angle =
    ((ev.clientX / window.innerWidth) * 2 - 1) * player_max_anle;
}

function floatInterpolate(current: number, target: number) {
  return current + (target - current) * getDeltaTime() * 0.01;
}

onScroll();

const prefers_reduced_motion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const pointer = window.matchMedia("(pointer: fine)").matches;

if (!prefers_reduced_motion) {
  if (pointer) {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
}

export function updatePlayer() {
  if (!prefers_reduced_motion) {
    player.pos_x = floatInterpolate(player.pos_x, player.target_pos_x);
    player.angle = floatInterpolate(player.angle, player.target_angle);
  }
}
