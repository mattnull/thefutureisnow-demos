var VideoChat = function(userid){
    var video = $('video')[0];
    var userVideo = $('#my-video-canvas')[0];
    var userCtx = userVideo.getContext('2d'); 
    var friendVideo = $('#friend-video')[0];
    var friendCtx = friendVideo.getContext('2d'); 
    var userID = userid || false;

    var audio = $('audio')[0];

    return {

        start : function(){
            var self = this;

            this.getUserMedia();
            socket.on('videoStream', function(data){
                self.streamFriendVideo(data)
            });

            $('#video-modal').on('hide', function(){
                self.stopVideoChat();
            });
            this.resizeCanvas();
        },

        //access the camera
        getUserMedia : function(){
            var self = this;
            if(navigator.webkitGetUserMedia){
                navigator.webkitGetUserMedia({video:true, audio:true}, function(stream) {
                    video.src = window.webkitURL.createObjectURL(stream)
                    self.startVideoChat();
                },
                function(err){
                    console.log('ERROR : ' + err)
                });
            }
        },

        //start the interval that updates the server and canvas
        startVideoChat : function(){
            var self = this;
            this.resizeCanvas()
            this.streamInterval = setInterval(function(){
                self.stream();
            }, 50);
        },

        //kill the interval
        stopVideoChat : function(){
            clearInterval(this.streamInterval);
        },

        //draw the snapshot on our canvas and send data to the server
        stream : function(){
            console.log('streaming to ' + userID)
            userCtx.drawImage(video, 0, 0)
            dataUrl = userVideo.toDataURL('image/webp');
            //sends our data to the server
            socket.emit('streamVideo', {to : userID, stream : dataUrl})
        },

        streamFriendVideo : function(data){
            var img = new Image();            
            img.src = data.stream;
            img.onload = function() {
                friendCtx.drawImage(img, 0, 0);
            };
        },

        resizeCanvas: function(){
            setTimeout(function(){
                userVideo.width = video.videoWidth;
                userVideo.height = video.videoHeight;
                friendVideo.width = video.videoWidth;
                friendVideo.height = video.videoHeight;
            }, 150)
        },

        // Audio

        streamAudio : function(data){
            audio.src = data.stream;
        }
    }
};