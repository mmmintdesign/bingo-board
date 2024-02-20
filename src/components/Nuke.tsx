import { animate, spring } from "motion";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { Motion } from "solid-motionone";
import { grid, grid_f } from "../store/grid";

export default function Nuke(props: {
	cell_size: { width: number; height: number };
	top_nav: number;
}) {
	let point_element: HTMLDivElement;
	let bomb_element: HTMLDivElement;
	let main: HTMLDivElement;
	let shock_waves: HTMLElement[] = [];
	let shock_wave_main: HTMLDivElement;
	let flash_element: HTMLDivElement;
	let cross_shock_waves: HTMLElement[] = [];

	const [finished, setFinished] = createSignal(false);
	const [hit_point_index, setHitPointIndex] = createSignal(26 + 1);
	const [cross, setCross] = createSignal([]);

	onMount(() => {
		setHitPointIndex(Math.floor(Math.random() * (grid.x * grid.y)));
		move();

		setCross(cross_func());
	});

	function move() {
		const moves = 2;
		let timeline_frames: [
			HTMLElement,
			{ x: number; y: number },
			{ duration: number; easing?: any }
		][] = [];
		let keyframes: { x: number[]; y: number[] } = { x: [], y: [] };
		for (let i = 0; i < moves; i++) {
			let rect = {
				x: props.cell_size.width * grid_f.get_coordinates(hit_point_index()).y,
				y:
					props.cell_size.height * grid_f.get_coordinates(hit_point_index()).x +
					props.top_nav,
			};
			if (i === 0) {
				const a1 = Math.floor(Math.random() * (grid.x * grid.y));
				rect = {
					x: props.cell_size.width * grid_f.get_coordinates(a1).y,
					y:
						props.cell_size.height * grid_f.get_coordinates(a1).x +
						props.top_nav,
				};
			}

			let easing;
			if (i > 0) {
				easing = spring();
			}
			timeline_frames.push([
				point_element,
				{ x: rect.x, y: rect.y },
				{ duration: 0.2, easing: easing },
			]);
			keyframes.x.push(rect.x);
			keyframes.y.push(rect.y);
		}

		animate(
			point_element,
			{
				x: window.innerHeight / 2,
				y: keyframes.y[1],
				opacity: [0],
				scale: [1],
			},
			{ duration: 0 }
		);
		animate(
			bomb_element,
			{
				y: window.innerHeight * 2,
				"font-size": [
					(props.cell_size.width + props.cell_size.height) / 2 + "px",
				],
				opacity: [0],
				scale: [1],
			},
			{ duration: 0 }
		);
		const a = {
			stiffness: 1200,
			damping: 200,
			mass: 40,
		};
		setTimeout(() => {
			animate(
				point_element,
				{
					x: keyframes.x[0],
				},
				{
					x: {
						easing: spring(a),
					},
					opacity: {
						duration: 2,
					},
					scale: {
						duration: 2,
					},
				}
			);
			animate(
				bomb_element,
				{
					opacity: [1],
					x: keyframes.x[0],
				},
				{
					x: {
						easing: spring(a),
					},
				}
			);
		}, 0);
		setTimeout(() => {
			animate(
				point_element,
				{
					x: keyframes.x[1],
					opacity: [0, 0.2, 0.4, 0.7],
					scale: [3, 1],
				},
				{
					x: {
						easing: spring(a),
					},
					opacity: {
						duration: 2,
						easing: (() => {
							function easeOutBounce(x: number): number {
								const n1 = 7.5625;
								const d1 = 2.75;

								if (x < 1 / d1) {
									return n1 * x * x;
								} else if (x < 2 / d1) {
									return n1 * (x -= 1.5 / d1) * x + 0.75;
								} else if (x < 2.5 / d1) {
									return n1 * (x -= 2.25 / d1) * x + 0.9375;
								} else {
									return n1 * (x -= 2.625 / d1) * x + 0.984375;
								}
							}
							return easeOutBounce;
						})(),
					},
					scale: {
						duration: 2,
						easing: (() => {
							function easeOutBounce(x: number): number {
								const n1 = 7.5625;
								const d1 = 2.75;

								if (x < 1 / d1) {
									return n1 * x * x;
								} else if (x < 2 / d1) {
									return n1 * (x -= 1.5 / d1) * x + 0.75;
								} else if (x < 2.5 / d1) {
									return n1 * (x -= 2.25 / d1) * x + 0.9375;
								} else {
									return n1 * (x -= 2.625 / d1) * x + 0.984375;
								}
							}
							return easeOutBounce;
						})(),
					},
				}
			);
			animate(
				flash_element,
				{
					opacity: [0, 0.6],
				},
				{
					opacity: {
						duration: 3 + 7,
						easing: [0.1, 0, 1, 0],
					},
				}
			);
			animate(
				bomb_element,
				{
					x: [keyframes.x[0], keyframes.x[1]],
					y: [keyframes.y[1] - window.innerHeight, keyframes.y[1] - 10],
					scale: [1, 2],
					rotate: [0, 360, 360],
					filter: [
						"sepia(0) contrast(100%) saturate(100%)",
						"sepia(1) contrast(190%) saturate(450%)",
					],
				},
				{
					rotate: {
						easing: spring({
							stiffness: 100,
							damping: 8,
						}),
					},
					filter: {
						delay: 0.75,
						duration: 2.4 + 7,
						easing: (() => {
							function easeExplosion(x: number): number {
								return (
									Math.sin(x * x * Math.PI * 34) *
									Math.cos(x * x * Math.PI * 35) *
									Math.exp(-3 * (1 - x))
								);
							}

							return easeExplosion;
						})(),
					},
					scale: {
						delay: 0.75,
						duration: 2.4 + 7,
						easing: (() => {
							function easeExplosion(x: number): number {
								return (
									Math.sin(x * x * Math.PI * 34) *
									Math.cos(x * x * Math.PI * 35) *
									Math.exp(-3 * (1 - x))
								);
							}

							return easeExplosion;
						})(),
					},
					x: {
						easing: spring(a),
					},
					y: {
						easing: (() => {
							function easeOutBounce(x: number): number {
								const n1 = 7.5625;
								const d1 = 2.75;

								if (x < 1 / d1) {
									return n1 * x * x;
								} else if (x < 2 / d1) {
									return n1 * (x -= 1.5 / d1) * x + 0.75;
								} else if (x < 2.5 / d1) {
									return n1 * (x -= 2.25 / d1) * x + 0.9375;
								} else {
									return n1 * (x -= 2.625 / d1) * x + 0.984375;
								}
							}
							return easeOutBounce;
						})(),
					},
					duration: 2,
				}
			).finished.then(() => {
				animate(
					flash_element,
					{
						opacity: [1, 0],
					},
					{
						duration: 0.5,
					}
				);
				animate(
					bomb_element,
					{
						opacity: [1, 0],
						scale: [3],
						filter: ["sepia(1) contrast(200%) saturate(500%)"],
					},
					{
						duration: 0.2,
						easing: [0, 0.55, 0.45, 1],
					}
				);

				explosion(timeline_frames[1][1].x, timeline_frames[1][1].y);

				animate(
					point_element,
					{
						opacity: [1, 0],
						scale: [1, 0],
					},
					{
						duration: 0.2,
						easing: [0, 0.55, 0.45, 1],
					}
				);
			});
		}, 150);
	}

	const area = { w: 3, h: 3 }; // 5
	const array = [];
	for (let i = 0; i < area.w; i++) {
		array.push([]);
		for (let j = 0; j < area.h; j++) {
			array[i].push({
				i: i * props.cell_size.width,
				j: j * props.cell_size.height,
			});
		}
	}

	function explode_grid() {
		function index_to_coords(index: number) {
			return {
				x: index % grid.x,
				y: (index % grid.y) + 1,
			};
		}
	}
	// onb finished true, remove bomb
	createEffect(() => {
		if (finished()) {
			main.remove();
		}
	});

	function explosion(x: number, y: number) {
		explode_grid();
		// exp 1
		animate(
			shock_wave_main,
			{
				x: x - props.cell_size.width,
				y: y - props.cell_size.height,
				opacity: [0, 1],
			},
			{ duration: 0 }
		);
		animate(
			shock_waves,
			{
				opacity: [1],
				scale: [0, 1, 0],
				background: ["white", "orange", "orange", "red"],
			},
			{
				delay: (i) => {
					return (i % 2) * 0.1;
				},
			}
		).finished.then(() => {
			// setFinished(true);
		});

		grid_f.set_explosion_index_cross(grid_f.get_coordinates(hit_point_index()));
		// exp 2 cross
		animate(
			cross_shock_waves,
			{
				opacity: [1],
				scale: [0, 1, 1, 0],
				background: ["white", "orange", "orange", "red"],
			},
			{
				delay: (i) => {
					// from center
					return i * 0.025;
				},
				repeat: 2,
			}
		).finished.then(() => {
			setFinished(true);
		});
	}

	setTimeout(() => {}, 1000);

	function cross_func() {
		const array = [];
		// cross explosion
		let coords = grid_f.get_coordinates(hit_point_index());
		for (let i = 0; i < grid.x; i++) {
			array.push({
				i: i * props.cell_size.width,
				j: coords.x * props.cell_size.height + props.top_nav,
			});
		}
		for (let i = 0; i < grid.y; i++) {
			if (i !== coords.x) {
				array.push({
					i: coords.y * props.cell_size.width,
					j: i * props.cell_size.height + props.top_nav,
				});
			}
		}

		// arrange in a cross where first element is the center eg coords, next ones will be the closest to the center
		let array2 = array.sort((a, b) => {
			let a1 = Math.abs(a.i - coords.y * props.cell_size.width);
			let b1 = Math.abs(b.i - coords.y * props.cell_size.width);
			let a2 = Math.abs(a.j - coords.x * props.cell_size.height);
			let b2 = Math.abs(b.j - coords.x * props.cell_size.height);
			return a1 + a2 - (b1 + b2);
		});

		return array2;
	}

	return (
		<div ref={main}>
			<Motion.div
				ref={flash_element}
				class="flash pointer-events-none select-none"
				style={{
					position: "absolute",
					width: "100vw",
					height: "100vh",
					"z-index": 100,
					opacity: 0,
					background: "white",
				}}
			></Motion.div>

			<Motion.div
				ref={bomb_element}
				style={{
					width: props.cell_size.width + "px",
					height: props.cell_size.height + "px",
					"padding-bottom": "1%",
					opacity: 0,
				}}
				class={`absolute z-[51] flex select-none content-center items-end justify-center`}
			>
				<span
					class="wrapper pointer-events-none select-none"
					style={"line-height:100%"}
				>
					☢️
				</span>
			</Motion.div>

			<Motion.div
				ref={point_element}
				class={`selection-none pointer-events-none absolute z-[50]`}
				style={{
					width: props.cell_size.width + "px",
					height: props.cell_size.height + "px",
					"transform-origin": "bottom center",
					display: "flex",
					"justify-content": "center",
					"align-items": " flex-end",
				}}
			>
				<span
					style={{
						display: "block",
						width: props.cell_size.width * 0.7 + "px",
						height: props.cell_size.height / 4 + "px",
						background: "rgba(0,0,0,0.9)",
						"border-radius": "50%",
						"margin-bottom": "6%",
					}}
				></span>
			</Motion.div>

			<div class="cross_shock">
				<For each={cross()}>
					{(item) => (
						<div
							ref={(el) => {
								cross_shock_waves.push(el);
							}}
							class="cross_shock_wave selection-none pointer-events-none absolute"
							style={{
								"z-index": 100,
								opacity: 0,
								left: item.i + "px",
								top: item.j + "px",
								width: props.cell_size.width + "px",
								height: props.cell_size.height + "px",
								background: "red",
							}}
						></div>
					)}
				</For>
			</div>

			<div
				ref={shock_wave_main}
				class="shock_wave_main selection-none pointer-events-none absolute z-[100] opacity-0"
			>
				<For each={array}>
					{(row, i) => (
						<For each={row}>
							{(cell, j) => (
								<div
									ref={(el) => {
										shock_waves.push(el);
									}}
									class="shock_wave absolute"
									style={{
										"z-index": 100,
										left: cell.i + "px",
										top: cell.j + "px",
										width: props.cell_size.width + "px",
										height: props.cell_size.height + "px",
										background: "red",
									}}
								></div>
							)}
						</For>
					)}
				</For>
			</div>
		</div>
	);
}
