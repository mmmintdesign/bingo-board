import { JSX, createRoot, createSignal } from "solid-js";
import { TippyOptions, tippy } from "solid-tippy";

type ExtendedType = JSX.HTMLAttributes<HTMLInputElement> &
	JSX.HTMLAttributes<HTMLLabelElement>;

interface ToggleProps extends ExtendedType {
	name?: string;
	disabled?: boolean;
	children?: any;
	fill?: boolean;
	size?: "sm" | "md" | "lg";
	tooltip?: string;
	"use:tippy"?: TippyOptions;
}

export default function Toggle(
	props: ToggleProps & {
		children?: any;
		toggler: boolean;
		tooltip?: string;
		onClick?: () => void;
	}
) {
	let [anchor, setAnchor] = createSignal(null);

	tippy;

	return (
		<label
			use:tippy={{
				hidden: true,
				props: {
					duration: [0, 25],
					hideOnClick: false,
					content: () =>
						createRoot(() => (
							<div
								class={`bg-gray-800 text-[0.8125rem] font-semibold text-white p-1 px-2 rounded-md ${
									!props.tooltip ? "hidden" : "visible"
								}`}
							>
								{props.tooltip}
							</div>
						)),
					placement: "bottom",
				},
			}}
			{...props}
			class="group relative inline-flex h-5 w-11 flex-shrink-0 cursor-pointer items-center justify-center"
		>
			<input
				ref={anchor}
				onClick={props.onClick}
				class="peer absolute hidden h-5 w-10 rounded border-none checked:border-0 checked:bg-transparent checked:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 checked:focus:bg-transparent"
				name="foo"
				value="bar"
			/>
			<span
				class={`pointer-events-none absolute mx-auto h-6 w-10 rounded-full transition-colors duration-200 ease-in-out
			${props.toggler ? "bg-blue-500" : "bg-gray-200"}`}
			></span>
			<span
				class={`${
					props.toggler ? "translate-x-5" : "translate-x-1"
				} absolute bg-white border border-gray-200 duration-200 ease-in-out h-5 left-0 pointer-events-none ring-0 rounded-full shadow transform transition-transform translate-x-0 w-5 `}
			></span>
		</label>
	);
}
