/* Extracted from: merchant_home_01_initial_load_2025-06-03T02-11-13-867Z.html */
/* Block index: 27 */
/* Extracted at: 2025-06-03T02:16:25.342Z */

$( '.is-numeric' ).on( 'textInput', ( event ) => {
		var keyCode = event.originalEvent.data.charCodeAt( 0 );
		if( keyCode == 44 || keyCode == 46 ) event.preventDefault();
	});