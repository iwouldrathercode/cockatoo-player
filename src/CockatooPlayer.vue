<template>
  <div id="player">
    <audio ref="audio" id="audio" @timeupdate="updateTimeSprites" controls controlsList="nodownload">
      <source src="./purusha-sukta.mp3" type="audio/mpeg" preload="auto" />
      Your browser does not support the audio element.
    </audio>
    <ul class="pad">
      <li class="line" v-bind:class="{ active: (subtitle === line.text) }" @click="seek(line)" v-for="(line, index) in subtitleLines" :key="index">
        {{ line.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { parse } from 'subtitle'

export default {
  name: "CockatooPlayer",
  data: () => {
    return {
      time: 0,
      end: 0,
      subtitleVtt: 'https://gist.githubusercontent.com/psgganesh/16ab9d4978c3945cc96f5962e4220041/raw/19b46338647da63862bf835ce08b798fa2efe7ab/transcript.vtt',
      subtitleLines: []
    }
  },
  mounted() {
    this.setup();
  },
  computed: {
    subtitle() {
      let line = this.subtitleLines.filter(function (el) {
        let absoluteTime = Math.abs(this.time *1000);
        if((absoluteTime >= el.start) && (absoluteTime <= el.end)) {
          return el;
        }
      }.bind(this));
      return (line.length > 0) ? line.pop().text : '';
    }
  },
  methods: {
    async setup() {
      let vttResponse = null;
      await axios.get(this.subtitleVtt)
      .then(function (response) {
        // handle success
        vttResponse = parse(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        //
      });
      this.subtitleLines = vttResponse;
    },
    seek(line) {
      this.$refs.audio.currentTime = Math.abs(line.start / 1000);
      this.end = line.end;
      this.$refs.audio.play();
    },
    updateTimeSprites(event) {
      this.time = event.target.currentTime;
      if(this.end !== 0) {
        if(Math.abs(this.time *1000) >= (this.end) + 100) {
          this.$refs.audio.pause();
          this.end = 0;
          this.$refs.audio.currentTime = 0;
        }
      }
    }
  }
};
</script>


<style>
#player {
  width: 100%;
}
audio {
  width: 100%;
  border-radius: 0px;
  background: #f1f3f4;
  user-select: none;
  outline: none;
}
.pad {
  list-style-type: none;
  text-align: center;
  font-size: x-large;
  padding: 0px;
  margin: 0px;
}
.line {
  color: #CCCCCC;
  user-select: none;
  font-size: -webkit-xxx-large;
}
.line:hover {
  cursor: pointer;
  background: #F1F3F459;
}
.line.active {
  color: #444444;
}
</style>