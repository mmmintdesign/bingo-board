import { SetStoreFunction, createStore, produce, unwrap } from "solid-js/store";
import Cell from "../components/Cell";
import tinycolor from "tinycolor2";

import { makePersisted } from "@solid-primitives/storage";
import {
	Accessor,
	createEffect,
	createResource,
	createSignal,
	onMount,
} from "solid-js";
import { setWords, words, words_f } from "./words";

export interface Cell_i {
	i: number;
	j: number;
	word: string;
	// cell number is i + j
	checked: boolean;
	not_checked_index: number;
	index: number;
	// color
	random_colors: boolean;
	color_bg: string;
	color_text: string;
	color_accent: string;
	color_lines: string;
}

// Grid
export const [grid, setGrid] = makePersisted(
	createStore({
		x: 7,
		y: 7,
		grid_array: [],
		// words: [
		// 	"cat",
		// 	"dog",
		// 	"bird",
		// 	"fish",
		// 	"snake",
		// 	"lizard",
		// 	"hamster",
		// 	"rabbit",
		// 	"parrot",
		// 	"tiger",
		// 	"lion",
		// 	"rock",
		// ],
	})
);

export const grid_f = {
	create_grid(x: number, y: number) {
		let _grid: Cell_i[][] = [];
		let _words = [...words.current_list];
		for (let i = 0; i < x; i++) {
			_grid.push([]);
			for (let j = 0; j < y; j++) {
				// word can be used only once, if there is not enough words, replace with empty string
				let wordIndex = Math.floor(Math.random() * _words.length);
				let word = _words[wordIndex];
				_words.splice(wordIndex, 1);

				_grid[i].push({
					word: word,
					index: i * x + j,
					i: i,
					j: j,
					random_colors: _grid[i][j]?.random_colors,
					checked: false,
					not_checked_index: i * x + j + 1,
					color_bg: _grid[i][j]?.color_bg || "#f3f4f6",
					color_text: _grid[i][j]?.color_text || "#374151",
					color_accent: _grid[i][j]?.color_accent || "#1f9a4c",
					color_lines: _grid[i][j]?.color_lines || "#e5e7eb",
				});
			}
		}

		return _grid;
	},

	update_grid(x: number, y: number) {
		setGrid(
			produce((grid) => {
				grid.x = x;
				grid.y = y;
				grid.grid_array = this.create_grid(x, y);
			})
		);
	},

	set_enable_disable(coordinates: { x: number; y: number }, remove: boolean) {
		setGrid(
			produce((grid) => {
				// grid.grid_array[coordinates.x][coordinates.y].checked = true;
				// nearby cells are also checked 1 cell away
				grid.grid_array[coordinates.x][coordinates.y].checked = remove;
			})
		);
	},

	get_coordinates(index: number) {
		return { x: Math.floor(index / grid.x), y: index % grid.y };
	},

	get_index(coordinates: { x: number; y: number }) {
		return coordinates.x * grid.x + coordinates.y;
	},

	set_explosion_index(coordinates: { x: number; y: number }) {
		setGrid(
			produce((grid) => {
				// grid.grid_array[coordinates.x][coordinates.y].checked = true;
				// nearby cells are also checked 1 cell away
				const directions = [
					{ dx: 0, dy: 0 },
					{ dx: 0, dy: 1 },
					{ dx: 0, dy: -1 },
					{ dx: 1, dy: 0 },
					{ dx: 1, dy: 1 },
					{ dx: -1, dy: -1 },
					{ dx: -1, dy: 0 },
					{ dx: -1, dy: 1 },
					{ dx: 1, dy: -1 },
				];

				setGrid(
					produce((grid) => {
						directions.forEach((direction) => {
							let x = coordinates.x + direction.dx;
							let y = coordinates.y + direction.dy;
							if (x >= 0 && x < grid.x && y >= 0 && y < grid.y) {
								grid.grid_array[x][y].checked = false;
							}
						});
					})
				);

				this.refresh_indexes();
			})
		);
	},

	set_explosion_index_cross(coordinates: { x: number; y: number }) {
		setGrid(
			produce((grid) => {
				// coordinates x and y are center point, so we need to check all cells in the same row and column
				for (let i = 0; i < grid.x; i++) {
					grid.grid_array[i][coordinates.y].checked = false;
				}
				for (let j = 0; j < grid.y; j++) {
					grid.grid_array[coordinates.x][j].checked = false;
				}

				this.refresh_indexes();
			})
		);
	},

	refresh_indexes() {
		setGrid(
			produce((grid) => {
				let _index = 0;
				grid.grid_array.forEach((row, i) => {
					row.forEach((cell: any, j: any) => {
						if (cell.checked) {
							cell.not_checked_index = -1;
						} else {
							cell.not_checked_index = 1 + _index++;
						}
					});
				});
			})
		);
	},

	set_random_colors(value: boolean, i: number, j: number) {
		setGrid(
			produce((grid) => {
				grid.grid_array[i][j].random_colors = value;
			})
		);
	},

	change_size(x: number, y: number) {
		function _change_size(x: number, y: number) {
			let _grid: Cell_i[][] = [];
			for (let i = 0; i < x; i++) {
				_grid.push([]);
				for (let j = 0; j < y; j++) {
					// keep previous words in the same position
					let word = "";
					if (grid.grid_array[i] && grid.grid_array[i][j]) {
						word = grid.grid_array[i][j].word;
					}

					_grid[i].push({
						word: word,
						index: i * x + j,
						i: i,
						j: j,
						random_colors: _grid[i][j]?.random_colors,
						checked: false,
						not_checked_index: i * x + j + 1,
						color_bg: _grid[i][j]?.color_bg || "#f3f4f6",
						color_text: _grid[i][j]?.color_text || "#374151",
						color_accent: _grid[i][j]?.color_accent || "#1f9a4c",
						color_lines: _grid[i][j]?.color_lines || "#e5e7eb",
					});
				}
			}

			return _grid;
		}

		// increase size by 1 while keeping previous cells and words in the same position
		setGrid(
			produce((grid) => {
				grid.x = x;
				grid.y = y;
				grid.grid_array = _change_size(grid.x, grid.y);
			})
		);
	},

	clear_grid() {
		setGrid(
			produce((grid) => {
				grid.grid_array.forEach((row, i) => {
					row.forEach((cell: any, j: any) => {
						cell.word = "";
						cell.checked = false;
						cell.not_checked_index = i * grid.x + j + 1;
					});
				});
			})
		);
	},
	remove_all_words() {
		// setGrid(
		// 	produce((grid) => {
		// 		// grid.words = [];
		// 		words_f.clear_current_list();
		// 	})
		// );
		words_f.clear_current_list();
	},
	add_word(word: string) {
		// setGrid(
		// 	produce((grid) => {
		// 		// add in the first position
		// 		grid.words.unshift(word);
		// 	})
		// );
		words_f.add_word(word);
	},
	remove_word(index: number) {
		// setGrid(
		// 	produce((grid) => {
		// 		grid.words.splice(index, 1);
		// 	})
		// );
		words_f.remove_word(index);
	},
	set_enable(x: number, y: number) {
		setGrid(
			produce((grid) => {
				if (grid.grid_array[x][y].checked) {
					grid.grid_array[x][y].checked = false;
					// grid.grid_array[x][y].not_checked_index = -1;
				} else {
					// grid.grid_array[x][y].word = value;
					grid.grid_array[x][y].checked = true;
					// grid.grid_array[x][y].not_checked_index = -1;
				}
				let _index = 0;
				grid.grid_array.forEach((row, i) => {
					row.forEach((cell: any, j: any) => {
						if (cell.checked) {
							cell.not_checked_index = -1;
						} else {
							cell.not_checked_index = 1 + _index++;
						}
					});
				});

				return grid;
			})
		);
	},

	set_colors(
		x: number,
		y: number,
		color_bg: string,
		color_text: string,
		color_accent: string,
		color_lines: string
	) {
		setGrid(
			produce((grid) => {
				grid.grid_array[x][y].color_bg = color_bg;
				grid.grid_array[x][y].color_text = color_text;
				grid.grid_array[x][y].color_accent = color_accent;
				grid.grid_array[x][y].color_lines = color_lines;
			})
		);
	},

	set_all_colors(
		color_bg: string,
		color_text: string,
		color_accent: string,
		color_lines: string
	) {
		setGrid(
			produce((grid) => {
				grid.grid_array.forEach((row, i) => {
					row.forEach((cell: any, j: any) => {
						cell.color_bg = color_bg;
						cell.color_text = color_text;
						cell.color_accent = color_accent;
						cell.color_lines = color_lines;
					});
				});
			})
		);
	},
};
// if first time load
if (grid.grid_array.length === 0) {
	grid_f.update_grid(grid.x, grid.y);
}

// Settings
export const [settings, setSettings] = makePersisted(
	createStore({
		fill_screen: false,
		colors: {
			// color_bg: "#f3f4f6",
			// color_text: "#374151",
			// color_accent: "#1f9a4c",
			// color_lines: "#e5e7eb",
			color_bg: "#07112c",
			color_text: "#c4c4f3",
			color_accent: "#4e4cc2",
			color_lines: "#001d4d",
		},
		random_colors: false,
		bg_image_url: "https://cdn.7tv.app/emote/6309e73ffe72a7a37ff476f5/4x.webp",
		show_numbers: true,
	})
);

export const settings_f = {
	set_show_numbers(value: boolean) {
		setSettings("show_numbers", value);
	},
	set_random_colors(value: boolean) {
		setSettings(
			produce((settings) => {
				settings.random_colors = value;
			})
		);
	},
	set_bg_image_url(value: string) {
		setSettings(
			produce((settings) => {
				settings.bg_image_url = value;
			})
		);
	},
	set_colors(
		color_bg: string,
		color_text: string,
		color_accent: string,
		color_lines: string
	) {
		setSettings(
			produce((settings) => {
				settings.colors.color_bg = color_bg;
				settings.colors.color_text = color_text;
				settings.colors.color_accent = color_accent;
				settings.colors.color_lines = color_lines;
			})
		);
	},
	set_full_screen(value: boolean) {
		setSettings(
			produce((settings) => {
				settings.fill_screen = value;
			})
		);
	},
};
