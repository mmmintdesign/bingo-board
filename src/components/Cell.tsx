import { Show, createEffect, createMemo, onMount } from "solid-js";
import { Cell_i, grid, grid_f, settings } from "../store/grid";
import Button from "./Button";

import tinycolor from "tinycolor2";

import { trackStore } from "@solid-primitives/deep";
import { Motion, Presence } from "solid-motionone";

export default function Cell(props: {
	data_cell: Cell_i;
	i: number;
	j: number;
}) {
	let element_ref_word: HTMLElement;
	const font_min_size = () => Math.max(10, 32 - ((grid.x + grid.y) / 2) * 1.4);

	let colors = createMemo(() => {
		if (!props.data_cell.checked) {
			return {
				color_bg: settings.colors.color_bg,
				color_text: settings.colors.color_text,
				color_accent: settings.colors.color_accent,
				color_lines: settings.colors.color_lines,
			};
		} else {
			if (props.data_cell.random_colors) {
				function color_combos_random() {
					let bg_color = tinycolor.random().saturate(40);
					let text_color = tinycolor(bg_color.toHexString());

					let most = tinycolor.mostReadable(
						bg_color.clone().darken(15).toHexString(),
						[
							...text_color
								.analogous()
								.map((c) => c.saturate(50).darken(40).toHexString()),
							...text_color
								.analogous()
								.map((c) => c.saturate(20).lighten(70).toHexString()),
							...text_color
								.monochromatic()
								.map((c) => c.saturate(50).toHexString()),
						],
						{
							includeFallbackColors: false,
						}
					);

					bg_color.setAlpha(0.5);
					return {
						bg_color: bg_color.toString(),
						text_color: most.toString(),
						color_accent: "red",
						color_lines: "red",
					};
				}
				const colors = color_combos_random();

				return {
					color_bg: colors.bg_color,
					color_text: colors.text_color,
					color_accent: props.data_cell.color_accent,
					color_lines: colors.bg_color,
				};
			} else {
				let _bg = tinycolor(settings.colors.color_accent)
					.darken(10)
					.setAlpha(0.5)
					.toString();
				let _text =
					tinycolor(settings.colors.color_accent).getBrightness() > 40
						? tinycolor(settings.colors.color_accent)
								.saturate(50)
								.lighten(20)
								.analogous()
								.map((c) => c.toHexString())[4]
						: tinycolor(settings.colors.color_accent)
								.saturate(50)
								.lighten(30)
								.brighten(
									50 - tinycolor(settings.colors.color_accent).getBrightness()
								)
								.toString();
				return {
					color_bg: _bg,
					color_text: _text,
					color_accent: props.data_cell.color_accent,
					color_lines: _bg,
				};
			}
		}
	});

	// const [random, setRandom] = makePersisted(createSignal(false));

	onMount(() => {
		let minSize = 20;
		if (grid.x > 8) {
			minSize = 12;
			if (window.innerWidth > 600) minSize = 14;
		}

		// close menu on escape and enter
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" || e.key === "Enter") {
				// unfocus and remove selection
				element_ref_word.blur();
				window.getSelection().removeAllRanges();
			}
		});
	});

	createEffect(() => {
		trackStore(settings);
		trackStore(grid);
		trackStore(Motion);
	});

	return (
		<Motion.div
			transition={{ duration: 0.2 }}
			class={`w-full outline outline-[2px] -outline-offset-[1px] h-full flex overflow-hidden  font-bold  relative  justify-center items-center group  p-0 self-center text-center break-before-all break-words hyphens-auto   whitespace-normal  ${
				settings.fill_screen ? "w-full" : "aspect-square"
			}

         ${
						props.data_cell.checked
							? "bg-green-500/75 z-[0]"
							: `bg-grey-100 z-[1]`
					}

               `}
			style={{
				background: colors()?.color_bg,
				"outline-color": colors()?.color_lines,
				color: colors()?.color_text,
			}}
			{...props}
		>
			<Presence>
				<Show when={props.data_cell.checked}>
					<Motion.div exit={{}} class="cross-x absolute w-full opacity-35">
						<div class="line absolute h-1 w-full rotate-45 rounded">
							<Motion.div
								initial={{
									width: "0px",
									opacity: 0,
									background: colors()?.color_text,
								}}
								exit={{ width: "0px", opacity: 0 }}
								animate={{ width: "55%", opacity: 1 }}
								class="line-half absolute h-1 w-[55%] rounded"
								// style={{ background: settings.colors.color_accent }}
							></Motion.div>
							<Motion.div
								initial={{
									width: "0px",
									opacity: 0,
									background: colors()?.color_text,
								}}
								exit={{ width: "0px", opacity: 0 }}
								animate={{ width: "55%", opacity: 1 }}
								class="line-half absolute right-0 h-1 w-[55%] rounded"
							></Motion.div>
						</div>
						<div class="line absolute h-1 w-full rotate-[135deg] rounded">
							<Motion.div
								initial={{
									width: "0px",
									opacity: 0,
									background: colors()?.color_text,
								}}
								exit={{ width: "0px", opacity: 0 }}
								animate={{ width: "55%", opacity: 1 }}
								class="line-half absolute h-1 w-[55%] rounded"
							></Motion.div>
							<Motion.div
								initial={{
									width: "0px",
									opacity: 0,
									background: colors()?.color_text,
								}}
								exit={{ width: "0px", opacity: 0 }}
								animate={{ width: "55%", opacity: 1 }}
								class="line-half absolute right-0 h-1 w-[55%] rounded"
							></Motion.div>
						</div>
					</Motion.div>
				</Show>
			</Presence>

			<div
				class="menu absolute bottom-0 z-[1] flex w-full rounded-t-xl bg-green-800/90 opacity-0 group-hover:opacity-100"
				style={{
					background: tinycolor(settings.colors?.color_accent)
						.darken(10)
						.toString(),
				}}
			>
				<Button
					size="sm"
					fill
					icon={!props.data_cell.checked ? "🔳" : "✅"}
					style={{
						height: (grid.x + grid.y) / 2 > 11 ? "16px" : "auto",
						background: tinycolor(settings.colors?.color_accent)
							.darken(2)
							.setAlpha(0.9)
							.toString(),
						"border-color": tinycolor(settings.colors?.color_accent)
							.lighten(10)
							.toString(),
					}}
					onclick={(e) => {
						grid_f.set_enable(props.i, props.j);

						if (settings.random_colors) {
							grid_f.set_random_colors(true, props.i, props.j);
						} else {
							grid_f.set_random_colors(false, props.i, props.j);
						}
					}}
				></Button>
			</div>

			<Show when={settings.show_numbers}>
				<span
					// index number
					style={{
						color: "props.data_cell?.color_text",
					}}
					class={`absolute top-1 left-1 opacity-50 font-normal text-md max-[670px]:text-[10px] max-[670px]:top-0 max-[670px]:left-0 select-none
            ${props.data_cell.checked ? "hidden" : ""}`}
				>
					{props.data_cell.not_checked_index}
				</span>
			</Show>

			<Motion.span
				initial={(grid.x + grid.y) / 2 < 15 ? { opacity: 0, scale: 0 } : false}
				animate={{ scale: 1, opacity: 1 }}
				transition={{
					duration: 0.4,
					easing: [0.16, 1, 0.3, 1],
					delay: (() => {
						let center1i = Math.floor(grid.x / 2);
						let center2i = center1i - 1;
						let center1j = Math.floor(grid.y / 2);
						let center2j = center1j - 1;

						let distanceFromCenter1i = Math.abs(props.i - center1i);
						let distanceFromCenter2i = Math.abs(props.i - center2i);
						let distanceFromCenter1j = Math.abs(props.j - center1j);
						let distanceFromCenter2j = Math.abs(props.j - center2j);

						let maxDistanceI =
							grid.x % 2 === 0
								? Math.min(distanceFromCenter1i, distanceFromCenter2i)
								: distanceFromCenter1i;
						let maxDistanceJ =
							grid.y % 2 === 0
								? Math.min(distanceFromCenter1j, distanceFromCenter2j)
								: distanceFromCenter1j;

						return Math.max(maxDistanceI, maxDistanceJ) * 0.1;
					})(),
				}}
				// @ts-ignore
				contenteditable="true"
				plaintext-only
				spellcheck
				ref={element_ref_word}
				class={`cell-word inline-block p-[10%] ${
					// has more than 3 spaces
					props.data_cell?.word?.split(" ").length > 2
						? "word-scale-disabled"
						: "word-scale-enabled"
				}`}
				style={{
					"font-size": font_min_size() + "px",
					"line-height": "100%",
				}}
				onDragStart={(e) => {
					e.preventDefault();
				}}
			>
				{props.data_cell.word}
			</Motion.span>
		</Motion.div>
	);
}
