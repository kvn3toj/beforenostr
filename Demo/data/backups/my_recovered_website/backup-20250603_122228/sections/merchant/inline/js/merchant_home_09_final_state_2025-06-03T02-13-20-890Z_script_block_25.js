/* Extracted from: merchant_home_09_final_state_2025-06-03T02-13-20-890Z.html */
/* Block index: 25 */
/* Extracted at: 2025-06-03T02:16:25.483Z */

$( '.is-numeric' ).on( 'textInput', ( event ) => {
		var keyCode = event.originalEvent.data.charCodeAt( 0 );
		if( keyCode == 44 || keyCode == 46 ) event.preventDefault();
	});