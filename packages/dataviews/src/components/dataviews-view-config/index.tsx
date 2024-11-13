/**
 * External dependencies
 */
import type { ChangeEvent } from 'react';
/**
 * WordPress dependencies
 */
import {
	useEffect,
	useRef,
	memo,
	useContext,
	useMemo,
} from '@wordpress/element';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	Dropdown,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	SelectControl,
	__experimentalItemGroup as ItemGroup,
	__experimentalItem as Item,
	__experimentalGrid as Grid,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	privateApis as componentsPrivateApis,
	BaseControl,
} from '@wordpress/components';
import { __, _x, sprintf } from '@wordpress/i18n';
import { dragHandle, cog, seen, unseen } from '@wordpress/icons';
import warning from '@wordpress/warning';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	SORTING_DIRECTIONS,
	LAYOUT_GRID,
	LAYOUT_TABLE,
	sortIcons,
	sortLabels,
} from '../../constants';
import {
	VIEW_LAYOUTS,
	getNotHidableFieldIds,
	getVisibleFieldIds,
	getHiddenFieldIds,
} from '../../dataviews-layouts';
import { type SupportedLayouts, type View, type Field } from '../../types';
import DataViewsContext from '../dataviews-context';
import { unlock } from '../../lock-unlock';
import DensityPicker from '../../dataviews-layouts/grid/density-picker';

const { Menu } = unlock( componentsPrivateApis );

interface ViewTypeMenuProps {
	defaultLayouts?: SupportedLayouts;
}

const DATAVIEWS_CONFIG_POPOVER_PROPS = { placement: 'bottom-end', offset: 9 };

function ViewTypeMenu( {
	defaultLayouts = { list: {}, grid: {}, table: {} },
}: ViewTypeMenuProps ) {
	const { view, onChangeView } = useContext( DataViewsContext );
	const availableLayouts = Object.keys( defaultLayouts );
	if ( availableLayouts.length <= 1 ) {
		return null;
	}
	const activeView = VIEW_LAYOUTS.find( ( v ) => view.type === v.type );
	return (
		<Menu
			trigger={
				<Button
					size="compact"
					icon={ activeView?.icon }
					label={ __( 'Layout' ) }
				/>
			}
		>
			{ availableLayouts.map( ( layout ) => {
				const config = VIEW_LAYOUTS.find( ( v ) => v.type === layout );
				if ( ! config ) {
					return null;
				}
				return (
					<Menu.RadioItem
						key={ layout }
						value={ layout }
						name="view-actions-available-view"
						checked={ layout === view.type }
						hideOnClick
						onChange={ ( e: ChangeEvent< HTMLInputElement > ) => {
							switch ( e.target.value ) {
								case 'list':
								case 'grid':
								case 'table':
									return onChangeView( {
										...view,
										type: e.target.value,
										...defaultLayouts[ e.target.value ],
									} );
							}
							warning( 'Invalid dataview' );
						} }
					>
						<Menu.ItemLabel>{ config.label }</Menu.ItemLabel>
					</Menu.RadioItem>
				);
			} ) }
		</Menu>
	);
}

function SortFieldControl() {
	const { view, fields, onChangeView } = useContext( DataViewsContext );
	const orderOptions = useMemo( () => {
		const sortableFields = fields.filter(
			( field ) => field.enableSorting !== false
		);
		return sortableFields.map( ( field ) => {
			return {
				label: field.label,
				value: field.id,
			};
		} );
	}, [ fields ] );

	return (
		<SelectControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Sort by' ) }
			value={ view.sort?.field }
			options={ orderOptions }
			onChange={ ( value: string ) => {
				onChangeView( {
					...view,
					sort: {
						direction: view?.sort?.direction || 'desc',
						field: value,
					},
				} );
			} }
		/>
	);
}

function SortDirectionControl() {
	const { view, fields, onChangeView } = useContext( DataViewsContext );

	const sortableFields = fields.filter(
		( field ) => field.enableSorting !== false
	);
	if ( sortableFields.length === 0 ) {
		return null;
	}

	let value = view.sort?.direction;
	if ( ! value && view.sort?.field ) {
		value = 'desc';
	}
	return (
		<ToggleGroupControl
			className="dataviews-view-config__sort-direction"
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			isBlock
			label={ __( 'Order' ) }
			value={ value }
			onChange={ ( newDirection ) => {
				if ( newDirection === 'asc' || newDirection === 'desc' ) {
					onChangeView( {
						...view,
						sort: {
							direction: newDirection,
							field:
								view.sort?.field ||
								// If there is no field assigned as the sorting field assign the first sortable field.
								fields.find(
									( field ) => field.enableSorting !== false
								)?.id ||
								'',
						},
					} );
					return;
				}
				warning( 'Invalid direction' );
			} }
		>
			{ SORTING_DIRECTIONS.map( ( direction ) => {
				return (
					<ToggleGroupControlOptionIcon
						key={ direction }
						value={ direction }
						icon={ sortIcons[ direction ] }
						label={ sortLabels[ direction ] }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
}

const PAGE_SIZE_VALUES = [ 10, 20, 50, 100 ];
function ItemsPerPageControl() {
	const { view, onChangeView } = useContext( DataViewsContext );
	return (
		<ToggleGroupControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			isBlock
			label={ __( 'Items per page' ) }
			value={ view.perPage || 10 }
			disabled={ ! view?.sort?.field }
			onChange={ ( newItemsPerPage ) => {
				const newItemsPerPageNumber =
					typeof newItemsPerPage === 'number' ||
					newItemsPerPage === undefined
						? newItemsPerPage
						: parseInt( newItemsPerPage, 10 );
				onChangeView( {
					...view,
					perPage: newItemsPerPageNumber,
					page: 1,
				} );
			} }
		>
			{ PAGE_SIZE_VALUES.map( ( value ) => {
				return (
					<ToggleGroupControlOption
						key={ value }
						value={ value }
						label={ value.toString() }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
}

interface FieldItemProps {
	id: any;
	label: string;
	index: number;
	isVisible: boolean;
	isHidable: boolean;
}

function FieldItem( {
	field: { id, label, index, isVisible, isHidable },
	fields,
	view,
	onChangeView,
	onDragStart,
	onDragOver,
	onDrop,
}: {
	field: FieldItemProps;
	fields: Field< any >[];
	view: View;
	onChangeView: ( view: View ) => void;
	onDragStart: ( view: number, id: string, isVisible: boolean ) => void;
	onDragOver: ( view: number, id: string, isVisible: boolean ) => void;
	onDrop: () => void;
} ) {
	const visibleFieldIds = getVisibleFieldIds( view, fields );
	const rowRef = useRef( null );

	const handleDragStart = ( e: React.DragEvent ) => {
		if ( onDragStart ) {
			e.stopPropagation();
			onDragStart( index, id, isVisible ); // Pass index to the parent for managing drag state
			if ( rowRef.current ) {
				// Set the current element as the drag image
				const dragImage = rowRef.current;
				e.dataTransfer.setDragImage( dragImage, 25, 50 );
			}
		}
	};

	// Handle drag over event.
	const handleDragOver = ( e: React.DragEvent ) => {
		e.preventDefault(); // This is important for allowing the drop
		if ( onDragOver ) {
			onDragOver( index, id, isVisible ); // Notify the parent when a field is dragged over
		}
	};

	return (
		<Item
			key={ id }
			ref={ rowRef }
			className="dataviews-field-control__draggable-item"
			onDrop={ onDrop }
			onDragStart={ handleDragStart }
			onDragOver={ handleDragOver }
		>
			<HStack
				expanded
				className={ `dataviews-field-control__field dataviews-field-control__field-${ id }` }
			>
				{ view.type === LAYOUT_TABLE && (
					<Button
						draggable={ view.type === LAYOUT_TABLE } // Make it draggable only when the field is visible
						accessibleWhenDisabled
						size="compact"
						variant="tertiary"
						className="dataviews-field-control__draggable-icon"
						icon={ dragHandle }
						label={ sprintf(
							/* translators: %s: field label */
							__( 'Drag %s' ),
							label
						) }
					/>
				) }

				<span>{ label }</span>
				<HStack
					justify="flex-end"
					expanded={ false }
					className={
						view.type !== LAYOUT_TABLE
							? 'dataviews-field-control__actions'
							: ''
					}
				>
					<Button
						className="dataviews-field-control__field-visibility-button"
						disabled={ ! isHidable }
						accessibleWhenDisabled
						size="compact"
						onClick={ () => {
							onChangeView( {
								...view,
								fields: isVisible
									? visibleFieldIds.filter(
											( fieldId ) => fieldId !== id
									  )
									: [ ...visibleFieldIds, id ],
							} );
							// Focus the visibility button to avoid focus loss.
							// Our code is safe against the component being unmounted, so we don't need to worry about cleaning the timeout.
							// eslint-disable-next-line @wordpress/react-no-unsafe-timeout
							setTimeout( () => {
								const element = document.querySelector(
									`.dataviews-field-control__field-${ id } .dataviews-field-control__field-visibility-button`
								);
								if ( element instanceof HTMLElement ) {
									element.focus();
								}
							}, 50 );
						} }
						icon={ isVisible ? seen : unseen }
						label={
							isVisible
								? sprintf(
										/* translators: %s: field label */
										_x( 'Hide %s', 'field' ),
										label
								  )
								: sprintf(
										/* translators: %s: field label */
										_x( 'Show %s', 'field' ),
										label
								  )
						}
					/>
				</HStack>
			</HStack>
		</Item>
	);
}

function FieldControl() {
	const {
		view,
		fields,
		onChangeView,
		draggedSource,
		setDraggedSource,
		draggedTarget,
		setDraggedTarget,
		visibleFields,
		setVisibleFields,
		hiddenFields,
		setHiddenFields,
	} = useContext( DataViewsContext );

	const visibleFieldIds = useMemo(
		() => getVisibleFieldIds( view, fields ),
		[ view, fields ]
	);
	const hiddenFieldIds = useMemo(
		() => getHiddenFieldIds( view, fields ),
		[ view, fields ]
	);
	const notHidableFieldIds = useMemo(
		() => getNotHidableFieldIds( view ),
		[ view ]
	);

	useEffect( () => {
		setVisibleFields(
			fields
				.filter( ( { id } ) => visibleFieldIds.includes( id ) )
				.map( ( { id, label, enableHiding } ) => {
					return {
						id,
						label,
						index: visibleFieldIds.indexOf( id ),
						isVisible: true,
						isHidable: notHidableFieldIds.includes( id )
							? false
							: enableHiding,
					};
				} )
		);
	}, [ fields, visibleFieldIds, setVisibleFields, notHidableFieldIds ] );

	useEffect( () => {
		setHiddenFields( ( prev ) => {
			const newIds = prev.filter(
				( e ) => ! visibleFieldIds.includes( e.id )
			);

			// Add missing fields to newIds
			hiddenFieldIds.forEach( ( id ) => {
				// Check if the ID already exists in newIds
				const findIfNotExists = newIds.find( ( e ) => e.id === id );

				if ( ! findIfNotExists ) {
					// Find the item in fields that matches the missing ID
					const item = fields.find( ( e ) => e.id === id );

					if ( ! item ) {
						return; // Skip if the item isn't found in fields
					}

					// Add the missing item to newIds with proper properties
					newIds.push( {
						id,
						label: item.label,
						index: newIds.length, // Set unique index based on current length of newIds
						isVisible: false,
						isHidable: item.enableHiding,
					} );
				}
			} );

			return newIds;
		} );
	}, [ fields, hiddenFieldIds, setHiddenFields, visibleFieldIds ] );

	const handleDragStart = ( index: number, id: string, isVisible: boolean ) =>
		setDraggedSource( {
			index,
			id,
			isVisible,
		} );

	const handleDragOver = (
		index: number,
		id: string,
		isVisible: boolean
	) => {
		setDraggedTarget( {
			index,
			id,
			isVisible,
		} );
	};

	const handleDrop = () => {
		if ( ! draggedSource || ! draggedTarget ) {
			return;
		}

		// Check if moving to same position as current index then do nothing.
		if (
			draggedSource.index === draggedTarget.index &&
			draggedSource.isVisible === draggedTarget.isVisible
		) {
			return;
		}

		// If same table switch is happening then.
		if (
			draggedSource.isVisible === draggedTarget.isVisible &&
			! draggedSource.isVisible
		) {
			setHiddenFields( ( prevFields ) => {
				// Create a copy of the array to avoid mutating state directly
				const updatedFields = [ ...prevFields ];

				// Remove the element from its original position
				const [ element ] = updatedFields.splice(
					draggedSource.index,
					1
				);

				// Insert the element at the target index
				updatedFields.splice( draggedTarget.index, 0, element );

				// Update indices to reflect the new order
				const reorderedFields = updatedFields.map(
					( field, index ) => ( {
						...field,
						index, // Assign new index based on position
					} )
				);

				return reorderedFields;
			} );
		}

		if (
			draggedSource.isVisible === draggedTarget.isVisible &&
			draggedSource.isVisible
		) {
			const updatedFields = [ ...visibleFields ];
			const [ element ] = updatedFields.splice( draggedSource.index, 1 );
			updatedFields.splice( draggedTarget.index, 0, element );
			// Update the view with new visible field order
			onChangeView( {
				...view,
				fields: updatedFields.map( ( field ) => field.id ),
			} );
		}

		// dont allow toggling and exit.
		if ( notHidableFieldIds.includes( draggedSource.id ) ) {
			setDraggedSource( null );
			setDraggedTarget( null );
			return;
		}

		// Move from 'hidden' to 'visible'
		if ( ! draggedSource.isVisible && draggedTarget.isVisible ) {
			// Update hidden fields
			setHiddenFields( ( prevFields ) => {
				const updatedFields = [ ...prevFields ];
				// Remove the element from hidden fields
				updatedFields.splice( draggedSource.index, 1 );

				// Update the indices in hidden fields
				const reorderedHiddenFields = updatedFields.map(
					( field, index ) => ( {
						...field,
						index,
					} )
				);

				return reorderedHiddenFields;
			} );

			// Update visible fields by adding the dragged item
			const updatedVisibleFields = [ ...visibleFields ];
			const item = hiddenFields[ draggedSource.index ];

			// Insert into visible fields at the target index
			updatedVisibleFields.splice( draggedTarget.index, 0, {
				...item,
				index: draggedTarget.index,
			} );

			// Update the view with the new visible field order
			onChangeView( {
				...view,
				fields: updatedVisibleFields.map( ( field ) => field.id ),
			} );
		}

		// Move from 'visible' to 'hidden'
		if ( draggedSource.isVisible && ! draggedTarget.isVisible ) {
			// Update visible fields
			const updatedVisibleFields = [ ...visibleFields ];
			const [ element ] = updatedVisibleFields.splice(
				draggedSource.index,
				1
			);

			// Update indexes in visible fields
			const reorderedVisibleFields = updatedVisibleFields.map(
				( field, index ) => ( {
					...field,
					index,
				} )
			);

			onChangeView( {
				...view,
				fields: reorderedVisibleFields.map( ( field ) => field.id ),
			} );

			// Update hidden fields by adding the dragged item
			setHiddenFields( ( prevFields ) => {
				const updatedHiddenFields = [ ...prevFields ];

				// Insert the item from visible fields into hidden fields at the target index
				updatedHiddenFields.splice( draggedTarget.index, 0, {
					...element,
					index: draggedTarget.index,
					isVisible: false,
				} );

				// Update indices in hidden fields
				const reorderedHiddenFields = updatedHiddenFields.map(
					( field, index ) => ( {
						...field,
						index,
					} )
				);

				return reorderedHiddenFields;
			} );
		}

		setDraggedSource( null );
		setDraggedTarget( null );
	};

	if ( view.type === LAYOUT_TABLE && view.layout?.combinedFields ) {
		const newFields =
			view.layout?.combinedFields?.map( ( { id, label } ) => ( {
				id,
				label,
				index: visibleFieldIds.indexOf( id ),
				isVisible: true,
				isHidable: ! notHidableFieldIds.includes( id ),
			} ) ) ?? [];
		setVisibleFields( ( prevFields ) => [ ...prevFields, ...newFields ] );
	}

	visibleFields.sort( ( a, b ) => a.index - b.index );
	hiddenFields.sort( ( a, b ) => a.index - b.index );

	if ( ! visibleFields?.length && ! hiddenFields?.length ) {
		return null;
	}

	return (
		<VStack spacing={ 6 } className="dataviews-field-control">
			{ !! visibleFields?.length && (
				<ItemGroup isBordered isSeparated>
					{ visibleFields.map( ( field ) => (
						<FieldItem
							key={ field.id }
							field={ field }
							fields={ fields }
							view={ view }
							onChangeView={ onChangeView }
							onDragStart={ handleDragStart }
							onDragOver={ handleDragOver }
							onDrop={ handleDrop }
						/>
					) ) }
				</ItemGroup>
			) }
			{ !! hiddenFields?.length && (
				<>
					<VStack spacing={ 4 }>
						<BaseControl.VisualLabel style={ { margin: 0 } }>
							{ __( 'Hidden' ) }
						</BaseControl.VisualLabel>
						<ItemGroup isBordered isSeparated>
							{ hiddenFields.map( ( field ) => (
								<FieldItem
									key={ field.id }
									field={ field }
									fields={ fields }
									view={ view }
									onChangeView={ onChangeView }
									onDragStart={ handleDragStart }
									onDragOver={ handleDragOver }
									onDrop={ handleDrop }
								/>
							) ) }
						</ItemGroup>
					</VStack>
				</>
			) }
		</VStack>
	);
}

function SettingsSection( {
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
} ) {
	return (
		<Grid columns={ 12 } className="dataviews-settings-section" gap={ 4 }>
			<div className="dataviews-settings-section__sidebar">
				<Heading
					level={ 2 }
					className="dataviews-settings-section__title"
				>
					{ title }
				</Heading>
				{ description && (
					<Text
						variant="muted"
						className="dataviews-settings-section__description"
					>
						{ description }
					</Text>
				) }
			</div>
			<Grid
				columns={ 8 }
				gap={ 4 }
				className="dataviews-settings-section__content"
			>
				{ children }
			</Grid>
		</Grid>
	);
}

function DataviewsViewConfigDropdown( {
	density,
	setDensity,
}: {
	density: number;
	setDensity: React.Dispatch< React.SetStateAction< number > >;
} ) {
	const { view } = useContext( DataViewsContext );
	const popoverId = useInstanceId(
		_DataViewsViewConfig,
		'dataviews-view-config-dropdown'
	);

	return (
		<Dropdown
			popoverProps={ {
				...DATAVIEWS_CONFIG_POPOVER_PROPS,
				id: popoverId,
			} }
			renderToggle={ ( { onToggle, isOpen } ) => {
				return (
					<Button
						size="compact"
						icon={ cog }
						label={ _x( 'View options', 'View is used as a noun' ) }
						onClick={ onToggle }
						aria-expanded={ isOpen ? 'true' : 'false' }
						aria-controls={ popoverId }
					/>
				);
			} }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<VStack className="dataviews-view-config" spacing={ 6 }>
						<SettingsSection title={ __( 'Appearance' ) }>
							<HStack expanded className="is-divided-in-two">
								<SortFieldControl />
								<SortDirectionControl />
							</HStack>
							{ view.type === LAYOUT_GRID && (
								<DensityPicker
									density={ density }
									setDensity={ setDensity }
								/>
							) }
							<ItemsPerPageControl />
						</SettingsSection>
						<SettingsSection title={ __( 'Properties' ) }>
							<FieldControl />
						</SettingsSection>
					</VStack>
				</DropdownContentWrapper>
			) }
		/>
	);
}

function _DataViewsViewConfig( {
	density,
	setDensity,
	defaultLayouts = { list: {}, grid: {}, table: {} },
}: {
	density: number;
	setDensity: React.Dispatch< React.SetStateAction< number > >;
	defaultLayouts?: SupportedLayouts;
} ) {
	return (
		<>
			<ViewTypeMenu defaultLayouts={ defaultLayouts } />
			<DataviewsViewConfigDropdown
				density={ density }
				setDensity={ setDensity }
			/>
		</>
	);
}

const DataViewsViewConfig = memo( _DataViewsViewConfig );

export default DataViewsViewConfig;
