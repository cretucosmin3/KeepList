import type { Component } from "solid-js";
import { ListProvider } from "./contexts/ListContext";

const App: Component = (props: any) => {
	return (
		<ListProvider>
			<div class="bg-zinc-100 min-h-screen">{props.children}</div>
		</ListProvider>
	);
};

export default App;
