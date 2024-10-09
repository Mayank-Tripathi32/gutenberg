/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Zoom Out', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyfour' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test.beforeEach( async ( { admin, editor } ) => {
		await admin.visitSiteEditor();
		await editor.canvas.locator( 'body' ).click();
	} );

	test( 'Entering zoomed out mode zooms the canvas', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Zoom Out' ).click();
		const iframe = page.locator( 'iframe[name="editor-canvas"]' );
		const html = editor.canvas.locator( 'html' );

		// Check that the html is scaled.
		await expect( html ).toHaveCSS(
			'scale',
			new RegExp( /0\.[5-8][0-9]*/, 'i' )
		);
		const iframeRect = await iframe.boundingBox();
		const htmlRect = await html.boundingBox();

		// Check that the iframe is larger than the html.
		expect( iframeRect.width ).toBeGreaterThan( htmlRect.width );

		// Check that the zoomed out content has a frame around it.
		const paddingTop = await html.evaluate( ( element ) => {
			const paddingValue = window.getComputedStyle( element ).paddingTop;
			return parseFloat( paddingValue );
		} );
		expect( htmlRect.y + paddingTop ).toBeGreaterThan( iframeRect.y );
		expect( htmlRect.x ).toBeGreaterThan( iframeRect.x );
	} );

	test( 'When in zoom out, a vertical toolbar appears for sections', async ( {
		page,
		editor,
	} ) => {
		await page.getByLabel( 'Zoom Out' ).click();

		//Click on the first pattern of the theme
		await editor.canvas
			.locator( 'div' )
			.filter( { hasText: 'A commitment to innovation' } )
			.nth( 1 )
			.click();

		await expect(
			page.getByRole( 'toolbar', { name: 'Block tools' } )
		).toBeVisible();
	} );
} );
