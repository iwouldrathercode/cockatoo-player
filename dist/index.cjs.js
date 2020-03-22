'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var subtitle = require('subtitle');

//
var script = {
  name: "CockatooPlayer",
  props: {
    track: {
      type: String,
      default: "https://tamilfiles.xyz/songs/Kolamavu%20Kokila/Kalyaana%20Vayasu.mp3"
    },
    transcript: {
      type: String,
      default: "https://gist.githubusercontent.com/psgganesh/fcd058c2ecef5688429cf611facbeee6/raw/fa58768e39074bc2cd4ea97e6fbf510754b9a1f3/music-transcript.vtt"
    },
    align: {
      type: String,
      default: "center"
    },
    colors: {
      type: String,
      default: "active"
    },
    size: {
      type: String,
      default: "default"
    }
  },
  data: function data() {
    return {
      time: 0,
      end: 0,
      subtitleLines: []
    };
  },
  mounted: function mounted() {
    this.setup();
  },
  computed: {
    subtitle: function subtitle$$1() {
      var line = this.subtitleLines.filter(function (el) {
        var absoluteTime = Math.abs(this.time * 1000);

        if (absoluteTime >= el.start && absoluteTime <= el.end) {
          return el;
        }
      }.bind(this));
      return line.length > 0 ? line.pop().text : '';
    }
  },
  methods: {
    setup: function setup() {
      return new Promise(function ($return, $error) {
        var vttResponse;
        vttResponse = null;
        return Promise.resolve(axios.get(this.transcript).then(function (response) {
          // handle success
          vttResponse = subtitle.parse(response.data);
        }).catch(function (error) {
          // handle error
          console.log(error);
        }).then(function () {//
        })).then(function ($await_1) {
          try {
            this.subtitleLines = vttResponse;
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    },
    seek: function seek(line) {
      this.$refs.audio.currentTime = Math.abs(line.start / 1000);
      this.end = line.end;
      this.$refs.audio.play();
    },
    updateTimeSprites: function updateTimeSprites(event) {
      this.time = event.target.currentTime;

      if (this.end !== 0) {
        if (Math.abs(this.time * 1000) >= this.end + 100) {
          this.$refs.audio.pause();
          this.end = 0;
          this.$refs.audio.currentTime = 0;
        }
      }
    },
    activeColor: function activeColor(subtitle$$1, line) {
      var classNames = ['line'];
      var colorName = subtitle$$1 === line.text ? this.colors : '';
      classNames.push(colorName);
      return classNames.join(' ');
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"player"}},[_c('audio',{ref:"audio",attrs:{"id":"audio","controls":"","controlsList":"nodownload"},on:{"timeupdate":_vm.updateTimeSprites}},[_c('source',{attrs:{"src":_vm.track,"type":"audio/mpeg","preload":"auto"}}),_vm._v("\n    Your browser does not support the audio element.\n  ")]),_vm._v(" "),_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.subtitleLines.length > 0),expression:"subtitleLines.length > 0"}],class:['pad','align--'+_vm.align, 'size--'+_vm.size ]},_vm._l((_vm.subtitleLines),function(line,index){return _c('li',{key:index,class:_vm.activeColor(_vm.subtitle, line),on:{"click":function($event){return _vm.seek(line)}}},[_vm._v("\n      "+_vm._s(line.text)+"\n    ")])}),0),_vm._v(" "),_vm._t("default")],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-7d6d2f57_0", { source: "#player{width:100%}audio{width:100%;border-radius:0;background:#f1f3f4;user-select:none;outline:0}.pad{list-style-type:none;padding:0;margin:0;font-size:-webkit-xxx-large;font-family:sans-serif}.line{color:#ccc;user-select:none}.line:hover{cursor:pointer;background:#f1f3F459}.line.active{color:#696969}.line.active-red{color:#ff4500}.line.active-green{color:green}.line.active-blue{color:#4169e1}.line.active-yellow{color:#ff0}.line.active-maroon{color:maroon}.size--medium{font-size:medium}.size--large{font-size:large}.size--larger{font-size:larger}.size--default{font-size:-webkit-xxx-large}.align--left{text-align:left}.align--center{text-align:center}.align--right{text-align:right}", map: undefined, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var CockatooPlayer = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var index = {
  install: function install(Vue, options) {
    Vue.component("cockatoo-player", CockatooPlayer);
  }
};

module.exports = index;
