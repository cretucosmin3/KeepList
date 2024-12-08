import { Component, createSignal, onCleanup, Show, onMount } from "solid-js";
import { IoAddCircleOutline } from "solid-icons/io";
import { getFunnySuggestion } from "../utils/getFunnySuggestion";

interface ListCardProps {
  onAdd: (text: string) => void;
}

export const AddItemWidget: Component<ListCardProps> = (props) => {
  const [isInputVisible, setInputVisible] = createSignal(false);
  const [itemText, setItemText] = createSignal("");
  const [funnySuggestion, setFunnySuggestion] = createSignal(getFunnySuggestion());

  let typingInput: HTMLInputElement | undefined;
  let showInputButton: HTMLButtonElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  const focusInput = () => {
    setTimeout(() => {
      if (typingInput) {
        typingInput.focus();

        // Scroll the container into view
        containerRef?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // On mobile, this helps ensure the input is visible above the keyboard
        window.scrollTo({
          top: window.scrollY + window.innerHeight * 0.3,
          behavior: "smooth",
        });
      }
    }, 0);
  };

  const handleAddItem = (hideInput: boolean = true) => {
    setFunnySuggestion(getFunnySuggestion());
    props.onAdd(itemText());
    setItemText("");

    if (hideInput) {
      setInputVisible(false);
    } else {
      focusInput();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    const clickedOutsideInput = typingInput && !typingInput.contains(target);
    const clickedOutsideButton = showInputButton && !showInputButton.contains(target);

    if (isInputVisible() && clickedOutsideInput && clickedOutsideButton) {
      handleBlur();
    }
  };

  const handleAddPressed = (e: MouseEvent) => {
    setInputVisible(true);
    typingInput?.focus();
  };

  const onInputKeyPress = (e: KeyboardEvent) => {
    e.key === "Enter" && itemText().length > 0 && handleAddItem(false);
  };

  const handleBlur = () => {
    setItemText("");
    setInputVisible(false);
    setFunnySuggestion(getFunnySuggestion());
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return (
    <div ref={containerRef} class="flex justify-center items-center mt-2">
      <Show when={!isInputVisible()}>
        <button ref={showInputButton} onClick={handleAddPressed} class="p-3 rounded-full hover:bg-gray-300">
          <IoAddCircleOutline size={42} color="green" />
        </button>
      </Show>

      <Show when={isInputVisible()}>
        <input
          ref={typingInput}
          class="p-4 w-full rounded text-center text-pretty bg-transparent focus:outline-none"
          type="text"
          value={itemText()}
          placeholder={funnySuggestion()}
          onInput={(e) => setItemText(e.currentTarget.value)}
          onKeyPress={onInputKeyPress}
          onBlur={handleBlur}
          autofocus
        />
      </Show>
    </div>
  );
};
