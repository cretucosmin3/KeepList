import { createSignal, onMount } from "solid-js";
import { List, Item } from "../types";
import { generateId } from "../utils/generateId";
import { getCurrentDate } from "../utils/dateUtils";

export const useLocalStorage = (): {
  lists: () => List[];
  createList: (name?: string) => List;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  createItem: (listId: string, text?: string) => Item | null;
  updateItem: (listId: string, itemId: string, updates: Partial<Item>) => void;
  deleteItem: (listId: string, itemId: string) => void;
} => {
  const [lists, setLists] = createSignal<List[]>([]);
  const STORAGE_KEY = 'lists';

  // Initialize lists from localStorage
  onMount(() => {
    const storedLists = localStorage.getItem(STORAGE_KEY);
    if (storedLists) {
      // Handle migration from old format to new format
      let parsedLists = JSON.parse(storedLists);
      
      // If we find old format lists (with groups), migrate them
      if (parsedLists.length > 0 && 'groups' in parsedLists[0]) {
        parsedLists = parsedLists.map((list: any) => ({
          id: list.id,
          name: list.name,
          date: list.date,
          items: list.groups.flatMap((group: any) => 
            group.items.map((item: any) => ({
              ...item,
              groupName: group.name // Optionally preserve group name as part of item
            }))
          )
        }));
      }
      
      setLists(parsedLists);
    }
  });

  // Persist lists to localStorage
  const persistLists = (updatedLists: List[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    setLists(updatedLists);
  };

  // List operations
  const createList = (name?: string): List => {
    const newList: List = {
      id: generateId(),
      name: name || getCurrentDate(),
      date: getCurrentDate(),
      items: []
    };
    
    persistLists([...lists(), newList]);
    return newList;
  };

  const updateList = (listId: string, updates: Partial<List>) => {
    const updatedLists = lists().map(list => 
      list.id === listId ? { ...list, ...updates } : list
    );
    persistLists(updatedLists);
  };

  const deleteList = (listId: string) => {
    persistLists(lists().filter(list => list.id !== listId));
  };

  // Item operations
  const createItem = (listId: string, text: string = ''): Item | null => {
    const newItem: Item = {
      id: generateId(),
      text,
      isCrossed: false
    };

    const updatedLists = lists().map(list => {
      if (list.id === listId) {
        return { ...list, items: [...list.items, newItem] };
      }
      return list;
    });

    persistLists(updatedLists);
    return newItem;
  };

  const updateItem = (
    listId: string,
    itemId: string,
    updates: Partial<Item>
  ) => {
    const updatedLists = lists().map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        return { ...list, items: updatedItems };
      }
      return list;
    });
    persistLists(updatedLists);
  };

  const deleteItem = (listId: string, itemId: string) => {
    const updatedLists = lists().map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId)
        };
      }
      return list;
    });
    persistLists(updatedLists);
  };

  return {
    lists,
    createList,
    updateList,
    deleteList,
    createItem,
    updateItem,
    deleteItem
  };
};