/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { Button, createSlotFill } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import {
	__experimentalUseDialog as useDialog,
	useInstanceId,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import EntitiesSavedStates, {
	EntitiesSavedStatesExtensible,
} from '../entities-saved-states';
import PostPublishPanel from '../post-publish-panel';
import PluginPrePublishPanel from '../plugin-pre-publish-panel';
import PluginPostPublishPanel from '../plugin-post-publish-panel';
import { store as editorStore } from '../../store';

const { Fill, Slot } = createSlotFill( 'ActionsPanel' );

export const ActionsPanelFill = Fill;

export default function SavePublishPanels( {
	setEntitiesSavedStatesCallback,
	closeEntitiesSavedStates,
	isEntitiesSavedStatesOpen,
	forceIsDirtyPublishPanel,
} ) {
	const { closePublishSidebar, togglePublishSidebar } =
		useDispatch( editorStore );
	const {
		publishSidebarOpened,
		isPublishable,
		isDirty,
		hasOtherEntitiesChanges,
	} = useSelect( ( select ) => {
		const {
			isPublishSidebarOpened,
			isEditedPostPublishable,
			isCurrentPostPublished,
			isEditedPostDirty,
			hasNonPostEntityChanges,
		} = select( editorStore );
		const _hasOtherEntitiesChanges = hasNonPostEntityChanges();
		return {
			publishSidebarOpened: isPublishSidebarOpened(),
			isPublishable:
				! isCurrentPostPublished() && isEditedPostPublishable(),
			isDirty: _hasOtherEntitiesChanges || isEditedPostDirty(),
			hasOtherEntitiesChanges: _hasOtherEntitiesChanges,
		};
	}, [] );

	const openEntitiesSavedStates = useCallback(
		() => setEntitiesSavedStatesCallback( true ),
		[]
	);

	// It is ok for these components to be unmounted when not in visual use.
	// We don't want more than one present at a time, decide which to render.
	let unmountableContent;
	if ( publishSidebarOpened ) {
		unmountableContent = (
			<PostPublishPanel
				onClose={ closePublishSidebar }
				forceIsDirty={ forceIsDirtyPublishPanel }
				PrePublishExtension={ PluginPrePublishPanel.Slot }
				PostPublishExtension={ PluginPostPublishPanel.Slot }
			/>
		);
	} else if ( isPublishable && ! hasOtherEntitiesChanges ) {
		unmountableContent = (
			<div className="editor-layout__toggle-publish-panel">
				<Button
					__next40pxDefaultSize
					variant="secondary"
					onClick={ togglePublishSidebar }
					aria-expanded={ false }
				>
					{ __( 'Open publish panel' ) }
				</Button>
			</div>
		);
	} else {
		unmountableContent = (
			<div className="editor-layout__toggle-entities-saved-states-panel">
				<Button
					__next40pxDefaultSize
					variant="secondary"
					onClick={ openEntitiesSavedStates }
					aria-expanded={ false }
					disabled={ ! isDirty }
					accessibleWhenDisabled
				>
					{ __( 'Open save panel' ) }
				</Button>
			</div>
		);
	}

	// Since EntitiesSavedStates controls its own panel, we can keep it
	// always mounted to retain its own component state (such as checkboxes).
	return (
		<>
			{ isEntitiesSavedStatesOpen && (
				<EntitieDialogWrapper close={ closeEntitiesSavedStates }>
					<EntitiesSavedStates close={ closeEntitiesSavedStates } />
				</EntitieDialogWrapper>
			) }
			<Slot bubblesVirtually />
			{ ! isEntitiesSavedStatesOpen && unmountableContent }
		</>
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
export function EntitieDialogWrapper( { children, close } ) {
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
			{ ' ' }
			{ children }
		</div>
	);
}
