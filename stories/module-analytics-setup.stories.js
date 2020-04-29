/**
 * Analytics Setup stories.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { storiesOf } from '@storybook/react';

/**
 * WordPress dependencies
 */
import { removeAllFilters, addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import SetupWrapper from '../assets/js/components/setup/setup-wrapper';
import { SetupMain as AnalyticsSetup } from '../assets/js/modules/analytics/setup/index';
import { fillFilterWithComponent } from '../assets/js/util';
import * as fixtures from '../assets/js/modules/analytics/datastore/__fixtures__';

import { STORE_NAME } from '../assets/js/modules/analytics/datastore';
import { WithTestRegistry } from '../tests/js/utils';
import { ACCOUNT_CREATE } from '../assets/js/modules/analytics/datastore/constants';

function filterAnalyticsSetup() {
	global.googlesitekit.setup.moduleToSetup = 'analytics';

	removeAllFilters( 'googlesitekit.ModuleSetup-analytics' );
	addFilter(
		'googlesitekit.ModuleSetup-analytics',
		'googlesitekit.AnalyticsModuleSetup',
		fillFilterWithComponent( AnalyticsSetup )
	);
}

function Setup( props ) {
	return (
		<WithTestRegistry { ...props }>
			<SetupWrapper />
		</WithTestRegistry>
	);
}

storiesOf( 'Analytics Module/Setup', module )
	.add( 'Loading', () => {
		filterAnalyticsSetup();

		const setupRegistry = ( registry ) => {
			registry.dispatch( STORE_NAME ).setSettings( {} );
			registry.dispatch( STORE_NAME ).receiveAccounts( [] );
			registry.dispatch( STORE_NAME ).receiveExistingTag( null );
			registry.stores[ STORE_NAME ].store.dispatch( { type: 'START_FETCH_ACCOUNTS_PROPERTIES_PROFILES' } );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Start', () => {
		filterAnalyticsSetup();

		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setSettings( {} );
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveProperties( properties );
			dispatch( STORE_NAME ).receiveProfiles( profiles );
			dispatch( STORE_NAME ).receiveExistingTag( null );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Start (with matched property)', () => {
		filterAnalyticsSetup();

		const { accounts, properties, profiles, matchedProperty } = fixtures.accountsPropertiesProfiles;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setSettings( {} );
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveProperties( properties );
			dispatch( STORE_NAME ).receiveProfiles( profiles );
			dispatch( STORE_NAME ).receiveExistingTag( null );
			dispatch( STORE_NAME ).receiveMatchedProperty( matchedProperty );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'No Accounts', () => {
		filterAnalyticsSetup();

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setSettings( {} );
			dispatch( STORE_NAME ).receiveAccounts( [] );
			dispatch( STORE_NAME ).receiveExistingTag( null );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Create Account', () => {
		filterAnalyticsSetup();

		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).receiveExistingTag( null );
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveProperties( properties );
			dispatch( STORE_NAME ).receiveProfiles( profiles );
			dispatch( STORE_NAME ).setSettings( {
				accountID: ACCOUNT_CREATE,
			} );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Existing Tag (with access)', () => {
		filterAnalyticsSetup();

		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		const existingTag = {
			accountID: properties[ 0 ].accountId,
			propertyID: properties[ 0 ].id,
		};

		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setSettings( {} );
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveProperties( properties );
			dispatch( STORE_NAME ).receiveProfiles( profiles );
			dispatch( STORE_NAME ).receiveExistingTag( existingTag.propertyID );
			dispatch( STORE_NAME ).receiveTagPermission( {
				...existingTag,
				permission: true,
			} );
		};

		return <Setup callback={ setupRegistry } />;
	} )
	.add( 'Existing Tag (no access)', () => {
		filterAnalyticsSetup();

		const existingTag = {
			accountID: '12345678',
			propertyID: 'UA-12345678-1',
		};
		const { accounts, properties, profiles } = fixtures.accountsPropertiesProfiles;
		const setupRegistry = ( { dispatch } ) => {
			dispatch( STORE_NAME ).setSettings( {} );
			dispatch( STORE_NAME ).receiveAccounts( accounts );
			dispatch( STORE_NAME ).receiveProperties( properties );
			dispatch( STORE_NAME ).receiveProfiles( profiles );
			dispatch( STORE_NAME ).receiveExistingTag( existingTag.propertyID );
			dispatch( STORE_NAME ).receiveTagPermission( {
				...existingTag,
				permission: false,
			} );
		};

		return <Setup callback={ setupRegistry } />;
	} )
;
