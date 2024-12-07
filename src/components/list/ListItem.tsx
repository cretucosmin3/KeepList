import { Component, createSignal, JSX } from "solid-js";
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
  const randoRot = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const getRandomRotation = (min: number, max: number) => Math.random() * (max - min) + min;

  // Create signals for random rotations
  const [rotationAfter, setRotationAfter] = createSignal(getRandomRotation(-15, 15));
  const [rotationBefore, setRotationBefore] = createSignal(getRandomRotation(-15, 15));

  return (
    <div class="flex justify-between w-full px-2 py-3 hover:bg-zinc-200 group rounded-md cursor-pointer" onClick={props.onEdit}>
      {/* Drag handle container */}
      <div class="text-zinc-400 hover:text-zinc-600">{props.dragHandle}</div>

      <div class="flex gap-3 flex-1 select-none items-center">
        {props.isCrossed ? (
          <span class="text-3xl leading-none font-bold text-green-700 pl-4">✓</span>
        ) : (
          <span class="text-3xl leading-none font-bold text-zinc-700">○</span>
        )}
        {/* {props.isCrossed ? <IoEllipse size={20} /> : <IoEllipseOutline size={20} />} */}
        <span
          class={`text-lg leading-none ${props.isCrossed && "strike-through"}`}
          style={{
            "--random-rotation-after": `${rotationAfter()}deg`,
            "--random-rotation-before": `${rotationBefore()}deg`,
          }}
        >
          {props.text || "New Item"}
        </span>
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
