/**
 * External dependencies
 */
import { View, useWindowDimensions } from 'react-native';

/**
 * WordPress dependencies
 */
import { useConvertUnitToMobile } from '@wordpress/components';
import { withPreferredColorScheme } from '@wordpress/compose';
import {
	InspectorControls,
	isValueSpacingPreset,
	useSetting,
	getCustomValueFromPreset,
	getPxFromCssUnit,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_VALUES } from './constants';
import Controls from './controls';
import styles from './editor.native.scss';

const DEFAULT_FONT_SIZE = 16;

const Spacer = ( {
	attributes,
	context,
	setAttributes,
	isSelected,
	getStylesFromColorScheme,
} ) => {
	const { height: screenHeight, width: screenWidth } = useWindowDimensions();
	const cssUnitOptions = {
		height: screenHeight,
		width: screenWidth,
		fontSize: DEFAULT_FONT_SIZE,
	};
	const { height, width } = attributes;
	const spacingSizes = [
		{ name: 0, slug: '0', size: 0 },
		...( useSetting( 'spacing.spacingSizes' ) || [] ),
	];
	const { orientation } = context;
	const defaultStyle = getStylesFromColorScheme(
		styles.staticSpacer,
		styles.staticDarkSpacer
	);

	useEffect( () => {
		if ( orientation === 'horizontal' && ! width ) {
			setAttributes( {
				height: '0px',
				width: '72px',
			} );
		}
	}, [] );

	let convertedHeight = useConvertUnitToMobile( height );
	let convertedWidth = useConvertUnitToMobile( width );
	const presetValues = {};

	if ( isValueSpacingPreset( height ) ) {
		const heightValue = getCustomValueFromPreset( height, spacingSizes );
		const parsedPresetHeightValue = parseFloat(
			getPxFromCssUnit( heightValue, cssUnitOptions )
		);

		convertedHeight = parsedPresetHeightValue || DEFAULT_VALUES.px;
		presetValues.presetHeight = convertedHeight;
	}

	if ( isValueSpacingPreset( width ) ) {
		const widthValue = getCustomValueFromPreset( width, spacingSizes );
		const parsedPresetWidthValue = parseFloat(
			getPxFromCssUnit( widthValue, cssUnitOptions )
		);

		convertedWidth = parsedPresetWidthValue || DEFAULT_VALUES.px;
		presetValues.presetWidth = convertedWidth;
	}

	return (
		<View
			style={ [
				defaultStyle,
				isSelected && styles.selectedSpacer,
				{ height: convertedHeight, width: convertedWidth },
			] }
		>
			{ isSelected && (
				<InspectorControls>
					<Controls
						attributes={ attributes }
						context={ context }
						setAttributes={ setAttributes }
						{ ...presetValues }
					/>
				</InspectorControls>
			) }
		</View>
	);
};

export default withPreferredColorScheme( Spacer );
