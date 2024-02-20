import fitty from "fitty";
import { For, createSignal, onMount } from "solid-js";
import Bingo, { refs } from "../components/Bingo";
import Bomb from "../components/Bomb";
import Button from "../components/Button";
import List, { setVisibility, visibility } from "../components/List";
import Nuke from "../components/Nuke";
import Toggle from "../components/Toggle";
import { grid, grid_f, settings, settings_f } from "../store/grid";

export let content_element: HTMLDivElement;

export default function Home() {
	const [count, setCount] = createSignal(0);
	const top_nav = 52;

	let image_url_element: HTMLImageElement;
	let point_element;
	let bomb_element;

	onMount(() => {
		setTimeout(() => {
			fitty.fitAll();
		}, 100);
	});
	const [bombs, setBombs] = createSignal([]);
	const [nukes, setNukes] = createSignal([]);

	let bomb_ref: HTMLDivElement;
	let nuke_ref: HTMLDivElement;

	return (
		<section
			class="h-screen overflow-hidden bg-gray-100"
			style={`background:${settings.colors?.color_bg}`}
		>
			<div class="bombs" ref={bombs}>
				<For ref={bomb_ref} each={bombs()}>
					{(bomb) => (
						<Bomb
							ref={bomb_ref}
							top_nav={top_nav}
							cell_size={{
								width: refs()[0]?.children[0].clientWidth,
								height: refs()[0]?.children[0].clientHeight,
							}}
						></Bomb>
					)}
				</For>

				<For ref={nuke_ref} each={nukes()}>
					{(bomb) => (
						<Nuke
							ref={nuke_ref}
							top_nav={top_nav}
							cell_size={{
								width: refs()[0]?.children[0].clientWidth,
								height: refs()[0]?.children[0].clientHeight,
							}}
						></Nuke>
					)}
				</For>
			</div>

			<div
				style={{ height: `${top_nav}px` }}
				class="top 5 flex w-full place-content-between place-items-center p-2 px-3"
			>
				<div class="wrap flex h-9 gap-3 overflow-hidden">
					<Button
						tooltip="Cross Random Cell"
						class="pointer-events-auto rounded-md bg-blue-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-blue-600 active:scale-95 active:bg-blue-500"
						icon={`⭐`}
						onclick={() => {
							function _try() {
								if (grid.grid_array.flat().every((cell) => cell.checked)) {
									return;
								}
								let i = Math.floor(Math.random() * grid.x);
								let j = Math.floor(Math.random() * grid.y);
								if (grid.grid_array[i][j].checked === false) {
									if (settings.random_colors) {
										grid_f.set_random_colors(true, i, j);
									} else {
										grid_f.set_random_colors(false, i, j);
									}
									grid_f.set_enable(i, j);
								} else {
									_try();
								}
							}
							_try();
						}}
					>
						Cross Random
					</Button>

					<Button
						tooltip="Un-Cross Random Cell"
						icon={`🔥`}
						class="pointer-events-auto rounded-md bg-orange-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-orange-600 active:scale-95 active:bg-orange-500"
						onclick={() => {
							// disable random cell on grid
							function _try() {
								if (grid.grid_array.flat().every((cell) => !cell.checked)) {
									return;
								}
								let i = Math.floor(Math.random() * grid.x);
								let j = Math.floor(Math.random() * grid.y);
								if (grid.grid_array[i][j].checked === true) {
									grid_f.set_enable(i, j);
								} else {
									_try();
								}
							}
							_try();
						}}
					>
						Un-Cross Random
					</Button>

					<Button
						tooltip="Add a bomb to the grid"
						icon={`💣`}
						class="pointer-events-auto rounded-md bg-red-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-red-600 active:scale-95 active:bg-red-500"
						onclick={() => {
							setBombs([...bombs(), Bomb]);
							// setVisibility(!visibility());
						}}
					>
						Bomba
					</Button>

					<Button
						tooltip="Nuke the grid"
						icon={`☢️`}
						class="pointer-events-auto rounded-md bg-zinc-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-zinc-700 active:scale-95 active:bg-zinc-600"
						onclick={() => {
							setNukes([...nukes(), Nuke]);
							// setVisibility(!visibility());
						}}
					>
						Nuke
					</Button>
				</div>

				<div class="wrap flex h-9 place-content-between place-items-center gap-4 overflow-hidden">
					<div class="wrap flex h-9 gap-3 overflow-hidden">
						<Button
							icon="🔀"
							tooltip="Generate a new board"
							class="pointer-events-auto rounded-md bg-blue-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-blue-600 active:scale-95 active:bg-blue-500"
							onclick={() => {
								grid_f.update_grid(grid.x, grid.y);
								setTimeout(() => {
									fitty.fitAll();
								}, 100);
							}}
						>
							Generate Board
						</Button>
						<Button
							icon="⚙️"
							tooltip="Settings"
							class="pointer-events-auto rounded-md bg-slate-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-slate-600 active:scale-95 active:bg-slate-500"
							onclick={() => {
								setVisibility(!visibility());
							}}
						>
							Settings
						</Button>
					</div>

					<div class="wrap flex gap-2">
						<span
							class="text-[0.8125rem] font-semibold leading-5"
							style={{
								color: settings.colors.color_text,
							}}
						>
							Fill View
						</span>
						<Toggle
							tooltip="Toggle Fill Screen"
							onClick={() => {
								settings_f.set_full_screen(!settings.fill_screen);
								setTimeout(() => {
									fitty.fitAll();
								}, 100);
							}}
							toggler={settings.fill_screen}
						></Toggle>
					</div>
				</div>
			</div>

			<List></List>

			<Bingo top_nav={top_nav}></Bingo>
		</section>
	);
}
