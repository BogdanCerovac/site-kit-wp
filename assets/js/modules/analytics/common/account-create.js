/**
 * AccountCreate component.
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment, useCallback, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../components/button';
import ProgressBar from '../../../components/progress-bar';
import { trackEvent } from '../../../util';
import TimezoneSelect from './timzezone-select';
import AccountField from './account-field';
import PropertyField from './property-field';
import ProfileField from './profile-field';
import { STORE_NAME } from '../datastore/constants';

import Data from 'googlesitekit-data';
const { useDispatch, useSelect, select: directSelect } = Data;

const AccountCreate = () => {
	const { siteName, siteURL } = global.googlesitekit.admin;
	let tz = directSelect( 'core/site' ).getTimezone();
	const url = new URL( siteURL );
	const { createAccount } = useDispatch( STORE_NAME );
	const accountTicketTermsOfServiceURL = useSelect(
		( select ) => {
			return select( STORE_NAME ).getAccountTicketTermsOfServiceURL();
		},
		[]
	);
	const [ isNavigating, setIsNavigating ] = useState( false );
	const handleSubmit = useCallback( ( accountName, propertyName, profileName, timezone ) => {
		trackEvent( 'analytics_setup', 'new_account_setup_clicked' );
		setIsNavigating( true );
		async function send() {
			await createAccount( {
				accountName,
				propertyName,
				profileName,
				timezone,
			} );

			// Redirect if the accountTicketTermsOfServiceURL is set.
			if ( accountTicketTermsOfServiceURL ) {
				location = accountTicketTermsOfServiceURL;
			}
			setIsNavigating( false );
		}
		send();
	} );

	// Fall back to the browser timezone if the WordPress timezone was not set.
	if ( ! tz || '' === tz || 'UTC' === tz ) {
		tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	const [ accountName, setAccountName ] = useState( siteName );
	const [ propertyName, setPropertyName ] = useState( url.hostname );
	const [ profileName, setProfileName ] = useState( __( 'All website traffic', 'google-site-kit' ) );
	const [ timezone, setTimezone ] = useState( tz );
	const [ validationIssues, setValidationIssues ] = useState( {
		accountName: accountName === '',
		propertyName: propertyName === '',
		profileName: profileName === '',
		timezone: timezone === '',
	} );

	const validationHasIssues = Object.values( validationIssues ).some( ( check ) => check );

	useEffect( () => {
		setValidationIssues( {
			accountName: accountName === '',
			propertyName: propertyName === '',
			profileName: profileName === '',
			timezone: timezone === '' || timezone === 'UTC', //An unset timezone in WordPress is reported as "UTC".
		} );
	}, [ accountName, propertyName, profileName, timezone ] );

	// Connect to the data store.
	const isDoingCreateAccount = useSelect(
		( select ) => {
			return select( STORE_NAME ).isDoingCreateAccount();
		},
		[]
	);

	if ( isDoingCreateAccount || isNavigating ) {
		return <ProgressBar />;
	}

	// Disable the submit button if there are validation errors, and while submission is in progress.
	const buttonDisabled = validationHasIssues;

	return (
		<Fragment>
			<div className="googlesitekit-setup-module">
				<div className="mdc-layout-grid__inner">
					<div className="mdc-layout-grid__cell--span-12">
						<div className="mdc-layout-grid">
							<h3 className="googlesitekit-heading-4">
								{ __( 'Create new Analytics account', 'google-site-kit' ) }
							</h3>
							<div className="googlesitekit-setup-module__inputs">
								<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
									<AccountField
										hasError={ validationIssues.accountName }
										accountName={ accountName }
										setAccountName={ setAccountName }
									/>
								</div>
								<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
									<PropertyField
										hasError={ validationIssues.propertyName }
										propertyName={ propertyName }
										setPropertyName={ setPropertyName }
									/>
								</div>
								<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
									<ProfileField
										hasError={ validationIssues.profileName }
										profileName={ profileName }
										setProfileName={ setProfileName }
									/>
								</div>
								<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
									<TimezoneSelect
										hasError={ validationIssues.timezone }
										timezone={ timezone }
										setTimezone={ setTimezone.validationIssues }
									/>
								</div>
							</div>
						</div>
						<div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
							<Button
								disabled={ buttonDisabled }
								onClick={ () => {
									handleSubmit( accountName, propertyName, profileName, timezone );
								} }
							>
								{ __( 'Create Account', 'google-site-kit' ) }
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default AccountCreate;
