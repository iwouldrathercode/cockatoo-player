# cockatoo-player 🦜
> Current HTML5 supports subtitle only for video. This package specifically supports subtitles for audio.

## Dependencies :sparkles:
- [axios](https://www.npmjs.com/package/axios)
- [subtitle.js](https://www.npmjs.com/package/subtitle)

```javascript
import Vue from 'vue'
import CockatooPlayer from 'cockatoo-player'

Vue.use(CockatooPlayer)
```

Somewhere on your HTML / Vue Template
```javascript
<cockatoo-player
  track="https://tamilfiles.xyz/songs/Kolamavu%20Kokila/Kalyaana%20Vayasu.mp3"
  transcript="https://gist.githubusercontent.com/psgganesh/fcd058c2ecef5688429cf611facbeee6/raw/fa58768e39074bc2cd4ea97e6fbf510754b9a1f3/music-transcript.vtt"
  colors="active-maroon"
/>
```

## Output

<img src="https://i.imgur.com/ggj5wi3.png" />

## Todo
- [ ] Remove axios
