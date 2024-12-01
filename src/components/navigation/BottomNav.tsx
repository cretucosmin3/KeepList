import { Component } from "solid-js";
import { IoListOutline, IoAddCircleOutline, IoDuplicateOutline } from "solid-icons/io";
import { NavigationProps } from "../../types";
import { A } from "@solidjs/router";

const BottomNav: Component<NavigationProps> = (props) => {
	return (
		<nav class="bg-white border-t fixed bottom-0 w-full z-10">
			<div class="flex justify-around items-center h-20">
				<A href="/" class="flex flex-col items-center justify-center flex-1 h-full hover:bg-gray-100">
					<IoListOutline size={28} color="#2c4f7c" />
					<span class="text-xs mt-1">Lists</span>
				</A>
				<button
					class={`flex flex-col items-center justify-center flex-1 h-full 
            ${props.isGroupSelected ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
					onClick={props.onAddItem}
					disabled={!props.isGroupSelected}
				>
					<IoAddCircleOutline size={28} color="#2c4f7c" />
					<span class="text-xs mt-1">Add Item</span>
				</button>
			</div>
		</nav>
	);
};

export default BottomNav;
