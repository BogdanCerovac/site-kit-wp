/**
 * Analytics Main setup component.
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
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import SetupForm from './setup-form';
import ProgressBar from '../../../components/progress-bar';
import { SvgIcon } from '../../../util';
import { STORE_NAME } from '../datastore';
import { ACCOUNT_CREATE } from '../datastore/constants';
import {
	AccountCreate,
	ExistingTagError,
} from '../common';
const { useSelect } = Data;

export default function SetupMain( { finishSetup } ) {
	const accounts = useSelect( ( select ) => select( STORE_NAME ).getAccounts() ) || [];
	const accountID = useSelect( ( select ) => select( STORE_NAME ).getAccountID() );
	const hasExistingTag = useSelect( ( select ) => select( STORE_NAME ).hasExistingTag() );
	const existingTag = useSelect( ( select ) => select( STORE_NAME ).getExistingTag() ) || {};
	const existingTagPermission = useSelect( ( select ) => select( STORE_NAME ).hasTagPermission( existingTag.propertyID, existingTag.accountID ) );
	const isFetchingAccounts = useSelect( ( select ) => select( STORE_NAME ).isFetchingAccounts() );
	const isDoingSubmitChanges = useSelect( ( select ) => select( STORE_NAME ).isDoingSubmitChanges() );
	const isCreateAccount = ACCOUNT_CREATE === accountID;

	const viewComponent = ( () => {
		switch ( true ) {
			case ( isFetchingAccounts || isDoingSubmitChanges ) :
				return <ProgressBar />;
			case ( hasExistingTag && existingTagPermission === false ) :
				return <ExistingTagError />;
			case ( ! accounts.length || isCreateAccount ) :
				return <AccountCreate />;
			default:
				return <SetupForm finishSetup={ finishSetup } />;
		}
	} )();

	return (
		<div className="googlesitekit-setup-module googlesitekit-setup-module--analytics">

			<div className="googlesitekit-setup-module__logo">
				<SvgIcon id="analytics" width="33" height="33" />
			</div>

			<h2 className="googlesitekit-heading-3 googlesitekit-setup-module__title">
				{ _x( 'Analytics', 'Service name', 'google-site-kit' ) }
			</h2>

			{ viewComponent }
		</div>
	);
}
