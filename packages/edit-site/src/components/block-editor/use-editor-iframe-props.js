/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { privateApis as routerPrivateApis } from '@wordpress/router';
import { addQueryArgs } from '@wordpress/url';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { useLocation, useHistory } = unlock( routerPrivateApis );

export default function useEditorIframeProps() {
	const { query, path } = useLocation();
	const history = useHistory();
	const { canvas = 'view' } = query;
	const { currentPostIsTrashed, isZoomedOut, selectedBlockClientId } =
		useSelect(
			( select ) => ( {
				currentPostIsTrashed:
					select( editorStore ).getCurrentPostAttribute(
						'status'
					) === 'trash',
				isZoomedOut: unlock( select( blockEditorStore ) ).isZoomOut(),
				selectedBlockClientId:
					select( blockEditorStore ).getSelectedBlockClientId(),
			} ),
			[]
		);
	const [ isFocused, setIsFocused ] = useState( false );

	useEffect( () => {
		if ( canvas === 'edit' ) {
			setIsFocused( false );
		}
	}, [ canvas ] );

	// Handle keyboard event to focus on the block when in zoom mode
	const handleZoomModeKeyboard = ( event ) => {
		if ( event.keyCode === ENTER && selectedBlockClientId && isZoomedOut ) {
			const editorCanvas = document.querySelector(
				'.edit-site-visual-editor__editor-canvas'
			);
			if ( editorCanvas?.contentDocument ) {
				const blockElement = editorCanvas.contentDocument.querySelector(
					`[data-block="${ selectedBlockClientId }"]`
				);
				if ( blockElement ) {
					blockElement.focus();
				}
			}
		}
	};

	// In view mode, make the canvas iframe be perceived and behave as a button
	// to switch to edit mode, with a meaningful label and no title attribute.
	const viewModeIframeProps = {
		'aria-label': __( 'Edit' ),
		'aria-disabled': currentPostIsTrashed,
		title: null,
		role: 'button',
		tabIndex: 0,
		onFocus: () => setIsFocused( true ),
		onBlur: () => setIsFocused( false ),
		onKeyDown: ( event ) => {
			const { keyCode } = event;
			if (
				( keyCode === ENTER || keyCode === SPACE ) &&
				! currentPostIsTrashed
			) {
				event.preventDefault();
				history.navigate( addQueryArgs( path, { canvas: 'edit' } ), {
					transition: 'canvas-mode-edit-transition',
				} );
			}
		},
		onClick: () =>
			history.navigate( addQueryArgs( path, { canvas: 'edit' } ), {
				transition: 'canvas-mode-edit-transition',
			} ),
		onClickCapture: ( event ) => {
			if ( currentPostIsTrashed ) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		readonly: true,
	};

	return {
		className: clsx( 'edit-site-visual-editor__editor-canvas', {
			'is-focused': isFocused && canvas === 'view',
		} ),
		onKeyDown: handleZoomModeKeyboard,
		...( canvas === 'view' ? viewModeIframeProps : {} ),
	};
}
