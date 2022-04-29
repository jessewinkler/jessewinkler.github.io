function InitInputHooks()
{
	//custom mouse cursor
	canvasDOM.addEventListener('mousemove', function(evt) {
		var rect = canvasDOM.getBoundingClientRect();
		MousePos.x = evt.clientX - rect.left;
		MousePos.y = evt.clientY - rect.top;
		Player.mouseMove();
	});
	//mouse button handlers
	canvasDOM.addEventListener('click', function(evt) {
		Player.click(evt); evt.preventDefault();},false);
	canvasDOM.addEventListener('mousedown', function(evt) {
		Player.autoFollow = true; evt.preventDefault();});
	canvasDOM.addEventListener('mouseup', function(evt) {
		Player.autoFollow = false; evt.preventDefault();});
	//keyboard handler
	document.addEventListener('keydown', function(event) {
		Player.inputHandler(event);
	}, false);
	//have not verified all behavior with keyup yet and no use for it so far
	//document.addEventListener('keyup', function(event) {
	//	Player.inputHandler(event);
	//}, false);
	//stop right-click browser menu
	document.addEventListener('contextmenu', function (evt) {
		evt.preventDefault();
		}, false);
}