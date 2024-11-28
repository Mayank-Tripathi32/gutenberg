/**
 * WordPress dependencies
 */
import { Button, Flex, FlexItem } from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	useCallback,
	useRef,
	createInterpolateElement,
} from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	__experimentalUseDialog as useDialog,
	useInstanceId,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import EntityTypeList from './entity-type-list';
import { useIsDirty } from './hooks/use-is-dirty';
import { store as editorStore } from '../../store';
import { unlock } from '../../lock-unlock';

function identity( values ) {
	return values;
}

/**
 * Renders the component for managing saved states of entities.
 *
 * @param {Object}   props       The component props.
 * @param {Function} props.close The function to close the dialog.
 *
 * @return {JSX.Element} The rendered component.
 */
export default function EntitiesSavedStates( { close } ) {
	const isDirtyProps = useIsDirty();
	return (
		<EntitiesSavedStatesExtensible close={ close } { ...isDirtyProps } />
	);
}

/**
 * Renders a panel for saving entities with dirty records.
 *
 * @param {Object}   props                       The component props.
 * @param {string}   props.additionalPrompt      Additional prompt to display.
 * @param {Function} props.close                 Function to close the panel.
 * @param {Function} props.onSave                Function to call when saving entities.
 * @param {boolean}  props.saveEnabled           Flag indicating if save is enabled.
 * @param {string}   props.saveLabel             Label for the save button.
 * @param {Array}    props.dirtyEntityRecords    Array of dirty entity records.
 * @param {boolean}  props.isDirty               Flag indicating if there are dirty entities.
 * @param {Function} props.setUnselectedEntities Function to set unselected entities.
 * @param {Array}    props.unselectedEntities    Array of unselected entities.
 *
 * @return {JSX.Element} The rendered component.
 */
export function EntitiesSavedStatesExtensible( {
	additionalPrompt = undefined,
	close,
	onSave = identity,
	saveEnabled: saveEnabledProp = undefined,
	saveLabel = __( 'Save' ),
	dirtyEntityRecords,
	isDirty,
	setUnselectedEntities,
	unselectedEntities,
} ) {
	const saveButtonRef = useRef();
	const { saveDirtyEntities } = unlock( useDispatch( editorStore ) );
	// To group entities by type.
	const partitionedSavables = dirtyEntityRecords.reduce( ( acc, record ) => {
		const { name } = record;
		if ( ! acc[ name ] ) {
			acc[ name ] = [];
		}
		acc[ name ].push( record );
		return acc;
	}, {} );

	// Sort entity groups.
	const {
		site: siteSavables,
		wp_template: templateSavables,
		wp_template_part: templatePartSavables,
		...contentSavables
	} = partitionedSavables;
	const sortedPartitionedSavables = [
		siteSavables,
		templateSavables,
		templatePartSavables,
		...Object.values( contentSavables ),
	].filter( Array.isArray );

	const saveEnabled = saveEnabledProp ?? isDirty;
	// Explicitly define this with no argument passed.  Using `close` on
	// its own will use the event object in place of the expected saved entities.
	const dismissPanel = useCallback( () => close(), [ close ] );

	return (
		<div className="entities-saved-states__panel">
			<Flex className="entities-saved-states__panel-header" gap={ 2 }>
				<FlexItem
					isBlock
					as={ Button }
					variant="secondary"
					size="compact"
					onClick={ dismissPanel }
				>
					{ __( 'Cancel' ) }
				</FlexItem>
				<FlexItem
					isBlock
					as={ Button }
					ref={ saveButtonRef }
					variant="primary"
					size="compact"
					disabled={ ! saveEnabled }
					accessibleWhenDisabled
					onClick={ () =>
						saveDirtyEntities( {
							onSave,
							dirtyEntityRecords,
							entitiesToSkip: unselectedEntities,
							close,
						} )
					}
					className="editor-entities-saved-states__save-button"
				>
					{ saveLabel }
				</FlexItem>
			</Flex>

			<div className="entities-saved-states__text-prompt">
				<div className="entities-saved-states__text-prompt--header-wrapper">
					<strong className="entities-saved-states__text-prompt--header">
						{ __( 'Are you ready to save?' ) }
					</strong>
					{ additionalPrompt }
				</div>
				<p>
					{ isDirty
						? createInterpolateElement(
								sprintf(
									/* translators: %d: number of site changes waiting to be saved. */
									_n(
										'There is <strong>%d site change</strong> waiting to be saved.',
										'There are <strong>%d site changes</strong> waiting to be saved.',
										dirtyEntityRecords.length
									),
									dirtyEntityRecords.length
								),
								{ strong: <strong /> }
						  )
						: __( 'Select the items you want to save.' ) }
				</p>
			</div>

			{ sortedPartitionedSavables.map( ( list ) => {
				return (
					<EntityTypeList
						key={ list[ 0 ].name }
						list={ list }
						unselectedEntities={ unselectedEntities }
						setUnselectedEntities={ setUnselectedEntities }
					/>
				);
			} ) }
		</div>
	);
}

/**
 * A wrapper component that renders a dialog for displaying entities.
 *
 * @param {Object}          props          The component's props.
 * @param {React.ReactNode} props.children The content to be displayed inside the dialog.
 * @param {Function}        props.close    A function to close the dialog.
 *
 * @return {React.Element} The rendered dialog element with children.
 */
export function EntitiesSavedStatesDialogWrapper( { children, close } ) {
	const dismissPanel = useCallback( () => close(), [ close ] );
	const [ saveDialogRef, saveDialogProps ] = useDialog( {
		onClose: () => dismissPanel(),
	} );

	const dialogLabel = useInstanceId( EntitiesSavedStatesExtensible, 'label' );
	const dialogDescription = useInstanceId(
		EntitiesSavedStatesExtensible,
		'description'
	);

	return (
		<div
			ref={ saveDialogRef }
			{ ...saveDialogProps }
			role="dialog"
			aria-labelledby={ dialogLabel }
			aria-describedby={ dialogDescription }
		>
			{ children }
		</div>
	);
}
