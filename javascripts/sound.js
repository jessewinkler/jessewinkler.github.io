var Sound = (function($) {
  var format = ".mp3"; // $.browser.webkit ? ".mp3" : ".wav";
  var soundPath = "sounds/";
  var sounds = [];

  function loadSoundChannel(name) {
    var sound = $('<audio />').get(0);
    sound.src = soundPath + name + format;

    return sound;
  }
  function SoundIndex(name)
  {
	for(var i=0;i<sounds.length;i++)
	{
		if (sounds[i].name = name)
		{
			return i;
			}
	}
	return -1;
  }
  function PruneSounds()
  {
	var replace = [];
	for(var i=0;i<sounds.length;i++)
	{
		if (sounds[i].currentTime == sounds[i].duration || sounds[i].currentTime == 0)
		{
			//don't keep it
		}
		else
		{
			replace.push(sounds[i]);
		}
	}
	sounds = replace;
  }
  
  function Sound(name, maxChannels) {
    return {
	  name: name,
      play: function() {
        Sound.play(name, maxChannels);
      },

      stop: function() {
        Sound.stop(name);
      }
    }
  }

  return $.extend(Sound, {
    Play: function(name, maxChannels) {
      // Note: Too many channels crash browsers
      maxChannels = maxChannels || 4;
	  
      PruneSounds();

      if(sounds.length < maxChannels) {
		  if(SoundIndex(name)==-1) {
			  var sound = [loadSoundChannel(name)];
			  sounds.push(sound);
			  sounds[SoundIndex(name)].push(sound[0]);
			  sound[0].play();
			}
        }
    },

    Stop: function(name) {
      if(SoundIndex(name)!=-1) {
        sounds[SoundIndex(name)][0].pause();
      }
    },
	StopAll: function() {
		for (var i = 0;i<sounds.length;i++)
		{
			sounds[i][0].pause();
		}
	}
  });
}(jQuery));
