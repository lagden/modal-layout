# Modal Layout [![Build Status](https://travis-ci.org/lagden/modal-layout.svg?branch=master)](https://travis-ci.org/lagden/modal-layout)

> Modal your way

## Install

Via [Bower](http://bower.io/)

```
bower install modal-layout
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
