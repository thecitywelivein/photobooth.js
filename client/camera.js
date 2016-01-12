navigator.getUserMedia = navigator.webkitGetUserMedia ||
                         navigator.getUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia;

window.URL = window.URL || 
             window.webkitURL;

var video = document.getElementById('camera');
var canvas = document.getElementById('photo').getContext('2d');
var countown_sec = 3;
var feed;

function startCam() {
  setStage();
  navigator.getUserMedia({video: true}, gotStream, function(){});
};

function setStage(){
  $('.turn-on-camera').remove();
  $("body").css("background-color", "#000");
  $('.live-video').fadeIn();
}

function startCountdown(){
  document.getElementById("countdown").innerHTML = countown_sec;
  $('.take-picture-button').fadeOut();
  $('#countdown').css("display","inherit");
  
  (function tick(){
    setTimeout(function(){
      var count = document.getElementById("countdown");
      count.innerHTML = parseInt(count.innerHTML)-1;
      if(count.innerHTML === "0"){
        count.innerHTML = "";
        document.getElementById("camera").remove();
        capture();
      } else tick();
    },1000)
  })()
}

function gotStream(stream) {
  feed = stream;
  video.src = window.URL.createObjectURL(feed);
}

function capture() {  
  var context = photo.getContext('2d');
  photo.width = 640;
  photo.height = 480;
  context.drawImage(video, 0, 0, 640, 480);

  window.baseImage = photo.toDataURL('image/jpeg');
  var image = {};
  image.data = window.baseImage;
  feed.getVideoTracks()[0].stop();
  image = JSON.stringify(image);

  $.ajax({
    "url": "http://localhost:3000/photo",
    "headers": {"content-type": "application/json"},
    "method": "POST",
    "data": image
  }).done(function (response) {  
    if(navigator.userAgent.toLowerCase().indexOf('firefox') < 0){
      $(".download-image-button").animate({ opacity: 100 });
      $(".download-image-button").click(function() {
        var fName = response.match(/\w+\./);
        var dl = document.createElement('a');
        dl.setAttribute('href', baseImage);
        dl.setAttribute('download', fName + 'jpg');
        dl.click();
      });
    }
  });
}
