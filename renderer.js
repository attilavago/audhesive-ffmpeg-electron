// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer
const chooseLeftBtn = document.getElementById('left-trigger')
const chooseRightBtn = document.getElementById('right-trigger')
const chooseDestBtn = document.getElementById('chooseDest')

window.$ = window.jQuery = require('jquery');
var slick = require('slick-carousel');
const path = require('path');
var ffmpeg = require('ffmpeg-static').path.replace('app.asar', 'app.asar.unpacked');
console.log(ffmpeg);


// slick stage slider    
$('.main-content').slick({
    arrows: false,
    draggable: true,
    adaptiveHeight: true,
    infinite: false
});

var leftSoundsArray = [];
var rightSoundsArray = [];
var folder_path = '';

// add files to left pool

chooseLeftBtn.addEventListener('click', function (event) {
  ipc.send('open-left-dialog')
})
ipc.on('selected-left-directory', function (event, leftpath) {
    for(let i = 0; i < leftpath.length; i++){
        leftSoundsArray.push(leftpath[i]);
        $('#left-file-pool > .files').append(`<p data-source="${leftpath[i]}">${path.basename(leftpath[i])}</p>`);
    }
    console.log(leftSoundsArray);
    $('#left > .fileCounter > .counter').empty();
    $('#left-file-pool > .instruction > h4').fadeOut();
    $('#left-file-pool > .instruction').removeClass('instruction').appendTo('#left-file-pool').addClass('barcontrols');
    $('#left-remove').show();
    $('#left > .fileCounter > .counter').append(leftSoundsArray.length);
    if(leftSoundsArray.length == rightSoundsArray.length){
      $('#left > .fileCounter > .error').empty();
      $('#right > .fileCounter > .error').empty();
      setTimeout(function(){
        $('.main-content').slick('slickNext');
      }, 1000);
    } else if(leftSoundsArray.length < rightSoundsArray.length) {
      $('#left > .fileCounter .error').append('You need to add more files.');
    } else if(leftSoundsArray.length > rightSoundsArray.length) {
      $('#right > .fileCounter .error').append('You need to add more files.');
    }
}); 

// add files to right pool

chooseRightBtn.addEventListener('click', function (event) {
  ipc.send('open-right-dialog')
})
ipc.on('selected-right-directory', function (event, rightpath) {
    for(let i = 0; i < rightpath.length; i++){
        rightSoundsArray.push(rightpath[i]);
        $('#right-file-pool > .files').append(`<p data-source="${rightpath[i]}">${path.basename(rightpath[i])}</p>`);
    }
    console.log(rightSoundsArray);
    $('#right > .fileCounter > .counter').empty();
    $('#right-file-pool > .instruction > h4').fadeOut();
    $('#right-file-pool > .instruction').removeClass('instruction').appendTo('#right-file-pool').addClass('barcontrols');
    $('#right-remove').show();
    $('#right > .fileCounter > .counter').append(rightSoundsArray.length);
    if(leftSoundsArray.length == rightSoundsArray.length){
      $('#left > .fileCounter > .error').empty();
      $('#right > .fileCounter > .error').empty();
      setTimeout(function(){
        $('.main-content').slick('slickNext');
      }, 1000);
    } else if(leftSoundsArray.length < rightSoundsArray.length) {
      $('#left > .fileCounter .error').append('You need to add more files.');
    } else if(leftSoundsArray.length > rightSoundsArray.length) {
      $('#right > .fileCounter .error').append('You need to add more files.');
    } 
}) 

chooseDestBtn.addEventListener('click', function (event) {
  ipc.send('choose-destination')
})
ipc.on('selected-destination-directory', function (event, path) {
    $('#chosenPath').append(path);
    folder_path = path;
    setTimeout(function(){
        $('.main-content').slick('slickNext');
    }, 1000);
})

// file remove triggers
$('#left-remove').click(function(){
  $('#left-file-pool > .files').empty();
  leftSoundsArray = [];
  $('#left > .fileCounter > .counter').empty();
  $('#left > .fileCounter > .counter').append(leftSoundsArray.length);
});

$('#right-remove').click(function(){
  $('#right-file-pool > .files').empty();
  rightSoundsArray = [];
  $('#right > .fileCounter > .counter').empty();
  $('#right > .fileCounter > .counter').append(rightSoundsArray.length);
});

const fffmpeg = require('fluent-ffmpeg');
var audioconcat = require('audioconcat');
fffmpeg.setFfmpegPath(ffmpeg);


$('#mergeFiles').on('click', function(){
    var soundPair = [];
    var progressBit = 100 / leftSoundsArray.length;
    for(let i = 0; i < leftSoundsArray.length; i++){
        soundPair.push(leftSoundsArray[i]);
        var leftFileName = path.basename(leftSoundsArray[i]).replace(/\.[^/.]+$/, "");
        soundPair.push(rightSoundsArray[i]);
        var rightFileName = path.basename(rightSoundsArray[i]).replace(/\.[^/.]+$/, "");
        audioconcat(soundPair)
            .concat(`${folder_path}/${leftFileName}_${rightFileName}.mp3`)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                
            })
            var newProgressVal = $('progress').val() + progressBit; 
            $('progress').val(newProgressVal);
            $('#outputFiles').append(`<p>${folder_path}/${leftFileName}_${rightFileName}.mp3</p>`);
            soundPair = [];
    }
});

