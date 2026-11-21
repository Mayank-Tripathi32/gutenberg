import { resolveSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import type { Post } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import type { View, Field, SupportedLayouts } from '@wordpress/dataviews';
import { loadView } from '@wordpress/views';
import { unlock } from '@wordpress/routes-lock-unlock';

const NAVIGATION_POST_TYPE = 'wp_navigation';

/**
 * A layer merged on top of a view. Mirrors the `ViewOverrides` type of
 * `@wordpress/views`, which is not exported.
 */
export type ViewOverrides = Partial< Omit< View, 'type' | 'layout' > > & {
	type?: View[ 'type' ];
	layout?: Record< string, unknown >;
};

export interface ViewListEntry {
	title: string;
	slug: string;
	view?: ViewOverrides;
}

interface EntityViewConfig {
	default_view: View | undefined;
	default_layouts: SupportedLayouts | undefined;
	view_list: ViewListEntry[] | undefined;
}

/**
 * Resolves the server-provided view configuration for the navigation post
 * type, for use in the route loader that runs outside React (where
 * `useViewConfig` is unavailable).
 *
 * @return The entity view configuration.
 */
export async function loadNavigationViewConfig(): Promise< EntityViewConfig > {
	const config = await unlock( resolveSelect( coreStore ) ).getViewConfig(
		'postType',
		NAVIGATION_POST_TYPE
	);
	return {
		default_view: config?.default_view,
		default_layouts: config?.default_layouts,
		view_list: config?.view_list,
	};
}

/**
 * Returns the view overrides of the entry in the view list matching the
 * given slug, or an empty object when there is none.
 *
 * @param viewList The `view_list` of an entity view configuration.
 * @param slug     Slug of the active view.
 * @return The view overrides for the active view.
 */
export function getActiveViewOverrides(
	viewList: ViewListEntry[] | undefined,
	slug: string
): ViewOverrides {
	return viewList?.find( ( v ) => v.slug === slug )?.view ?? {};
}

export async function ensureView( search?: {
	page?: number;
	search?: string;
} ) {
	const {
		default_view: defaultView,
		default_layouts: defaultLayouts,
		view_list: viewList,
	} = await loadNavigationViewConfig();
	if ( ! defaultView ) {
		throw new Error(
			`Missing view configuration for the ${ NAVIGATION_POST_TYPE } post type.`
		);
	}
	return loadView( {
		kind: 'postType',
		name: NAVIGATION_POST_TYPE,
		slug: 'default-new',
		defaultView,
		defaultLayouts,
		activeViewOverrides: getActiveViewOverrides( viewList, 'all' ),
		queryParams: search,
	} );
}

/**
 * Loads the fields the server registers for the navigation post type, for use
 * in the route loader that runs outside React.
 *
 * `usePostFields` in the stage shares this resolution, so it renders the
 * fields the loader loaded. It also reports a failure, which is why this
 * resolves to no fields instead of rejecting: the canvas then previews the
 * first navigation menu of the unsorted, unfiltered list rather than failing
 * the whole route.
 *
 * @return The field definitions the stage renders.
 */
export async function loadNavigationFields(): Promise< Field< Post >[] > {
	try {
		return await unlock( resolveSelect( editorStore ) ).getEntityFields(
			'postType',
			NAVIGATION_POST_TYPE
		);
	} catch {
		return [];
	}
}
