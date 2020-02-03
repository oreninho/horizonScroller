function sliderElement(id,minRange, maxRange, curPos) {
	var slider = document.getElementById(id);
	//will be used to adjust the normalaized values to the actual location on screen
	var pixelRatio = (slider.clientWidth)/(maxRange-minRange);
	var ranges = [minRange*pixelRatio,maxRange*pixelRatio];
	var normRanges = [minRange,maxRange];
	var targetCursor = 0,startingPos=0; 
	var slideLocation = curPos;
		
	//consts for nice movment of the scrolling
	const timeInt = 1;const slowStepBy = 80;
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
	
		var target = e.clientX>=ranges[1]?ranges[1]:e.clientX;		
		if (target < ranges[0])
			target = ranges[0];	
		
		//normalaized according to our Axis, minimum step (FIX)		
		var steps = Math.abs(target-touchCursor.offsetLeft)/pixelRatio;		
		if (steps<1) 
			return ;
		
		//setting the direction
		var dir = 1;		
		if (target < touchCursor.offsetLeft)
		{
			dir = -1;
		}
		pace = Math.abs(target-touchCursor.offsetLeft)/(slowStepBy);
		//Infinite loop fix, offset left cant move by less than 1, it stay
		if (pace <1) return;
		var nextStep = dir * pace;
		var slideTimer = setInterval(function(){
			if (inLimit(target) && inLimit(touchCursor.offsetLeft)){
				if( target -pace <= touchCursor.offsetLeft &&  target + pace >= touchCursor.offsetLeft ){
					window.clearInterval(slideTimer);
				}
				else{
					updateElements(nextStep+touchCursor.offsetLeft);						
				}
				
			}
			else{
				window.clearInterval(slideTimer);
				target=target>ranges[1]?ranges[1]:target<ranges[0]?ranges[0]:target;				
				touchCursor.offsetLeft = target;
				updateElements(target);
				//lineSpan.style.width = touchCursor.offsetLeft + 'px';
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
    targetCursor = e.pageX;
	startingPos = targetCursor - touchCursor.offsetLeft;	
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;	
  }
    
  function updateElements(target)
  {		
	touchCursor.style.left = (target) + "px";			
	lineSpan.style.width = touchCursor.offsetLeft + 'px';
	slideLocation = Math.ceil(touchCursor.offsetLeft/pixelRatio);
	slideLocation = slideLocation>normRanges[1]?normRanges[1]:slideLocation;
	curValElem.innerHTML = slideLocation;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
	target = e.pageX - startingPos;
	if (target<ranges[0]) 
		target=ranges[0];
	if(target > (ranges[1] - touchCursor.offsetWidth + 10))
    {
		target = ranges[1] - touchCursor.offsetWidth + 10;
    }
	updateElements(target);	
  }

  function closeDragElement(e) {
	document.onmouseup = null;
    document.onmousemove = null;
	document.onclick = null;
	
  }
}
