<template>
  <div id="player">
    <audio id="audio" @timeupdate="time = $event.target.currentTime" controls>
      <source src="./purusha-sukta.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <br/>
    <!-- <p>{{ trackCurrentTime }}</p> -->
    <!-- <ul>
      <li v-for="(line, index) in subtitleLines" :key="index">
        {{ subtitle }} 
        {{ line.start }} - {{ line.end }} : {{ line.text }}
      </li>
    </ul> -->
    <p style="background: 'aliceblue'; width: 100%; font-size: x-large; text-align: center;">
      {{ subtitle }}
    </p>
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
      subtitleVtt: 'https://gist.githubusercontent.com/psgganesh/16ab9d4978c3945cc96f5962e4220041/raw/b63a11f3712a0611eae1e13d9fb9de98d1f0fea5/transcript.vtt',
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
    highlightActiveClass(line) {
      console.log(line);
      return 0;
    }
  }
};
</script>


<style>
audio {
  width: 100%;
  border-radius: 0px;
  background: #f1f3f4;
}
</style>