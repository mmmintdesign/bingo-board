import { leadingAndTrailing, throttle } from "@solid-primitives/scheduled";
import { makePersisted } from "@solid-primitives/storage";
import { For, createSignal } from "solid-js";
import tinycolor from "tinycolor2";
import { grid, grid_f, settings, settings_f } from "../store/grid";
import { words, words_f } from "../store/words";
import Button from "./Button";
import Toggle from "./Toggle";

export const [visibility, setVisibility] = createSignal(false);
const [linked, setLinked] = makePersisted(createSignal(false));

export default function List() {
	let element: HTMLInputElement;
	let image_url_element: HTMLInputElement;
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			// unfocus and remove selection
			element.blur();
			window.getSelection().removeAllRanges();
		}
	});

	const [prevWord, setprevWord] = createSignal("");

	const trigger_color = leadingAndTrailing(
		throttle,
		(e: InputEvent, color_type_index: number) => {
			settings_f.set_colors(
				color_type_index == 0
					? (e.target as HTMLInputElement).value
					: settings.colors.color_bg,
				color_type_index == 1
					? (e.target as HTMLInputElement).value
					: settings.colors.color_text,
				color_type_index == 2
					? (e.target as HTMLInputElement).value
					: settings.colors.color_accent,
				color_type_index == 3
					? (e.target as HTMLInputElement).value
					: settings.colors.color_lines
			);
		},
		75
	);

	return (
		<div
			class="row absolute right-4 z-10 flex min-h-[600px] w-[600px] gap-2 rounded-xl bg-slate-500 p-2 shadow-md"
			style={
				!visibility() ? { visibility: "hidden" } : { visibility: "visible" }
			}
		>
			<div class="left w-full">
				<div class="info p-2 text-slate-200">
					<h1 class="text-xl font-bold">😄 Bingo Board</h1>
					<a
						href="https://twitter.com/mmmintdesign"
						style={{ "padding-left": "6px" }}
						class="text-sm font-semibold text-slate-300"
					>
						by @mmmintdesign
					</a>
				</div>
				<div class="info p-2 text-slate-200">
					Size{" "}
					<span class={`text-sm font-semibold text-slate-300`}>
						{grid.x * grid.y}
					</span>
				</div>
				<div class="col size flex gap-2">
					{/* size links */}
					<input
						type="number"
						min={2}
						max={15}
						value={grid.x}
						class="w-1/3 rounded-md bg-slate-600 p-1 pl-2 text-slate-200"
						onkeydown={(e) => {
							if (e.key === "Escape") {
								(e.target as HTMLInputElement).blur();
								window.getSelection().removeAllRanges();
							}
						}}
						onchange={(e) => {
							if (linked()) {
								grid_f.change_size(parseInt(e.target.value), grid.y);
							} else {
								grid_f.change_size(
									parseInt(e.target.value),
									parseInt(e.target.value)
								);
							}
						}}
					/>

					<input
						type="number"
						min={2}
						max={15}
						value={grid.y}
						class={`bg-slate-600 text-slate-200 rounded-md p-1 w-1/3 pl-2
                  ${!linked() ? "opacity-50" : "opacity-100"}
                  `}
						disabled={!linked() ? true : false}
						onkeydown={(e) => {
							if (e.key === "Escape") {
								(e.target as HTMLInputElement).blur();
								window.getSelection().removeAllRanges();
							}
						}}
						onchange={(e) => {
							grid_f.update_grid(grid.x, parseInt(e.target.value));
						}}
					/>

					<Button
						icon={`🔗`}
						tooltip="Link Size"
						onclick={() => {
							setLinked(!linked());
						}}
						class={`hover:bg-slate-600 w-8 h -4  flex place-items-center items-center justify-center rounded  remove cursor-pointer select-none hover:scale-110 transition active:scale-100
                  ${!linked() ? "bg-slate-700" : "bg-slate-700 opacity-50"}
                  `}
					></Button>
				</div>

				{/* color picker */}
				<div class="color flex flex-col gap-2">
					<div class="info pl-2 pt-4 text-slate-200">Colors</div>

					<div class="col size flex place-items-center justify-evenly gap-4 p-1 text-[0.8125rem] font-semibold">
						<div class="color flex flex-col gap-2">
							{/* 1 */}
							<div class="color flex flex-col items-center">
								<input
									type="color"
									value={settings.colors?.color_bg ?? "#f3f4f6"}
									class="h-8 w-8 rounded-lg bg-slate-400 text-slate-200"
									onkeydown={(e) => {
										if (e.key === "Escape") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
										}
									}}
									oninput={(e) => {
										trigger_color(e, 0);
									}}
								/>
								<div class="info p-0 text-center text-slate-200">BG</div>
							</div>
							{/* 2 */}
							<div class="color flex flex-col items-center">
								<input
									type="color"
									value={settings.colors?.color_text}
									class="h-8 w-8 rounded-lg bg-slate-400 text-slate-200"
									onkeydown={(e) => {
										if (e.key === "Escape") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
										}
									}}
									oninput={(e) => {
										trigger_color(e, 1);
									}}
								/>
								<div class="info p-0 text-center text-slate-200">TEXT</div>
							</div>
						</div>

						<div class="color flex flex-col items-center gap-2">
							{/* 3 */}
							<div class="color flex flex-col">
								<input
									type="color"
									// disabled={rainbow()}
									value={settings.colors?.color_accent}
									class={`h-8 w-8 rounded-lg bg-slate-400 text-slate-200`}
									onkeydown={(e) => {
										if (e.key === "Escape") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
										}
									}}
									oninput={(e) => {
										trigger_color(e, 2);
									}}
								/>
								<div class="info p-0 text-center text-slate-200">ACC</div>
							</div>
							{/* 4 */}
							<div class="color flex flex-col items-center">
								<input
									type="color"
									value={settings.colors?.color_lines}
									class={`h-8 w-8 rounded-lg bg-slate-400 text-slate-200`}
									onkeydown={(e) => {
										if (e.key === "Escape") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
										}
									}}
									oninput={(e) => {
										trigger_color(e, 3);
									}}
								/>
								<div class="info p-0 text-center text-slate-200">LINES</div>
							</div>
						</div>
						{/* color buttons */}
						<Button
							icon={`🎲`}
							tooltip="Randomize Colors"
							onclick={() => {
								// generate random color and 3 additional colors
								let { color1, r2, a, b } = color_combos();
								settings_f.set_colors(color1, r2.toHexString(), a, b);

								function color_combos() {
									let color1 = tinycolor.random().toHexString();
									let r2 = tinycolor(color1);
									if (tinycolor(color1).isDark()) {
										r2 = tinycolor(color1).lighten(50);
									} else {
										r2 = tinycolor(color1).darken(50);
									}

									let a = tinycolor.random().toHexString();
									let b = tinycolor(a)
										.analogous()
										.map((c) => c.toHexString())[4];
									return { color1, r2, a, b };
								}
							}}
							class={`hover:bg-slate-600 w-8 h-8  flex place-items-center items-center justify-center rounded  remove cursor-pointer select-none hover:scale-110 transition active:scale-100 bg-slate-700
                  "}
                  `}
						></Button>

						<Button
							icon={`🌈`}
							tooltip={`Rainbow Colors ${
								settings.random_colors ? "[ON]" : "[OFF]"
							}`}
							onclick={() => {
								// setRainbow(!rainbow());
								settings_f.set_random_colors(!settings.random_colors);
							}}
							class={`hover:bg-pink-600 w-8 h-8  flex place-items-center items-center justify-center rounded  remove cursor-pointer select-none hover:scale-110 transition active:scale-100
                  ${
										settings.random_colors
											? "bg-pink-500"
											: "bg-pink-500 opacity-50"
									}
                  `}
						></Button>
					</div>
				</div>

				{/* image */}

				<div class="info p-2 text-slate-200">Bg Image</div>
				<div class="color flex flex-col gap-1">
					<input
						type="url"
						ref={image_url_element}
						// value={grid.x}
						placeholder="https://example.com/image.gif"
						class="w-full rounded-md bg-slate-600 p-1 pl-2 text-slate-200"
						onkeydown={(e) => {
							if (e.key === "Escape") {
								(e.target as HTMLInputElement).blur();
								window.getSelection().removeAllRanges();
							}
						}}
					/>
					<Button
						tooltip="Load Image (empty url to remove image)"
						icon={`Load`}
						class="pointer-events-auto bottom-16 left-4 rounded-md bg-blue-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-blue-600 active:scale-95 active:bg-blue-500"
						onclick={() => {
							// console.log("%c%s", "color: #408059", image_url_element.value);
							settings_f.set_bg_image_url(image_url_element.value);
						}}
					></Button>
				</div>
				{/* buttons */}

				<div class="wrap flex gap-2 pt-3">
					<Toggle
						tooltip="Show index numbers"
						onClick={() => {
							settings_f.set_show_numbers(!settings.show_numbers);
						}}
						toggler={settings.show_numbers}
					></Toggle>
					<span class="text-[0.8125rem] font-semibold leading-5 text-slate-200">
						Show index numbers
					</span>
				</div>

				<Button
					tooltip="Clear Grid"
					icon={`Clear Grid 🧹`}
					class="pointer-events-auto absolute bottom-16 left-4 rounded-md bg-orange-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-orange-600 active:scale-95 active:bg-orange-500"
					onclick={() => {
						grid_f.clear_grid();
					}}
				></Button>

				<Button
					icon={`Remove all Words 🗑️`}
					tooltip="Remove all words from current list"
					class="pointer-events-auto absolute bottom-4 left-4 rounded-md bg-red-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-red-600 active:scale-95 active:bg-red-500"
					onclick={() => {
						grid_f.remove_all_words();
					}}
				></Button>

				<Button
					tooltip="Resets all settings to default"
					icon={`Full reset 🔄`}
					class="pointer-events-auto absolute bottom-16 left-32 rounded-md bg-indigo-500 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-600 active:scale-95 active:bg-indigo-500"
					onclick={() => {
						window.localStorage.clear();
						window.location.reload();
					}}
				></Button>
			</div>

			<div class="right w-full">
				<div class="info p-2 text-slate-200">
					Total Words: {words.current_list?.length}
				</div>

				<div
					onclick={() => {
						setVisibility(!visibility());
					}}
					class={` w-8 h-8 absolute top-2 right-2  flex place-items-center items-center justify-center rounded  remove cursor-pointer select-none hover:scale-90 transition active:scale-100 brightness-150 hover:brightness-50
                  "}
                  `}
				>
					✖️
				</div>

				<li class="mb-4 flex h-12 w-full place-items-center justify-between rounded-md bg-slate-600 p-1 text-slate-200">
					<div class={`list-presets flex flex-row gap-1`}>
						<Button
							icon={`📚`}
							tooltip="Load Word Preset 1"
							onclick={() => {
								words_f.enable_list(0);
								// grid_f.add_word(element.value);
							}}
							class={`remove flex h-8 w-8 cursor-pointer select-none place-items-center items-center justify-center rounded transition hover:scale-110 hover:bg-slate-700 active:scale-100 
						${words.current_list_index == 0 ? "bg-slate-800" : "bg-slate-600"}`}
						></Button>
						<Button
							icon={`📚`}
							tooltip="Load Word Preset 2"
							onclick={() => {
								words_f.enable_list(1);
								// grid_f.add_word(element.value);
							}}
							class={`remove flex h-8 w-8 cursor-pointer select-none place-items-center items-center justify-center rounded transition hover:scale-110 hover:bg-slate-700 active:scale-100 
						${words.current_list_index == 1 ? "bg-slate-800" : "bg-slate-600"}`}
						></Button>
						<Button
							icon={`📚`}
							tooltip="Load Word Preset 3"
							onclick={() => {
								words_f.enable_list(2);
								// grid_f.add_word(element.value);
							}}
							class={`remove flex h-8 w-8 cursor-pointer select-none place-items-center items-center justify-center rounded transition hover:scale-110 hover:bg-slate-700 active:scale-100 
						${words.current_list_index == 2 ? "bg-slate-800" : "bg-slate-600"}`}
						></Button>
					</div>

					<div class="right flex">
						<input
							ref={element}
							type="text"
							placeholder="Add new word..."
							class="w-full rounded-md bg-slate-600 p-1 text-slate-200"
							onkeypress={(e) => {
								if (e.key === "Escape") {
									(e.target as HTMLInputElement).blur();
									window.getSelection().removeAllRanges();
								}
								if (e.key === "Enter") {
									grid_f.add_word(element.value);
									element.focus();
									element.value = "";
								}
							}}
						/>
						<Button
							icon={`😺`}
							tooltip="Add Word to List"
							onclick={() => {
								grid_f.add_word(element.value);
							}}
							class="add h-8 w-8 cursor-pointer select-none transition hover:scale-150 active:scale-100"
						></Button>
					</div>
				</li>

				<ul class="flex max-h-[475px] flex-col gap-1 overflow-y-scroll">
					<For
						each={words.current_list}
						fallback={
							<div class="center w-full p-4 text-center text-slate-800">
								No words
							</div>
						}
					>
						{(word, i) => (
							<li class="group flex h-10 w-full place-items-center justify-between rounded-md bg-slate-600 p-2 text-slate-200">
								<input
									type="text"
									value={word}
									class="w-4/5 rounded-md bg-slate-600 p-1 text-slate-200"
									onclick={(e) => {
										setprevWord(word);
									}}
									onkeyup={(e) => {
										if (e.key === "Tab") {
											setprevWord(word);
										}
									}}
									onkeydown={(e) => {
										if (e.key === "Escape") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
											// _tempWord.value = prevWord()
											// e.target.value = prevWord();
											(e.target as HTMLInputElement).value = prevWord();
										}
										if (e.key === "Enter") {
											(e.target as HTMLInputElement).blur();
											window.getSelection().removeAllRanges();
											words_f.update_word(
												i(),
												(e.target as HTMLInputElement).value
											);
										}
									}}
								/>
								<div
									onclick={() => {
										grid_f.remove_word(i());
									}}
									class="remove cursor-pointer select-none rounded transition hover:scale-125 hover:bg-red-400/25 active:scale-100"
								>
									❌
								</div>
							</li>
						)}
					</For>
				</ul>
			</div>
		</div>
	);
}
