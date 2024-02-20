import { trackStore } from "@solid-primitives/deep";
import fitty from "fitty";
import { For, createEffect, createMemo, createSignal, onMount } from "solid-js";
import { grid, settings } from "../store/grid";
import Cell from "./Cell";

import { Refs } from "@solid-primitives/refs";

export const [refs, setRefs] = createSignal<Element[]>([]);

export default function Bingo(props: { top_nav: number }) {
	let content_element: HTMLDivElement;
	let image_url_element: HTMLImageElement;

	const [cel_elements_h, setCelElements_h] = createSignal("");
	const font_min_size = () => Math.max(12, 32 - ((grid.x + grid.y) / 2) * 1.4);

	function _resize() {
		const target = window;
		const h = target.innerHeight - props.top_nav;
		const w = target.innerWidth;
		const content_aspect_ratio = grid.y / grid.x;
		const max_width = Math.min(w, h * content_aspect_ratio);

		if (!settings.fill_screen) {
			// off
			content_element.style.width = `${Math.floor(max_width)}px`;
			image_url_element.style.width = `${Math.floor(max_width)}px`;
			// image_url_element.style.height = `${Math.floor(max_width)}px`;
			image_url_element.style.height = `${Math.floor(
				max_width / content_aspect_ratio
			)}px`;
			setCelElements_h("100%");
		} else {
			content_element.style.width = `${w}px`;
			// content_element.style.height = `${h}px`;
			image_url_element.style.width = `${w}px`;
			image_url_element.style.height = `${h}px`;
			// setCelElements_h(`${h / grid.y}px`);
			setCelElements_h(`${(h - 2) / grid.x}px`);
		}
	}

	createEffect(() => {
		trackStore(settings);
		_resize();

		if (grid.grid_array) {
			if ((grid.x + grid.y) / 2 < 16) {
				createMemo(() => {
					fitty(".word-scale-enabled", {
						minSize: font_min_size(),
						multiLine: true,
					});
				});
			}
		}
	});

	onMount(() => {
		window.onresize = (e: Event) => {
			_resize();
		};
	});

	return (
		<div
			class={`main overflow-hidden bg-gray-950 bg-cover bg-center p-[1px]`}
			ref={content_element}
		>
			<img
				ref={image_url_element}
				src={settings.bg_image_url}
				alt=""
				class={`bg-img p-[1px]`}
				style={{
					top: props.top_nav - 1 + "px",
					position: "absolute",
				}}
			/>

			<Refs ref={setRefs}>
				<For each={grid.grid_array}>
					{(row, i) => (
						<div
							class="flex"
							style={{
								height: `${cel_elements_h()}`,
							}}
						>
							<For each={row}>
								{(text, j) => (
									<Cell
										data_cell={grid.grid_array[i()][j()]}
										i={i()}
										j={j()}
									></Cell>
								)}
							</For>
						</div>
					)}
				</For>
			</Refs>
		</div>
	);
}
