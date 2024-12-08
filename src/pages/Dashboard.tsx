import { Component, createSignal, For, Show } from "solid-js";
import { useList } from "../contexts/ListContext";
import { CreateListModal } from "../components/modals/CreateListModal";
import { ListCard } from "../components/list/ListCard";
import { IoAddOutline, IoCopyOutline, IoOptionsOutline, IoArrowBackOutline } from "solid-icons/io";
import ListItem from "../components/list/ListItem";
import { AddItemWidget } from "../components/list/AddItemWidget";

const Dashboard: Component = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);
  const [selectedListId, setSelectedListId] = createSignal<string | null>(null);
  const [displayMobileLists, setDisplayMobileLists] = createSignal<boolean>(true);
  const { lists, createList, updateList, deleteList, createItem, updateItem, deleteItem } = useList();

  let itemsListContainer: HTMLDivElement | undefined;

  const sortedLists = () => {
    return [...lists()].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const selectedList = () => {
    return lists().find((list) => list.id === selectedListId());
  };

  const scrollToLastItem = () => {
    setTimeout(() => {
      if (itemsListContainer) {
        itemsListContainer.scrollTop = itemsListContainer.scrollHeight;
      }
    }, 100);
  };

  const handleAddItem = (itemText: string) => {
    if (selectedListId()) {
      createItem(selectedListId()!, itemText);
      scrollToLastItem();
    }
  };

  const handleSelectList = (listId: string | null) => {
    setSelectedListId(listId);
    setDisplayMobileLists(false);
  };

  return (
    <div class="min-h-screen flex items-center justify-center overflow-hidden">
      <div class="max-w-7xl w-full h-[calc(100vh)] mx-auto page-transition-enter relative">
        <div class="h-full flex flex-row overflow-hidden px-2">
          {/* Lists section */}
          <section class={`md:w-[30rem] md:max-w-lg h-full p-4 flex flex-col mobile-list-panel ${displayMobileLists() ? "show-panel" : ""}`}>
            {/* Title and actions */}
            <div class="flex justify-between items-center mb-2">
              {/* TODO: Options button */}
              <span class="flex justify-between items-center gap-2">
                <button
                  class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                  aria-label="Create new list"
                >
                  <IoOptionsOutline size={24} color="black" />
                </button>
                <h1 class="text-2xl pl-2">My Lists</h1>
              </span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                aria-label="Create new list"
              >
                <IoAddOutline size={24} color="black" />
              </button>
            </div>

            {/* Just a spacer */}
            <div class="h-px bg-zinc-600 my-3"></div>

            {/* The lists */}
            <div class="flex-1 overflow-y-auto scrollbar p-2 pl-4">
              <div class="flex flex-col gap-4">
                {sortedLists().map((list) => (
                  <ListCard
                    list={list}
                    isSelected={list.id === selectedListId()}
                    onSelect={handleSelectList}
                    onRename={(id, newName) => updateList(id, { name: newName })}
                    onDelete={(id) => {
                      deleteList(id);
                      if (selectedListId() === id) {
                        setSelectedListId(null);
                      }
                    }}
                  />
                ))}

                {lists().length === 0 && (
                  <div class="text-center py-12">
                    <p class="text-gray-500 mb-4 text-2xl">No lists yet!</p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      class="px-4 py-2 rounded-sm text-zinc-800 outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                    >
                      Create your first list
                    </button>
                  </div>
                )}
              </div>
            </div>

            <CreateListModal
              isOpen={isCreateModalOpen()}
              onClose={() => setIsCreateModalOpen(false)}
              onConfirm={(name) => {
                const newList = createList(name);
                handleSelectList(newList.id);
              }}
            />
          </section>

          <div class="w-px bg-zinc-600 my-3 max-md:hidden"></div>

          {/* Items Section */}
          <section class="flex-1 h-full p-4 flex flex-col">
            <Show
              when={selectedList()}
              fallback={
                <div class="flex-1 flex items-center justify-center text-gray-600">
                  <p class="text-xl">Select or create a list first 🤔</p>
                </div>
              }
            >
              <div class="flex justify-between items-center mb-2">
                <button
                  onClick={() => setDisplayMobileLists(true)}
                  class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all md:hidden"
                  aria-label="Create new list"
                >
                  <IoArrowBackOutline size={24} color="black" />
                </button>
                <h2 class="text-xl pl-2 max-md:px-2 max-md:line-clamp-1">{selectedList()?.name}</h2>
                <button
                  class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                  aria-label="Add new item"
                >
                  <IoCopyOutline size={24} color="black" />
                </button>
              </div>

              <div class="h-px bg-zinc-600 my-3"></div>

              <div ref={itemsListContainer} class="overflow-y-auto scrollbar right pr-4">
                <div class="flex flex-col">
                  <For each={selectedList()?.items}>
                    {(item, index) => (
                      <ListItem
                        text={item.text}
                        isCrossed={item.isCrossed}
                        isEditing={item.text === ""}
                        onRemove={() => deleteItem(selectedListId()!, item.id)}
                        onEdit={() => updateItem(selectedListId()!, item.id, { isCrossed: !item.isCrossed })}
                      />
                    )}
                  </For>

                  {selectedList()?.items.length === 0 && (
                    <div class="text-center mt-12">
                      <p class="text-2xl text-gray-600 mb-4">Sadly, no items here 😔</p>
                    </div>
                  )}
                </div>
              </div>
              {selectedList()?.items && <AddItemWidget onAdd={handleAddItem} />}
            </Show>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
