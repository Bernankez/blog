---
title: JS/TS中的AST节点类型示例
---

# JS/TS中的AST节点类型示例

[JavaScript抽象语法树AST](https://juejin.cn/post/6844903798347939853)
[estree](https://github.com/estree/estree/tree/master)

目前仍然缺少很多ts节点定义

之前在写eslint规则的时候，需要去判断AST节点类型，但是有很多AST节点类型的定义我找不到。这里列一些我通过[AST explorer](https://astexplorer.net/)试出来的节点定义（[estree](https://github.com/estree/estree/tree/master)中有js节点定义，但是缺少ts节点定义）。

以下例子中高亮的部分为类型对应的节点（Node）：

### ArrayExpression

## CodeHighlight

code: const a = [];
highlight: '[]'

### ArrayPattern

## CodeHighlight

code: const [ a, b ] = [ 1, 2 ];
highlight: '[ a, b ]'

### ArrowFunctionExpression

## CodeHighlight

code: const a = () => {};
highlight: () => {}

### AssignmentExpression

## CodeHighlight

code: "let a;\na = 1;"
highlight: 'a = 1'

### AssignmentPattern

## CodeHighlight

code: const [a, b = 4] = [1, null];
highlight: b = 4

### AwaitExpression

## CodeHighlight

code: "async function a() {\n
&nbsp;&nbsp;const b = await a();\n
}"
highlight: await a()

### BigIntLiteral

## CodeHighlight

code: const a = 123123n;
highlight: 123123n

### BinaryExpression

## CodeHighlight

code: const a = a + 1;
highlight: a + 1

### BlockStatement

## CodeHighlight

code: '{}'
highlight: '{}'

### BreakStatement

## CodeHighlight

code: "switch(a) {\n
&nbsp;&nbsp;case '1':\n
&nbsp;&nbsp;&nbsp;&nbsp;break;\n
}"
highlight: break

### CallExpression

## CodeHighlight

code: a()
highlight: a()

### CatchClause

## CodeHighlight

code: try{ }catch(e){ }
highlight: catch(e){ }

### ChainExpression

可选链
CodeHighlight

code: a?.a
highlight: a?.a

### ClassBody

## CodeHighlight

code: class Test {}
highlight: '{}'

### ClassDeclaration

## CodeHighlight

code: class Test {}
highlight: class Test {}

### ClassExpression

## CodeHighlight

code: const a = class {};
highlight: class {}

### ConditionalExpression

## CodeHighlight

code: 'const a = b ? c : d;'
highlight: 'b ? c : d'

### ContinueStatement

## CodeHighlight

code: "for(let i = 0; i < 1; i++){\n
&nbsp;&nbsp;continue;\n
}"
highlight: continue

### DebuggerStatement

## CodeHighlight

code: debugger;
highlight: debugger

### Decorator

## CodeHighlight

code: "@component\n
const a = 1;"
highlight: '@component'

### DoWhileStatement

## CodeHighlight

code: do { } while(1)
highlight: do { } while(1)

### EmptyStatement

## CodeHighlight

### ExportAllDeclaration

## CodeHighlight

### ExportDefaultDeclaration

## CodeHighlight

### ExportNamedDeclaration

## CodeHighlight

### ExportSpecifier

## CodeHighlight

### ExpressionStatement

## CodeHighlight

### ForInStatement

## CodeHighlight

### ForOfStatement

## CodeHighlight

### ForStatement

## CodeHighlight

### FunctionDeclaration

## CodeHighlight

### FunctionExpression

## CodeHighlight

### Identifier

### IfStatement

## CodeHighlight

### ImportDeclaration

## CodeHighlight

### ImportDefaultSpecifier

## CodeHighlight

### ImportExpression

## CodeHighlight

### ImportNamespaceSpecifier

## CodeHighlight

### ImportSpecifier

## CodeHighlight

### JSXAttribute

## CodeHighlight

### JSXClosingElement

## CodeHighlight

### JSXClosingFragment

## CodeHighlight

### JSXElement

## CodeHighlight

### JSXEmptyExpression

## CodeHighlight

### JSXExpressionContainer

## CodeHighlight

### JSXFragment

## CodeHighlight
