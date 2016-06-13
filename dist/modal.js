'use strict';
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

(function(window, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['eventEmitter/EventEmitter', 'lagden-utils/dist/index'], function(EventEmitter, lagdenUtils) {
      return factory(window, EventEmitter, lagdenUtils);
    });
  } else {
    window.ModalLayout = factory(window, window.EventEmitter, window.lagdenUtils);
  }
})(window, function(window, EventEmitter, lagdenUtils) {
  var GUID, Modal, doc, docBody, head;
  console.log(lagdenUtils);
  GUID = 0;
  doc = window.document;
  head = doc.head || doc.getElementsByTagName('head')[0];
  docBody = doc.body || doc.querySelector('body');
  return Modal = (function(superClass) {
    extend(Modal, superClass);

    function Modal(content, opts) {
      var contentIsStr, r, render;
      if (opts == null) {
        opts = {};
      }
      this.id = ++GUID;
      this.opts = {
        esc: true,
        beforeOpen: null,
        prefix: 'modalLayout',
        escape: false
      };
      lagdenUtils.extend(this.opts, opts);
      this.opts.box = "" + this.opts.prefix;
      this.content = content;
      if (lagdenUtils.isElement(this.content)) {
        contentIsStr = false;
      } else if (typeof this.content === 'string' && this.content !== '') {
        contentIsStr = true;
        if (this.opts.escape) {
          this.content = lagdenUtils.escapeHtml(this.content);
        }
      } else {
        throw 'content must be a HTMLElement or string';
      }
      r = {
        id: this.id,
        box: this.opts.box,
        content: contentIsStr ? this.content : ''
      };
      render = this.template().replace(/\{(.*?)\}/g, function(a, b) {
        return r[b];
      });
      docBody.insertAdjacentHTML('beforeend', render);
      this.box = doc.querySelector("#modalLayoutBox" + this.id);
      if (contentIsStr === false) {
        this.box.appendChild(this.content);
      }
      this.keyCodes = {
        esc: 27
      };
      if (this.opts.esc === true) {
        this.box.addEventListener('keyup', this, false);
      }
      this.modalOpen = this.opts.prefix + "-" + this.id + "--open";
      this._style();
    }

    Modal.prototype._style = function() {
      var css;
      css = "." + this.modalOpen + "{overflow: hidden;}";
      this.styl = doc.createElement('style');
      this.styl.type = 'text/css';
      if (this.styl.styleSheet) {
        this.styl.styleSheet.cssText = css;
      } else {
        this.styl.appendChild(doc.createTextNode(css));
      }
      head.appendChild(this.styl);
    };

    Modal.prototype._toogle = function(m) {
      docBody.classList[m](this.modalOpen);
      this.box.classList[m](this.opts.box + "--open");
    };

    Modal.prototype.template = function() {
      return ['<div id="modalLayoutBox{id}" tabindex="0" class="{box}">', '{content}', '</div>'].join('');
    };

    Modal.prototype.onKeyUp = function(event) {
      if (event.keyCode === this.keyCodes.esc) {
        this.close();
      }
    };

    Modal.prototype.isOpen = function() {
      return docBody.classList.contains(this.modalOpen);
    };

    Modal.prototype.open = function() {
      if (this.isOpen() === false) {
        if (typeof this.opts.beforeOpen === 'function') {
          this.opts.beforeOpen(this, this.box);
        }
        this._toogle('add');
        this.box.focus();
        this.emitEvent('open', [this]);
      }
    };

    Modal.prototype.close = function() {
      if (this.isOpen() === true) {
        this._toogle('remove');
        this.emitEvent('close', [this]);
      }
    };

    Modal.prototype.destroy = function() {
      head.removeChild(this.styl);
      if (this.opts.esc === true) {
        this.box.removeEventListener('keyup', this, false);
      }
      docBody.removeChild(this.box);
      this.emitEvent('destroy');
    };

    Modal.prototype.handleEvent = function(event) {
      switch (event.type) {
        case 'keyup':
          this.onKeyUp(event);
      }
    };

    return Modal;

  })(EventEmitter);
});
