/* Extracted from: merchant_home_02_after_scroll_2025-06-03T02-11-18-900Z.html */
/* Block index: 27 */
/* Extracted at: 2025-06-03T02:16:25.357Z */

$( '.is-numeric' ).on( 'textInput', ( event ) => {
		var keyCode = event.originalEvent.data.charCodeAt( 0 );
		if( keyCode == 44 || keyCode == 46 ) event.preventDefault();
	});