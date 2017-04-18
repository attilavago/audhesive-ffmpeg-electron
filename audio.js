const ffmpeg = require('fluent-ffmpeg');
var audioconcat = require('audioconcat');
ffmpeg.setFfmpegPath('./ffmpeg');
 
var songs = [
  './audios/audio1.mp3',
  './audios/audio2.mp3'
]

audioconcat(songs)
  .concat('./audios/all.mp3')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Audio created in:', output)
  })