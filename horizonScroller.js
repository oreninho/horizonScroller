function sliderElement(id,minRange, maxRange, curPos) {
	var slider = document.getElementById(id);
	//will be used to adjust the normalaized values to the actual location on screen
	var pixelRatio = slider.clientWidth/(maxRange-minRange);
	var ranges = [minRange*pixelRatio,maxRange*pixelRatio];
	var  dragStep = 0,targetCursor = 0;
	var slideLocation = curPos;
		
	//consts for nice movment of the scrolling
	const timeInt = 1;const slowStepBy = 50;
	var touchCursor = slider.querySelector('.input-range__slider-container');
	var lineSpan   = slider.querySelector('.input-range__track--active');
	var curValElem   = slider.querySelector(".input-range__label--value");
	initElements(curPos);
	
	slider.onclick = smoothSliding;
	slider.onmousedown = dragMouseDown;
		
	function initElements(curPos){
		curValElem.innerHTML = curPos;
		touchCursor.style.left = curPos*pixelRatio;
		lineSpan.style.width = touchCursor.offsetLeft + 'px';
		
	}	
	
	function smoothSliding(e){
	
		var target = e.clientX;
		//normalaized according to our Axis		
		var steps = Math.abs(target-touchCursor.offsetLeft);		
		if (steps<1) 
			return ;
		
		//setting the direction
		var dir = 1;		
		if (target < touchCursor.offsetLeft)
		{
			dir = -1;
		}
		pace = Math.abs(target-touchCursor.offsetLeft)/(slowStepBy);
		var nextStep = dir * pace;
		var slideTimer = setInterval(function(){
			if (inLimit(target) && inLimit(touchCursor.offsetLeft)){
				if( target -pace <= touchCursor.offsetLeft &&  target + pace >= touchCursor.offsetLeft ){
					window.clearInterval(slideTimer);
				}
				else
				{
					updateElements(nextStep);						
				}
				
			}
			else
			{
				window.clearInterval(slideTimer);
				touchCursor.offsetLeft = ranges[1];
			}
		}, timeInt);
	}	
	
	function inLimit(target)
	{
		if ( target>ranges[1] || target<ranges[0]){			
			return false;
		}
		else {
			return true;
		}							
	}
	
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    targetCursor = e.clientX;    
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function updateElements(target)
  {	
	touchCursor.style.left = (touchCursor.offsetLeft + target) + "px";			
	lineSpan.style.width = touchCursor.offsetLeft + 'px';
	slideLocation = Math.ceil(touchCursor.offsetLeft/pixelRatio);
	curValElem.innerHTML = slideLocation;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
	
    dragStep = (targetCursor - e.clientX);
	targetCursor = e.clientX;    
    // set the element's new position: 
	if (inLimit(targetCursor)){			
		updateElements(-dragStep);
	}
	else
		touchCursor.offsetLeft = ranges[1];
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
	document.onclick = null;
	
  }
}