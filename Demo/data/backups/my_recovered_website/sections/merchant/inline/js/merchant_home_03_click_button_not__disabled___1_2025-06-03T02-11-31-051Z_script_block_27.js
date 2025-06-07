/* Extracted from: merchant_home_03_click_button_not__disabled___1_2025-06-03T02-11-31-051Z.html */
/* Block index: 27 */
/* Extracted at: 2025-06-03T02:16:25.368Z */

$( '.is-numeric' ).on( 'textInput', ( event ) => {
		var keyCode = event.originalEvent.data.charCodeAt( 0 );
		if( keyCode == 44 || keyCode == 46 ) event.preventDefault();
	});