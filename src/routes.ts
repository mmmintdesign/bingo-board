import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./pages/home";

export const routes: RouteDefinition[] = [
	{
		path: "/",
		component: Home,
	},
	{
		path: "/simple",
		component: lazy(() => import("./pages/simple")),
	},
	{
		path: "**",
		component: lazy(() => import("./errors/404")),
	},
];
