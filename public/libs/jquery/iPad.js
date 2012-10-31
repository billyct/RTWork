/*
 * Adminica UI
 *
 * Copyright (c) 2010 Tricycle Interactive
 *
 * http://www.tricycle.ie
 */
 
 		document.addEventListener('DOMContentLoaded', loaded, true);
		function loaded(){
		
			var grabber = document.getElementById('touch_sort');
			console.log('in function');
			grabber.addEventListener("touchstart", touchHandler, true);
			grabber.addEventListener("touchmove", touchHandler, true);
			grabber.addEventListener("touchend", touchHandler, true);
			grabber.addEventListener("touchcancel", touchHandler, true); 
		}
	
		function touchHandler(event)
		{
			var touches = event.changedTouches,
				first = touches[0],
				type = "";

				 switch(event.type)
			{
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type="mousemove"; break;        
				case "touchend":   type="mouseup"; break;
				default: return;
			}

					 //initMouseEvent(type, canBubble, cancelable, view, clickCount,
			//           screenX, screenY, clientX, clientY, ctrlKey,
			//           altKey, shiftKey, metaKey, button, relatedTarget);
			
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1,
									  first.screenX, first.screenY,
									  first.clientX, first.clientY, false,
									  false, false, false, 0/*left*/, null);

																						 first.target.dispatchEvent(simulatedEvent);
			event.preventDefault();
		}
