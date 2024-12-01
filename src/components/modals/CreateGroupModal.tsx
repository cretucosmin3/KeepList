import { Component, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { IoCloseOutline } from "solid-icons/io";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export const CreateGroupModal: Component<CreateGroupModalProps> = (props) => {
  let inputRef: HTMLInputElement | undefined;
  const [name, setName] = createSignal("");
  
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (name().trim()) {
      props.onConfirm(name().trim());
      setName(""); // Reset name for next time
      props.onClose();
    }
  };

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
              class="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <IoCloseOutline size={24} />
            </button>
            
            <h2 class="text-xl mb-4">Create New Group</h2>
            
            <form onSubmit={handleSubmit} class="space-y-4">
              <div>
                <label for="groupName" class="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  placeholder="Enter group name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ref={inputRef}
                  autofocus={true}
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
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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