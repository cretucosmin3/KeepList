import { createContext, useContext, ParentComponent } from "solid-js";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Item, List } from "../types";

// Define the shape of our context
interface ListContextValue {
  lists: () => List[];
  createList: (name?: string) => List;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  createItem: (listId: string, text?: string) => Item | null;
  updateItem: (listId: string, itemId: string, updates: Partial<Item>) => void;
  deleteItem: (listId: string, itemId: string) => void;
}

// Create the context with an initial undefined value
const ListContext = createContext<ListContextValue>();

// Create the provider component
export const ListProvider: ParentComponent = (props) => {
  const storage = useLocalStorage();
  
  return (
    <ListContext.Provider value={storage}>
      {props.children}
    </ListContext.Provider>
  );
};

// Create the hook with type checking
export const useList = (): ListContextValue => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
};