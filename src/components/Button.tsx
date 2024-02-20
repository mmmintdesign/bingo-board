import { JSX, createRoot, createSignal } from "solid-js";
import { TippyOptions, tippy } from "solid-tippy";

tippy;

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
	name?: string;
	disabled?: boolean;
	children?: any;
	fill?: boolean;
	size?: "sm" | "md" | "lg";
	tooltip?: string;
	"use:tippy"?: TippyOptions;
}

export default function Button(
	props: ButtonProps & { icon?: string; children?: any; tooltip?: string }
) {
	const [count, setCount] = createSignal(0);
	let btn;

	return (
		<button
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
			ref={btn}
			class={`group border rounded-t-xl border-green-700 hover:bg-green-700 hover:text-white transition-colors duration-300 min-w-0 overflow-clip
			
			${props.fill ? "w-full" : ""}
			${
				props.size === "sm"
					? "h-8"
					: "" || props.size === "md"
					? "h-10"
					: "" || props.size === "lg"
					? "h-12"
					: "h-8"
			}`}
			onClick={() => setCount(count() + 1)}
			{...props}
			disabled={props.disabled}
		>
			<span class="max-[1020px]:sr-only">
				{props.disabled ? "Disabled" : props.children}
			</span>
			{props.icon ? <span>{props.icon}</span> : ""}
		</button>
	);
}
