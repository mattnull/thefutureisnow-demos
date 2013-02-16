/**
 * Notifications API Demo
 * @author Matt Null - http://github.com/mattnull
 */
 
var NotificationsDemo = (function(){
	$('#allow-notifications').on('click', function(){
	    // if we do not have permission, ask for it
	    // 0 means we have permissions (I know its weird)
	    if(window.webkitNotifications.checkPermission() !== 0){
	        window.webkitNotifications.requestPermission();
	    }
	    else{
		    var notification = window.webkitNotifications.createNotification('icon.png', 'HORRAY!','You have notifications enabled!');
		    notification.show();
		}
	});
});
