// ==UserScript==
// @name        greasetools
// @description Functions and other tools for GreaseMonkey UserScript development.
// @version     0.1.0
// @author      Adam Thompson-Sharpe
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==
(()=>{"use strict";var e,t={};e=t,Object.defineProperty(e,"__esModule",{value:!0}),e.configGetProxy=e.configProxy=e.getConfigValues=void 0,e.getConfigValues=function(e){return new Promise((t=>{const o=e;let n={};for(const e of Object.keys(o))n[e]=!1;const r=()=>{Object.values(r).every((e=>e))&&t(o)};for(const e of Object.keys(n))GM.getValue(e).then((async t=>{void 0!==t?(o[e]=t,n[e]=!0):(await GM.setValue(e,o[e]),n[e]=!0),r()}))}))},e.configProxy=function(e,t){return new Proxy(e,{set(e,o,n){if(o in e){const r=GM.setValue(o,n);return t&&t(r),Reflect.set(e,o,n)}return!1}})},e.configGetProxy=function(e){return new Proxy(e,{get:(e,t)=>new Promise(((o,n)=>{t in e?GM.getValue(t).then((e=>{void 0!==e?o(e):n()})):n()})),set:()=>!1})},window.GreaseTools=t})();