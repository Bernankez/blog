---
title: JS闭包
---

# JS闭包

### 是什么

**闭包就是一个函数及其词法环境的组合**（或者说及其捆绑的周边环境状态的引用的组合）

### 能干什么

**闭包可以让你在一个内层函数中访问到其外层函数的作用域**

### 为什么会产生闭包

内部函数存在对外部函数局部变量的引用就会导致闭包

### Example

```js
function useCount() {
  let counter = 0;

  function add() {
    counter++;
  }

  function reduce() {
    counter--;
  }

  return {
    add,
    reduce,
    get count() {
      return counter;
    }
  };
}

const counter = useCount();
const { add, reduce } = counter;
console.log(counter.count); // 0
add();
add();
console.log(counter.count); // 2
```

当我们执行`add()`的时候，虽然已经不在`useCount`这个函数内，但`add`仍然能访问到`useCount`内部的`counter`，这就是闭包。