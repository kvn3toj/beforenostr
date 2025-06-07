/* Extracted from: merchant_home_09_final_state_2025-06-03T02-13-20-890Z.html */
/* Block index: 9 */
/* Extracted at: 2025-06-03T02:16:25.483Z */

jQuery(document).ready(function (){

			var modalOpen = false;

			if(localStorage.getItem('viewHomeModalSupplier')){
				modalOpen = true;
			}

			var giftCards = parseInt(0);

			if(!modalOpen && giftCards!=0){
				$('#infoGifCardModalP').modal('show');
				$('#containerinfoGifCardModalP').flipclock({fulltime: true, days: true, time: new Date('07/11/2020 11:59:59 PM')});
				localStorage.setItem('viewHomeModalSupplier', '1' );
			
			}
				
			
		});
		
		var all_tags = {
			'tag1': '',
			/* 'tag2': '', */
			'tag3': '',
			/* 'tag4': '' */
		}

		var user_id = null;
		var tagify;
		function loadTags(num){		

			var tags_actual = all_tags['tag'+num];
			//console.log("Actuales: ", tags_actual);
			$('#all-tags').val(tags_actual);

			if($.trim(tags_actual) == ""){
				$('#finish').prop('disabled', true);
			}else{
				$('#finish').prop('disabled', false);
			}
			
			/* $('.ex-modal').html(texts[num].ex);
			$('.title-modal').html(texts[num].title); */

			var input = document.querySelector('input[name=tags-outside]');
			// init Tagify script on the above inputs
			tagify = new Tagify(input, {backspace: 'edit'});
			
			// add a class to Tagify's input element
			tagify.DOM.input.classList.add('tagify__input--outside');

			// re-place Tagify's input element outside of the  element (tagify.DOM.scope), just before it
			tagify.DOM.scope.parentNode.insertBefore(tagify.DOM.input, tagify.DOM.scope.nextSibling);

			tagify.on('add', function(e, tagName){
				var value = jQuery('#all-tags').val();
				all_tags['tag'+num] = value;
				$('#finish').prop('disabled', false);
			});
			
			tagify.on('remove', function(e, tagName){
				var value = jQuery('#all-tags').val();
				all_tags['tag'+num] = value;
				if($.trim(value) == ""){
					$('#finish').prop('disabled', true);
				}
				
			});
			
		}	

		function objToArray(obj){
			var json_ = JSON.parse(obj);
			var result = [];
			jQuery.each(json_, function(i, item){
				result.push(item.value);
			});
			return result;
		}
		

		jQuery(document).ready(function (){
		/* 	loadTags(1); */
			$('.progress-bar').each(function(){
				var value = $(this).attr("aria-valuenow");
				$(this).animate({
					width: value,
				}, 1500);
				
			});
		});