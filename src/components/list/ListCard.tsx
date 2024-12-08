import { Component, createSignal, onCleanup, Show } from "solid-js";
import { IoEllipsisVertical, IoChevronUpOutline } from "solid-icons/io";
import { List } from "../../types";

interface ListCardProps {
  list: List;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export const ListCard: Component<ListCardProps> = (props) => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [newName, setNewName] = createSignal(props.list.name);

  let menuRenameRef: HTMLInputElement | undefined;
  let menuButtonRef: HTMLButtonElement | undefined;
  let menuRef: HTMLDivElement | undefined;

  const handleRename = () => {
    if (newName().trim() !== props.list.name) {
      props.onRename(props.list.id, newName());
    }
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTotalItems = () => {
    return props.list.items.length;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isMenuOpen() && menuButtonRef && menuRef && !menuButtonRef.contains(event.target as Node) && !menuRef.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  const handleScroll = () => {
    if (isMenuOpen()) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  document.addEventListener("scroll", handleScroll);

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("scroll", handleScroll);
  });

  return (
    <div
      class={`select-none overflow-hidden bg-white rounded-lg border-2 border-zinc-300
        ${
          props.isSelected ? "outline -outline-offset-4 outline-4 outline-zinc-700" : isEditing() ? "" : "hover:bg-zinc-50 hover:border-zinc-500 cursor-pointer"
        } 
        relative ${isMenuOpen() ? "z-10" : ""}`}
      onClick={() => !isEditing() && props.onSelect(props.list.id)}
    >
      {/* Options Button */}
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        <div class="relative">
          <button
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen());
            }}
            class="p-2 rounded-full hover:bg-gray-300"
            aria-label="List options"
          >
            <IoChevronUpOutline class={`${isMenuOpen() ? "" : "hidden"}`} size={24} />
            <IoEllipsisVertical class={`${isMenuOpen() ? "hidden" : ""}`} size={24} />
          </button>
        </div>
      </div>

      {isEditing() ? (
        <div class="m-2">
          <input
            ref={menuRenameRef}
            type="text"
            value={newName()}
            onInput={(e) => setNewName(e.currentTarget.value)}
            onKeyPress={(e) => e.key === "Enter" && handleRename()}
            onBlur={handleRename}
            class="px-2 py-4 w-[89%] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-800"
            autofocus
          />
        </div>
      ) : (
        <div class="block p-4">
          <span class="flex flex-row gap-2 align-middle text-center pb-2 pt-1">
            <p class="text-md text-zinc-800">{formatDate(props.list.date)}</p>
            <div class="border-l-2 mx-2 border-gray-300"></div>
            <p class="text-md text-rose-700">
              {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
            </p>
          </span>

          <h3 class="text-xl font-medium pr-8">{props.list.name}</h3>
        </div>
      )}

      <Show when={isMenuOpen()}>
        <div class="h-px bg-zinc-300 mt-2"></div>
        <div ref={menuRef} class="grid grid-cols-2 w-full bg-zinc-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setIsMenuOpen(false);
              menuRenameRef?.focus();
            }}
            class="text-center text-zinc-800 h-full py-4 hover:bg-gray-200"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.onDelete(props.list.id);
            }}
            class="text-center text-red-700 h-full py-4 hover:bg-gray-200"
          >
            Delete
          </button>
        </div>
      </Show>
    </div>
  );
};
