import { makePersisted } from "@solid-primitives/storage";
import { createStore, produce } from "solid-js/store";
import { init_words } from "./init_words";

interface wordsState {
	lists: string[][];
	current_list: string[];
	current_list_index: number;
}

interface AppActions {
	set_current_list_words(value: string[]): void;
	enable_list(value: number): void;
	add_word(value: string): void;
	remove_word(value: number): void;
	update_word(value: number, new_value: string): void;
	clear_current_list(): void;
}

export const [words, setWords] = makePersisted(
	createStore<wordsState>({
		lists: [
			init_words,
			// prettier-ignore
			[
				"buh", "suh", "duh", "fuh", "guh", "huh", "juh", "kuh", "luh", "muh", "nuh", "puh", "quh", "ruh", "suh", "tuh", "vuh", "wuh", "xuh", "yuh", "zuh",
			],
			// prettier-ignore
			[
				
			],
		],
		current_list: [],
		current_list_index: 0,
	})
);

export const words_f: AppActions = {
	set_current_list_words(value: string[]) {
		setWords(
			produce((words) => {
				words.current_list = value;
			})
		);
	},
	enable_list(value: number) {
		setWords("current_list", words.lists[value]);
		setWords("current_list_index", value);
	},
	add_word(value: string) {
		setWords(
			produce((words) => {
				words.current_list.unshift(value);
			})
		);
	},
	remove_word(value: number) {
		setWords(
			produce((words) => {
				words.current_list.splice(value, 1);
			})
		);
	},
	update_word(value: number, new_value: string) {
		setWords(
			produce((words) => {
				words.current_list[value] = new_value;
			})
		);
	},
	clear_current_list() {
		setWords(
			produce((words) => {
				words.current_list.splice(0, words.current_list.length);
			})
		);
	},
};
words_f.enable_list(words.current_list_index);
