var VideoChat = function(userid){
    var localVideo = $('#local-video')[0];
    var userVideo = $('#local-canvas')[0];
    var userCtx = userVideo.getContext('2d'); 
    var remoteVideo = $('#remote-video')[0];
    var remoteCtx = friendVideo.getContext('2d'); 
    var userID = userid || false;

    var audio = $('audio')[0];

    return {

        start : function(){
            var self = this;

            this.getUserMedia();
            socket.on('videoStream', function(data){
                self.streamRemoteVideo(data)
            });

            $('#video-modal').on('hide', function(){
                self.stopVideoChat();
            });
            this.resizeCanvas();
        },

        //access the camera
        getUserMedia : function(){
            var self = this;
            self.streamObj = false;
            if(navigator.webkitGetUserMedia){

                navigator.webkitGetUserMedia({video:true, audio:true}, function(stream) {
                    console.log('has')
                    localVideo.src = window.webkitURL.createObjectURL(stream);
                    self.startVideoChat();
                    self.streamObj = stream;
                },
                function(err){
                    console.log('ERROR : ' + err)
                });
            }
        },

        //start the interval that updates the server and canvas
        startVideoChat : function(){
            var self = this;
            // this.resizeCanvas()
            this.streamInterval = setInterval(function(){
                self.stream();
            }, 50);
        },

        //kill the interval
        stopVideoChat : function(){
            console.log(this.streamObj)
            this.streamObj.stop();
            clearInterval(this.streamInterval);
        },

        //draw the snapshot on our canvas and send data to the server
        stream : function(){
            console.log('streaming to ' + userID)
            userCtx.drawImage(video, 0, 0)
            videoURI = userVideo.toDataURL('image/webp');
            //sends our data to the server
            socket.emit('streamVideo', {to : userID, stream : this.streamObj})
        },

        streamRemoteVideo : function(data){
            var img = new Image();            
            img.src = data.stream;
            img.onload = function() {
                friendCtx.drawImage(img, 0, 0);
            };
        },

        resizeCanvas: function(){
            setTimeout(function(){
                localVideo.width = localVideo.videoWidth;
                localVideo.height = localVideo.videoHeight;
                remoteVideo.width = localVideo.videoWidth;
                remoteVideo.height = localVideo.videoHeight;
            }, 150)
        },

        // Audio

        // streamAudio : function(data){
        //     audio.src = data.stream;
        // }
    }
};