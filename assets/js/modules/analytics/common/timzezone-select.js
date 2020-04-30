/**
 * TimezoneSelect component.
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
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	Select,
	Option,
} from '../../../material-components';
import { countries } from './countries';
import classnames from 'classnames';

const { default: { country: allCountries } } = countries;

const TimezoneSelect = ( { timezone, setTimezone, hasError } ) => {
	const [ selectedCountry, setSelectedCountry ] = useState( timezone );
	const [ selectedTimezoneID, setSelectedTimezoneID ] = useState( '' );
	let multiTimezone,
		selectedTimezoneDisplay = selectedTimezoneID;

	const getTimezoneSelector = () => {
		const response = (
			<div >
				<span style={ { minWidth: '240px', margin: '0 5px 0 0' } /*todo: move to css */ } >
					<Select
						className={ classnames(
							'googlesitekit-analytics__select-timezone',
							{ 'mdc-text-field--error': hasError }
						) }
						name="country"
						enhanced
						value={ selectedCountry }
						onEnhancedChange={ ( i, item ) => {
							setTimezone( item.dataset.value );
							setSelectedCountry( item.dataset.value );
						} }
						label={ __( 'Country', 'google-site-kit' ) }
						outlined
					>
						{
							allCountries && allCountries
								.map( ( aCountry ) => {
									// If the selected timezone is in this country, the country should be selected.
									let value = aCountry.defaultTimeZoneId;
									const timezoneMatch = aCountry.timeZone.find( ( tz ) => tz.timeZoneId === timezone );
									if ( timezoneMatch ) {
										value = timezoneMatch.timeZoneId;
										if ( aCountry.timeZone.length > 1 ) {
											multiTimezone = aCountry.timeZone;
										} else {
											setSelectedTimezoneID( aCountry.timeZone[ 0 ].displayName );
											selectedTimezoneDisplay = aCountry.timeZone[ 0 ].displayName;
											multiTimezone = false;
										}
										setSelectedCountry( timezoneMatch.timeZoneId );
									}

									return (
										<Option
											key={ aCountry.displayName }
											value={ value }
										>
											{ aCountry.displayName }
										</Option>
									);
								} ) }
					</Select>
				</span>
				<span style={ { minWidth: '240px', margin: '5px 5px 0 0' } /*todo: move to css */ } >
					{ multiTimezone
						? <Select
							className="googlesitekit-analytics__select-timezone"
							name="timezone2"
							style={ { minWidth: '240px' } /*todo: move to css */ }
							enhanced
							value={ timezone }
							onEnhancedChange={ ( i, item ) => {
								setTimezone( item.dataset.value );
							} }
							label={ __( 'Timezone', 'google-site-kit' ) }
							outlined
						>
							{
								multiTimezone
									.map( ( aTimezone ) => {
										return (
											<Option
												key={ aTimezone.displayName }
												value={ aTimezone.timeZoneId }
											>
												{ aTimezone.displayName }
											</Option>
										);
									} )
							}
						</Select>
						: selectedTimezoneDisplay
					}
				</span>
			</div>
		);

		return response;
	};

	const timezoneSelector = useMemo( () => getTimezoneSelector(), [ selectedCountry, timezone, hasError ] );

	return timezoneSelector;
};

export default TimezoneSelect;
