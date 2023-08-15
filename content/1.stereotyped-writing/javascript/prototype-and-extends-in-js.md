---
title: JS中的原型与继承
---

# JS中的原型与继承

::alert
为什么要有原型？JS设计之初没有Class的概念，所以使用了构造函数+原型实现继承机制(es6的class可以看作语法糖)
::

```javascript
function Person(name){
  this.name = name;
}

const p = new Person('jack');
```

构造函数创建实例的过程 (模拟new操作符)：

```javascript
function new(constructor){
  return (...args) => {
    const obj = Object.create(constructor.prototype);
    // not standard
    obj.__proto__ = constructor.prototype;
    constructor.call(obj, ...args);
    return obj;
  }
}

function Person(name){
  this.name = name;
}

const constructor = new(Person);
const p = constructor('jack');
```

## 原型与原型链

### 原型

js每个函数在创建的时候，都会有一个prototype属性，这个属性指向一个对象，这个对象就是原型对象，原型对象中有一个constructor属性，指向函数本身。

```javascript
function Person() {}
const p = Person.prototype
p.constructor === Person // true
```

![image.png](https://s2.loli.net/2023/08/15/CU72okj1IENK9yw.webp)

### `__proto__`

::alert
`__proto__`不是一个标准属性，是各大浏览器厂商添加的私有属性。一般可以用`Object.getPrototypeOf`获取实例对象原型。
::

从上面构造函数创建实例的过程可以看出来，我们新建的对象的原型对象指向构造函数的prototype。而在实例对象中，我们可以通过`Object.getPrototypeOf`获取实例的原型。

每个对象都有一个`__proto__`属性，指向创建它的构造函数的原型对象。由于原型对象(prototype)本身也是一个对象，因此它也存在一个`__proto__`指向自己构造函数的原型对象。当访问一个对象的某个属性时，会先在这个对象本身上查找，如果没找到，则会到它的`__proto__`上找该属性，如果还没找到，就会在它构造函数的原型对象的`__proto__`上找。这样一层一层向上查找形成的链式结构我们称为原型链。

### 原型的尽头

js中函数实际上也是一个对象，因此每个函数实际上都是一个函数对象。而只要是对象就会有自己的原型对象。因此对于一个函数：

```js
function A() {}

// eslint-disable-next-line no-proto
A.__proto__ === Function.prototype;
```

每个函数对象的原型对象都是`Function.prototype`。

而`Function.prototype`也是一个对象，因此它也有一个原型对象。

```js
// eslint-disable-next-line no-proto
Function.prototype.__proto__ === Object.prototype;
```

Function的prototype的原型指向Object.prototype。而Object.prototype的原型：

```js
// eslint-disable-next-line no-proto
Object.prototype.__proto__ === null;
```

最终指向null。原型链的尽头为null。

## 容易困惑的点

::list{type="info"}
`Object.__proto__ === Function.prototype`因为Object本身是一个函数对象，是通过`new Function()`创建的。这恒河里

`Function.__proto__ === Function.prototype`因为Function自身也是一个函数对象，它也是通过`new Function()`创建出来的，因此它的原型对象指向它自己。这也恒河里

`Function.prototype.__proto__ === Object.prototype`因为Function.prototype实际上也是一个对象，也就是它是由`new Object()`创建出来的，所以实例的`__proto__`指向构造函数的`prototype`。嗯，河里
::

总之，`构造函数.prototype === 实例.__proto__`，而对于构造函数，它本身也是一个函数对象，因此我们也可以把它当作一个实例对象去分析。最终的原型对象指向的都是`Object.prototype.__proto__`，即`null`，保证原型链有一个终点。