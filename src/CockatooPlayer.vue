<template>
  <div id="player">
    <audio ref="audio" id="audio" @timeupdate="updateTimeSprites" controls controlsList="nodownload">
      <source :src="track" type="audio/mpeg" preload="auto" />
      Your browser does not support the audio element.
    </audio>
    <ul v-show="subtitleLines.length > 0" :class="['pad','align--'+align, 'size--'+size, ]">
      <li v-bind:class="activeColor(subtitle, line)" @click="seek(line)" v-for="(line, index) in subtitleLines" :key="index">
        {{ line.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { parse }  from 'subtitle';

export default {
  name: "CockatooPlayer",
  props: {
    track: { type: String, default: "https://tamilfiles.xyz/songs/Kolamavu%20Kokila/Kalyaana%20Vayasu.mp3"},
    transcript: { type: String, default: "https://gist.githubusercontent.com/psgganesh/fcd058c2ecef5688429cf611facbeee6/raw/fa58768e39074bc2cd4ea97e6fbf510754b9a1f3/music-transcript.vtt"},
    align: { type: String, default: "center"},
    colors: { type: String, default: "active" },
    size: { type: String, default: "default" },
  },
  data: () => {
    return {
      time: 0,
      end: 0,
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
      vttResponse = await this.makeRequest("GET", this.transcript);
      this.subtitleLines = parse(vttResponse);
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
    },
    activeColor(subtitle, line) {
      let classNames = ['line'];
      let colorName = (subtitle === line.text) ? this.colors: '';
      classNames.push(colorName);
      return classNames.join(' ');
    },
    makeRequest(method, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
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
  padding: 0px;
  margin: 0px;
  font-size: -webkit-xxx-large;
  font-family: sans-serif;
}
.line {
  color: #CCCCCC;
  user-select: none;
}
.line:hover {
  cursor: pointer;
  background: #F1F3F459;
}

.line.active {
  color: dimgray;
}
.line.active-red {
  color: orangered;
}
.line.active-green {
  color: green;
}
.line.active-blue {
  color: royalblue;
}
.line.active-yellow {
  color: yellow;
}
.line.active-maroon {
  color: maroon;
}


/* Sizes */
.size--medium {
  font-size: medium;
}
.size--large {
  font-size: large;
}
.size--larger {
  font-size: larger;
}
.size--default {
  font-size: -webkit-xxx-large;
}

/* Text alignment */
.align--left {
  text-align: left;
}
.align--center {
  text-align: center;
}
.align--right {
  text-align: right;
}
</style>