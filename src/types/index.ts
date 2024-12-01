export interface Item {
	id: string;
	text: string;
	isCrossed: boolean;
}

export interface List {
	id: string;
	name: string;
	date: string;
	items: Item[];
}

export interface NavigationProps {
	onAddItem?: () => void;
}
