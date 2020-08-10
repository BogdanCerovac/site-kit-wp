/**
 * modules/adsense data store: service.
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
 * Wordpress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from './constants';
import { STORE_NAME as CORE_USER } from '../../../googlesitekit/datastore/user/constants';
import { parseDomain } from '../util/url';

const { createRegistrySelector } = Data;

export const selectors = {
	/**
	 * Gets a URL to the service.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object} state        Data store's state.
	 * @param {Object} [args]       Object containing optional path and query args
	 * @param {string} [args.path]  A path to append to the base url.
	 * @param {Object} [args.query] Object of query params to be added to the URL.
	 * @return {string} The URL to the service
	 */
	getServiceURL: createRegistrySelector( ( select ) => ( state, { path, query } = {} ) => {
		const userEmail = select( CORE_USER ).getEmail();
		if ( userEmail === undefined ) {
			return undefined;
		}
		const baseURI = `https://www.google.com/adsense/new/?authuser=${ userEmail }`;
		if ( path ) {
			const sanitizedPath = `/${ path.replace( /^\//, '' ) }`;
			return addQueryArgs( `${ baseURI }${ sanitizedPath }`, query );
		}
		return addQueryArgs( baseURI, query );
	} ),

	/**
	 * Returns the URL for creating a new AdSense account.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object}  state     Data store's state.
	 * @param {string} [siteURL]  The initial site URL to create the account for
	 * @return {string} AdSense URL to create a new account.
	 */
	getCreateAccountURL( state, siteURL ) {
		const query = {
			// TODO: Check which of these parameters are actually required.
			source: 'site-kit',
			utm_source: 'site-kit',
			utm_medium: 'wordpress_signup',
		};
		if ( siteURL ) {
			query.url = siteURL;
		}
		const baseURI = `https://www.google.com/adsense/signup/new`;
		return addQueryArgs( baseURI, query );
	},

	/**
	 * Returns the URL to an AdSense account's overview page.
	 *
	 * @since n.e.x.t
	 *
	 * @return {string} AdSense account overview URL.
	 */
	getAccountURL: createRegistrySelector( ( select ) => () => {
		const accountID = select( STORE_NAME ).getAccountID();
		if ( accountID === undefined ) {
			return undefined;
		}
		return select( STORE_NAME ).getServiceURL( { path: `${ accountID }/home`, query: { source: 'site-kit' } } );
	} ),

	/**
	 * Returns the URL to an AdSense account's site overview page.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object}  state     Data store's state.
	 * @param {string} [siteURL]  The initial site URL to create the account for
	 * @return {string} AdSense account site overview URL.
	 */
	getAccountSiteURL: createRegistrySelector( ( select ) => ( state, siteURL ) => {
		const accountID = select( STORE_NAME ).getAccountID();
		if ( accountID === undefined ) {
			return undefined;
		}
		const query = {
			// TODO: Check which of these parameters are actually required.
			source: 'site-kit',
			utm_source: 'site-kit',
		};
		if ( siteURL ) {
			query.url = parseDomain( siteURL ) || siteURL;
		}
		return select( STORE_NAME ).getServiceURL( { path: `${ accountID }/sites/my-sites`, query } );
	} ),

	/**
	 * Returns the URL to an AdSense account's site ads preview page.
	 *
	 * @since n.e.x.t
	 *
	 * @param {Object}  state     Data store's state.
	 * @param {string} [siteURL]  The initial site URL to create the account for
	 * @return {string} AdSense account site ads preview URL.
	 */
	getAccountSiteAdsPreviewURL: createRegistrySelector( ( select ) => ( state, siteURL ) => {
		const accountID = select( STORE_NAME ).getAccountID();
		if ( accountID === undefined ) {
			return undefined;
		}
		const query = { source: 'site-kit' };
		if ( siteURL ) {
			query.url = parseDomain( siteURL ) || siteURL;
		}
		return select( STORE_NAME ).getServiceURL( { path: `${ accountID }/myads/sites/preview`, query } );
	} ),
};

const store = {
	selectors,
};

export default store;