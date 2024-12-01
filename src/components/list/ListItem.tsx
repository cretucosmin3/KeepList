import { Component, JSX } from "solid-js";
import { IoEllipse, IoEllipseOutline, IoGridSharp, IoCloseOutline } from "solid-icons/io";

interface ListItemProps {
	text: string;
	isCrossed: boolean;
	isEditing: boolean;
	onRemove: () => void;
	onEdit: () => void;
	dragHandle?: JSX.Element;
}

const ListItem: Component<ListItemProps> = (props) => {
	return (
		<div class="flex items-center justify-between w-full px-2 py-4 hover:bg-zinc-200 group rounded-md">
			{/* Drag handle container */}
			<div class="text-zinc-400 hover:text-zinc-600">{props.dragHandle}</div>

			<div class="flex items-center gap-3 flex-1" onClick={props.onEdit}>
				{props.isCrossed ? <IoEllipse size={20} /> : <IoEllipseOutline size={20} />}
				<span class={`text-lg ${props.isCrossed ? "line-through text-gray-400" : "text-gray-900"}`}>{props.text || "New Item"}</span>
			</div>

			<button
				onClick={(e) => {
					e.stopPropagation();
					props.onRemove();
				}}
				class="text-gray-400 rounded-full opacity-0 group-hover:opacity-100"
				aria-label="Remove item"
			>
				<IoCloseOutline size={30} color="red" />
			</button>
		</div>
	);
};

export default ListItem;
