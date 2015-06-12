/*!
 * Utility
 * Some helpers
 * http://lagden.github.io/modal-layout
 * MIT license
 */
/* global define */
(function(window, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.utility = factory();
  }
}(window, function() {
  var animationEvent, detect, escapeHtml, isElement, objectAssign, transitionEvent;
  detect = function(lista, d) {
    var item;
    while (lista.length) {
      item = lista.shift();
      if (d.documentElement.style[item[0]] !== void 0) {
        return item;
      }
    }
    return lista[0];
  };
  transitionEvent = function(d) {
    var VENDOR;
    VENDOR = [
      [
        'transition',
        'transitionend'
      ],
      [
        'MozTransition',
        'mozTransitionEnd'
      ],
      [
        'OTransition',
        'oTransitionEnd'
      ],
      [
        'webkitTransition',
        'webkitTransitionEnd'
      ]
    ];
    return detect(VENDOR, d)[1];
  };
  /* Animation
   * 1 = Start
   * 2 = Iteration
   * 3 = End
   */
  animationEvent = function(d) {
    var VENDOR;
    VENDOR = [
      [
        'animation',
        'animationstart',
        'animationiteration',
        'animationend'
      ],
      [
        'MozAnimation',
        'mozAnimationStart',
        'mozAnimationIteration',
        'mozAnimationEnd'
      ],
      [
        'OAnimation',
        'oAnimationStart',
        'oAnimationIteration',
        'oAnimationEnd'
      ],
      [
        'webkitAnimation',
        'webkitAnimationStart',
        'webkitAnimationIteration',
        'webkitAnimationEnd'
      ]
    ];
    return detect(VENDOR, d);
  };
  objectAssign = function(a, b) {
    var prop;
    for (prop in b) {
      a[prop] = b[prop];
    }
    return a;
  };
  isElement = function(v) {
    if (typeof HTMLElement === 'object') {
      return v instanceof HTMLElement;
    } else {
      return v && typeof v === 'object' && v.nodeType === 1 && typeof v.nodeName === 'string';
    }
  };
  escapeHtml = function(html) {
    return String(html).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  return {
    'transitionEvent': transitionEvent,
    'animationEvent': animationEvent,
    'objectAssign': objectAssign,
    'isElement': isElement,
    'escapeHtml': escapeHtml
  };
}));
