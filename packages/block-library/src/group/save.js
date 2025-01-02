/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save( {
	attributes: { tagName: Tag, isStackedOnMobile },
} ) {
	const className = isStackedOnMobile ? 'is-stacked-on-mobile' : '';

	return (
		<Tag
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className,
				} )
			) }
		/>
	);
}
