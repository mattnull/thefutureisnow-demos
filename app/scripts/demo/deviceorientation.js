/**
 * Device Orientation Demo
 * @author Matt Null - http://github.com/mattnull
 */
var DeviceOrientationDemo = (function(){
	if(window.DeviceOrientationEvent){
		window.addEventListener('deviceorientation', function(e){
			var leftToRight = e.gamma;
			var frontToBack = e.beta;
			// alpha is the compass direction the device is facing in degrees
	    	var direction = e.alpha
	    	console.log('leftToRight : ', e)
		}, false);
	}
});