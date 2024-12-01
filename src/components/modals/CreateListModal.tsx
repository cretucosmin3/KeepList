import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { IoCloseOutline } from "solid-icons/io";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const CreateListModal: Component<CreateListModalProps> = (props) => {
  let inputRef: HTMLInputElement | undefined;
  const [name, setName] = createSignal(new Date().toLocaleDateString());
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (name().trim()) {
      props.onConfirm(name());
      setName(new Date().toLocaleDateString()); // Reset name for next time
      props.onClose();
    }
  };

  inputRef?.focus();

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) props.onClose();
          }}
        >
          <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={props.onClose}
              class="absolute right-4 top-4 p-3 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <IoCloseOutline size={28} />
            </button>
            
            <h2 class="text-xl mb-4">Create New List</h2>
            
            <form onSubmit={handleSubmit} class="space-y-8">
              <div>
                <label for="listName" class="block text-lg text-gray-700 mb-1">
                  List Name
                </label>
                <input
                  id="listName"
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-700"
                  ref={inputRef}
                  autofocus
                />
              </div>
              
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={props.onClose}
                  class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 text-zinc-900 outline outline-2 border-zinc-700 rounded-md hover:border-zinc-950 hover:outline-4 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Portal>
    </Show>
  );
};