/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { View, Action, NormalizedField } from '../../types';
import type { SetSelection } from '../../private-types';
import { LAYOUT_TABLE } from '../../constants';

type DataViewsFieldType = {
	id: string;
	label: string;
	index: number;
	isVisible: boolean;
	isHidable: boolean;
};

type DataViewsContextType< Item > = {
	view: View;
	onChangeView: ( view: View ) => void;
	fields: NormalizedField< Item >[];
	actions?: Action< Item >[];
	data: Item[];
	isLoading?: boolean;
	paginationInfo: {
		totalItems: number;
		totalPages: number;
	};
	selection: string[];
	onChangeSelection: SetSelection;
	openedFilter: string | null;
	setOpenedFilter: ( openedFilter: string | null ) => void;
	getItemId: ( item: Item ) => string;
	density: number;
	draggedSource: { index: number; id: string; isVisible: boolean } | null;
	setDraggedSource: React.Dispatch<
		React.SetStateAction< {
			index: number;
			id: string;
			isVisible: boolean;
		} | null >
	>;
	draggedTarget: { index: number; id: string; isVisible: boolean } | null;
	setDraggedTarget: React.Dispatch<
		React.SetStateAction< {
			index: number;
			id: string;
			isVisible: boolean;
		} | null >
	>;
	visibleFields: DataViewsFieldType[];
	setVisibleFields: React.Dispatch<
		React.SetStateAction< DataViewsFieldType[] >
	>;
	hiddenFields: DataViewsFieldType[];
	setHiddenFields: React.Dispatch<
		React.SetStateAction< DataViewsFieldType[] >
	>;
};

const DataViewsContext = createContext< DataViewsContextType< any > >( {
	view: { type: LAYOUT_TABLE },
	onChangeView: () => {},
	fields: [],
	data: [],
	paginationInfo: {
		totalItems: 0,
		totalPages: 0,
	},
	selection: [],
	onChangeSelection: () => {},
	setOpenedFilter: () => {},
	openedFilter: null,
	getItemId: ( item ) => item.id,
	density: 0,
	draggedSource: null,
	setDraggedSource: () => {},
	draggedTarget: null,
	setDraggedTarget: () => {},
	visibleFields: [],
	setVisibleFields: () => {},
	hiddenFields: [],
	setHiddenFields: () => {},
} );

export default DataViewsContext;
