import { createSignal } from "solid-js";

const fonts = new Set([
  "Helvetica",
  "Arial",
  "Arial Black",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
  "Gill Sans",
  "Times New Roman",
  "Georgia",
  "Palatino",
  "Baskerville",
  "Andalé Mono",
  "Courier",
  "Lucida",
  "Monaco",
  "Bradley Hand",
  "Brush Script MT",
  "Luminari",
  "Comic Sans MS",
]);

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

function ceilPow2(x: number) {
  return Math.pow(2, Math.ceil(Math.log2(x)));
}

function exportImage(
  min: number,
  max: number,
  font: string,
  aspectRatio = 3 / 4,
  charSize = 32,
) {
  // if server side, return empty string
  if (typeof window === "undefined") {
    return "";
  }

  const charWidth = charSize;
  const charHeight = charSize * (1 / aspectRatio);
  const charPerRow = 32;
  const charPerCol = Math.ceil((max - min + 1) / charPerRow);

  const canvas = document.createElement("canvas");
  canvas.width = ceilPow2(charWidth * charPerRow);
  canvas.height = ceilPow2(charHeight * charPerCol);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.font = `${charSize}px ${font}`;
  ctx.textAlign = "center";
  range(min, max).forEach((i) => {
    const c = String.fromCharCode(i);
    const x = (i - min) % charPerRow;
    const y = Math.floor((i - min) / charPerRow);
    ctx.fillText(c, x * charWidth + charWidth / 2, y * charHeight);
  });

  setTimeout(() => {
    canvas.remove();
  }, 1000);

  return canvas.toDataURL("image/bmp");
}

export function Fonter() {
  const [min, setMin] = createSignal(0);
  const [max, setMax] = createSignal(125);
  const [font, setFont] = createSignal("Arial");

  return (
    <>
      <div class="flex flex-row items-center flex-wrap justify-between my-8">
        <label class="block text-sm font-medium">
          Min
          <input
            type="number"
            class="mt-1 block w-full text-white bg-transparent"
            value={min()}
            placeholder={min().toString()}
            min={0}
            max={max() - 1}
            onInput={(e) => {
              if (e.target.value === "") return;
              const n = Number.parseInt(e.target.value);
              if (Number.isNaN(n)) return;
              setMin(parseInt(e.target.value));
            }}
          />
        </label>

        <label class="block text-sm font-medium">
          Max
          <input
            type="number"
            class="mt-1 block w-full text-white bg-transparent"
            value={max()}
            placeholder={max().toString()}
            min={min() + 1}
            max={125}
            onInput={(e) => {
              if (e.target.value === "") return;
              const n = Number.parseInt(e.target.value);
              if (Number.isNaN(n)) return;
              setMax(parseInt(e.target.value));
            }}
          />
        </label>

        <label class="block text-sm font-medium">
          Font
          <select
            class="mt-1 block w-full text-white bg-transparent"
            value={font()}
            onChange={(e) => {
              const font = e.target.value;
              if (font) {
                setFont(font);
              }
            }}
          >
            {Array.from(fonts).map((font) => (
              <option value={font}>{font}</option>
            ))}
          </select>
        </label>
      </div>

      <img src={exportImage(min(), max(), font())} />
    </>
  );
}
