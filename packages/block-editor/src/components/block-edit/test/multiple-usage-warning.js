import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultipleUsageWarning } from '../multiple-usage-warning';

describe( 'MultipleUsageWarning', () => {
	it( 'offers to remove the block when it can be removed', async () => {
		const user = userEvent.setup();
		const onReplace = jest.fn();

		render(
			<MultipleUsageWarning
				originalBlockClientId="original-client-id"
				name="core/test-block"
				onReplace={ onReplace }
			/>
		);

		await user.click( screen.getByRole( 'button', { name: 'Remove' } ) );

		expect( onReplace ).toHaveBeenCalledWith( [] );
	} );

	it( 'does not offer to remove the block when it cannot be removed', () => {
		// The block list passes no `onReplace` when the block is locked against
		// removal, so the button would have thrown when clicked.
		render(
			<MultipleUsageWarning
				originalBlockClientId="original-client-id"
				name="core/test-block"
			/>
		);

		expect(
			screen.getByRole( 'button', { name: 'Find original' } )
		).toBeVisible();
		expect(
			screen.queryByRole( 'button', { name: 'Remove' } )
		).not.toBeInTheDocument();
	} );
} );
