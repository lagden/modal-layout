# Modal Layout 
[![NPM version](https://img.shields.io/npm/v/modal-layout.svg)](https://www.npmjs.com/package/modal-layout)
[![Build Status](https://travis-ci.org/lagden/modal-layout.svg?branch=master)](https://travis-ci.org/lagden/modal-layout)
[![Dependency Status](https://david-dm.org/lagden/modal-layout.svg)](https://david-dm.org/lagden/modal-layout) 
[![devDependency Status](https://david-dm.org/lagden/modal-layout/dev-status.svg)](https://david-dm.org/lagden/modal-layout#info=devDependencies) 

> Modal your way


## Install

Via [NPM](https://www.npmjs.com/)

```
npm i modal-layout --save
```

Via [Bower](http://bower.io/)

```
bower install modal-layout --save
```


## Usage

```javascript
var m = new ModalLayout('Awesome stuff!');

m.on('open', function(modalInstance) {
  console.log('modal is open', modalInstance);
});
m.open()
```

## Api

```
ModalLayout(content [, opts])
```

---

### Parameters

#### content

`HTMLElement` or `string`.

#### opts

| Options | Default | Description |
| ----------- | ----------- | ----------- |
| esc | `true` | close modal pressing `esc` |
| beforeOpen | `null` | call a method before open modal |
| prefix | `'modalLayout'` | prefix used in your css |
| escape | `false` | escape content html |

---

### Methods

| Methods | Description |
| ----------- | ----------- |
| open | show modal |
| close | hide modal |
| destroy | destroy modal |
| isOpen | check if modal is opened |

---

### Events

| Events |
| ----------- |
| open |
| close |
| destroy |


## License

MIT © [Thiago Lagden](http://lagden.in)
