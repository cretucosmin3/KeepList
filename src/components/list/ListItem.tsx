import { Component, JSX } from "solid-js";
import { IoCheckmark, IoRemove, IoCloseOutline } from "solid-icons/io";

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
    <div class="flex justify-between w-full px-2 py-3 hover:bg-zinc-200 group rounded-md cursor-pointer" onClick={props.onEdit}>
      {/* Drag handle container */}
      <div class="text-zinc-400 hover:text-zinc-600">{props.dragHandle}</div>

      <div class="flex gap-3 flex-1 select-none items-center">
        {props.isCrossed ? (
          <span class="text-3xl leading-none font-bold text-green-700 pl-4"><IoCheckmark size={30}/></span>
        ) : (
          <span class="text-3xl leading-none font-bold text-zinc-700">○</span>
        )}
        {/* {props.isCrossed ? <IoEllipse size={20} /> : <IoEllipseOutline size={20} />} */}
        <span class={`text-lg leading-none ${props.isCrossed && "line-through"}`}>{props.text || "Some example text"}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          props.onRemove();
        }}
        class="text-gray-400 rounded-full opacity-0 hover:bg-zinc-100 group-hover:opacity-100"
        aria-label="Remove item"
      >
        <IoCloseOutline size={30} color="red" />
      </button>
    </div>
  );
};

export default ListItem;
