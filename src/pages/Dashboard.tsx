import { Component, createSignal, Show } from "solid-js";
import { useList } from "../contexts/ListContext";
import { CreateListModal } from "../components/modals/CreateListModal";
import { ListCard } from "../components/list/ListCard";
import { IoAddOutline } from "solid-icons/io";
import ListItem from "../components/list/ListItem";

const Dashboard: Component = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);
    const [selectedListId, setSelectedListId] = createSignal<string | null>(null);
    const { lists, createList, updateList, deleteList, createItem, updateItem, deleteItem } = useList();

    const sortedLists = () => {
        return [...lists()].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    };

    const selectedList = () => {
        return lists().find(list => list.id === selectedListId());
    };

    const handleAddItem = () => {
        if (selectedListId()) {
            createItem(selectedListId()!, "");
        }
    };

    return (
        <div class="min-h-screen flex items-center justify-center overflow-hidden">
            <div class="max-w-7xl w-full h-[calc(100vh-2rem)] mx-auto page-transition-enter">
                <div class="h-full flex flex-row overflow-hidden px-2">
                    {/* Lists Section */}
                    <section class="w-[30rem] max-w-lg h-full p-4 flex flex-col">
                        <div class="flex justify-between items-center mb-2">
                            <h1 class="text-2xl pl-2">My Lists</h1>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                                aria-label="Create new list"
                            >
                                <IoAddOutline size={24} color="black" />
                            </button>
                        </div>

                        <div class="h-px bg-zinc-600 my-3"></div>

                        <div class="flex-1 overflow-y-auto scrollbar p-2">
                            <div class="flex flex-col gap-4">
                                {sortedLists().map((list) => (
                                    <ListCard
                                        list={list}
                                        isSelected={list.id === selectedListId()}
                                        onSelect={setSelectedListId}
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
                                setSelectedListId(newList.id);
                            }}
                        />
                    </section>

                    <div class="w-px bg-zinc-600 my-3"></div>

                    {/* Items Section */}
                    <section class="flex-1 h-full p-4 flex flex-col">
                        <Show when={selectedList()} fallback={
                            <div class="flex-1 flex items-center justify-center text-gray-500">
                                <p class="text-xl">Select a list to view its items</p>
                            </div>
                        }>
                            <div class="flex justify-between items-center mb-2">
                                <h2 class="text-2xl pl-2">{selectedList()?.name}</h2>
                                <button
                                    onClick={handleAddItem}
                                    class="p-2 rounded-full outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                                    aria-label="Add new item"
                                >
                                    <IoAddOutline size={24} color="black" />
                                </button>
                            </div>

                            <div class="h-px bg-zinc-600 my-3"></div>

                            <div class="flex-1 overflow-y-auto scrollbar right pr-4">
                                <div class="flex flex-col">
                                    {selectedList()?.items.map((item) => (
                                        <ListItem
                                            text={item.text}
                                            isCrossed={item.isCrossed}
                                            isEditing={item.text === ""}
                                            onRemove={() => deleteItem(selectedListId()!, item.id)}
                                            onEdit={() => updateItem(selectedListId()!, item.id, { isCrossed: !item.isCrossed })}
                                        />
                                    ))}

                                    {selectedList()?.items.length === 0 && (
                                        <div class="text-center py-12">
                                            <p class="text-2xl text-gray-900 mb-6">No items in this list 😔</p>
                                            <button 
                                                onClick={handleAddItem}
                                                class="px-4 py-2 text-lg rounded-sm text-zinc-800 outline outline-2 outline-zinc-700 hover:outline-4 hover:outline-zinc-900 transition-all"
                                            >
                                                Add your first item
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Show>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;