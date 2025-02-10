---
title: Promise微任务
---

# Promise微任务 <Badge type="info" text="字节" />

> [!TIP]
> 相关问题：[关于 Promise 规范与执行顺序的问题？](https://segmentfault.com/q/1010000042029009)

## 决议

当一个Promise执行它的resolve或reject时，该Promise会被决议。一个Promise被决议后，该Promise状态不会再改变。

## NewPromiseReactionJob

当Promise决议后执行then()中回调时，或当then()注册时Promise已决议，会产生这种微任务（即普通的Promise）

```javascript
Promise.resolve(1).then(res => console.log(res))
```

`res => console.log(res)`运行在这种微任务中

会将该微任务加入微任务队列中。`NewPromiseReactionJob`内部会执行：

1. 执行handler, handler就是then()中注册的回调，得到返回结果
2. 对then()中产生的新Promise执行resolve(returnValue)或reject(returnValue)

## NewPromiseResolveThenableJob

调用resolve()传递的参数值如果是一个thenable对象（如果一个对象的then属性可以被调用（是一个函数），那么这个对象就是thenable对象），就会产生`NewPromiseResolveThenableJob`类型微任务。

这种微任务会产生如下代码：

```javascript
// resolve 和 reject 是调用resolve(thenable)时那个Promise上的
thenable.then(resolve,reject)
```

结合第一种微任务，如果thenable对象是Promise，则该微任务执行后又会产生第一种微任务。规范上的解释：

> This Job uses the supplied thenable and its `then` method to resolve the given promise. This process must take place as a Job to ensure that the evaluation of the `then` method occurs after evaluation of any surrounding code has completed.

要确保周围的同步代码执行完后才会执行这个。

关于设计意图：thenable对象不一定是Promise实例，可能是任何对象`eg.{ then:()=>{} }`，如果该对象的then是同步方法，这么做可以保证then的执行顺序也是在微任务中。

---

```javascript
// promise1
new Promise((resolve) => {
  resolve(
    // promise2
    new Promise((resolve) => {
      resolve(1)
    })
  )
}).then(res => {
  console.log('1')
});

// promise3
new Promise((resolve) => {
  resolve(2)
}).then(() => {
  console.log('2')
}).then(() => {
  console.log('3')
}).then(() => {
  console.log('4')
})
```

代码执行完后，微任务队列内容：

```javascript
const microTask = [
    function job1(){
        // promise1
        // NewPromiseResolveThenableJob
        // 调用resolve()传递的参数值是一个thenable对象
        promise2.then(promise1.Resolve, promise1.Reject)
    },
    function job2(){
        // promise3
        // NewPromiseReactionJob
        // 执行handler
        const handler = () => {
            console.log('2')
        }

        // 对then()中产生的新Promise执行resolve(handler())或reject(handler())
        // 决议then()返回新的Promise
        resolve(handler(2))
    }
]
```

之后开始执行微任务队列。job1执行后产生新的job3：

```javascript
const microTask = [
    function job2(){
        const handler = () => {
            console.log('2') // 2
        }
        resolve(handler(2))
    },
    function job3(){
        const handler = promise1.Resolve;
        resolve(handler(1))
    }
]
```

job2执行后输出`2`，产生新的job4：

```javascript
const microTask = [
    function job3(){
        const handler = promise1.Resolve;
        resolve(handler(1))
    },
    function job4(){
        const handler = () => {
            console.log('3')
        }

        resolve(handler(undefined))
    }
]
```

job3的执行会让promise1决议，之后开始执行promise1的then回调，产生新的job5：

```javascript
const microTask = [
    function job4(){
        const handler = () => {
            console.log('3') // 3
        }

        resolve(handler(undefined))
    },
    function job5(){
        const handler = () => {
            console.log('1')
        }

        resolve(handler(1))
    }
]
```

job4执行后会产生job6：

```javascript
const microTask = [
    function job5(){
        const handler = () => {
            console.log('1') // 1
        }

        resolve(handler(1))
    },
    function job6(){
        const handler = () => {
            console.log('4') // 4
        }

        resolve(handler(undefined))
    }
]
```

此时微任务对列执行完后不会再产生新的任务
