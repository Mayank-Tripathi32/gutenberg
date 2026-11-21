import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import type { Post } from '@wordpress/core-data';
import { filterSortAndPaginate } from '@wordpress/dataviews';
import { __ } from '@wordpress/i18n';
import { notFound } from '@wordpress/route';
import {
	ensureView,
	loadNavigationFields,
	loadNavigationViewConfig,
} from './view-utils';

const NAVIGATION_POST_TYPE = 'wp_navigation';

const PRELOADED_NAVIGATION_MENUS_QUERY = {
	per_page: -1,
	status: [ 'publish', 'draft' ],
	order: 'desc',
	orderby: 'date',
};

export const route = {
	async beforeLoad() {
		// Only block themes render `wp_navigation` posts. Classic themes manage
		// their menus through Appearance > Menus instead.
		const theme = await resolveSelect( coreStore ).getCurrentTheme();
		if ( ! theme?.is_block_theme ) {
			throw notFound();
		}
	},
	title: () => __( 'Navigation' ),
	canvas: async ( {
		search,
	}: {
		search: {
			ids?: string[];
			page?: number;
			search?: string;
		};
	} ) => {
		// Preview the navigation menu the stage selects by default: the first
		// row after applying the view's search, sorting and pagination to
		// every menu (the same query the stage uses, so the records are
		// shared), over the same field definitions the stage renders.
		const [ navigations, view, fields ] = await Promise.all( [
			resolveSelect( coreStore ).getEntityRecords(
				'postType',
				NAVIGATION_POST_TYPE,
				PRELOADED_NAVIGATION_MENUS_QUERY
			) as Promise< Post[] | null >,
			ensureView( { page: search.page, search: search.search } ),
			loadNavigationFields(),
		] );

		if ( ! navigations?.length ) {
			return { postType: NAVIGATION_POST_TYPE, isPreview: true };
		}

		const firstNavigation = filterSortAndPaginate(
			navigations,
			view,
			fields
		).data[ 0 ];

		if ( ! search.ids && ! firstNavigation ) {
			return { postType: NAVIGATION_POST_TYPE, isPreview: true };
		}

		const postId = search.ids
			? parseInt( search.ids[ 0 ] )
			: firstNavigation.id;

		return {
			postType: NAVIGATION_POST_TYPE,
			postId,
			isPreview: true,
		};
	},
	loader: async () => {
		await Promise.all( [
			// Preload the view configuration the stage resolves its view from.
			loadNavigationViewConfig(),
			// Preload navigation menus
			resolveSelect( coreStore ).getEntityRecords(
				'postType',
				NAVIGATION_POST_TYPE,
				PRELOADED_NAVIGATION_MENUS_QUERY
			),
			resolveSelect( coreStore ).canUser( 'create', {
				kind: 'postType',
				name: NAVIGATION_POST_TYPE,
			} ),
			// Preload post type object (what usePostFields needs)
			resolveSelect( coreStore ).getPostType( NAVIGATION_POST_TYPE ),
			// Preload users data (what usePostFields needs for author field)
			resolveSelect( coreStore ).getEntityRecords( 'root', 'user', {
				per_page: -1,
			} ),
		] );
	},
};
