---
title: JS/TS中的AST节点类型示例
---

# JS/TS中的AST节点类型示例

::alert
Reference: 
<br />
[JavaScript抽象语法树AST](https://juejin.cn/post/6844903798347939853)
<br />
[estree](https://github.com/estree/estree/tree/master)
::

::alert{type="warning"}
目前仍然缺少很多ts节点定义
::

之前在写eslint规则的时候，需要去判断AST节点类型，但是有很多AST节点类型的定义我找不到。这里列一些我通过[AST explorer](https://astexplorer.net/)试出来的节点定义（[estree](https://github.com/estree/estree/tree/master)中有js节点定义，但是缺少ts节点定义）。

---

以下例子中高亮的部分为类型对应的节点（Node）：

### ArrayExpression
::CodeHighlight
---
code: const a = [];
highlight: '[]'
---
::

### ArrayPattern
::CodeHighlight
---
code: const [ a, b ] = [ 1, 2 ];
highlight: '[ a, b ]'
---
::

### ArrowFunctionExpression
::CodeHighlight
---
code: const a = () => {};
highlight: () => {}
---
::

### AssignmentExpression
::CodeHighlight
---
code: "let a;\na = 1;"
highlight: 'a = 1'
---
::

### AssignmentPattern
::CodeHighlight
---
code: const [a, b = 4] = [1, null];
highlight: b = 4
---
::

### AwaitExpression
::CodeHighlight
---
code: "async function a() {\n
&nbsp;&nbsp;const b = await a();\n
}"
highlight: await a()
---
::

### BigIntLiteral
::CodeHighlight
---
code: const a = 123123n;
highlight: 123123n
---
::

### BinaryExpression
::CodeHighlight
---
code: const a = a + 1;
highlight: a + 1
---
::

### BlockStatement
::CodeHighlight
---
code: '{}'
highlight: '{}'
---
::

### BreakStatement
::CodeHighlight
---
code: "switch(a) {\n
&nbsp;&nbsp;case '1':\n
&nbsp;&nbsp;&nbsp;&nbsp;break;\n
}"
highlight: break
---
::

### CallExpression
::CodeHighlight
---
code: a()
highlight: a()
---
::

### CatchClause
::CodeHighlight
---
code: try{ }catch(e){ }
highlight: catch(e){ }
---
::

### ChainExpression
可选链
::CodeHighlight
---
code: a?.a
highlight: a?.a
---
::

### ClassBody
::CodeHighlight
---
code: class Test {}
highlight: '{}'
---
::

### ClassDeclaration
::CodeHighlight
---
code: class Test {}
highlight: class Test {}
---
::

### ClassExpression
::CodeHighlight
---
code: const a = class {};
highlight: class {}
---
::

### ConditionalExpression
::CodeHighlight
---
code: 'const a = b ? c : d;'
highlight: 'b ? c : d'
---
::

### ContinueStatement
::CodeHighlight
---
code: "for(let i = 0; i < 1; i++){\n
&nbsp;&nbsp;continue;\n
}"
highlight: continue
---
::

### DebuggerStatement
::CodeHighlight
---
code: debugger;
highlight: debugger
---
::

### Decorator
::CodeHighlight
---
code: "@component\n
const a = 1;"
highlight: '@component'
---
::

### DoWhileStatement
::CodeHighlight
---
code: do { } while(1)
highlight: do { } while(1)
---
::

### EmptyStatement
::CodeHighlight
---
code: ;
highlight: ;
---
::

### ExportAllDeclaration
::CodeHighlight
---
code: export * from '';
highlight: export * from ''
---
::

### ExportDefaultDeclaration
::CodeHighlight
---
code: export default '';
highlight: export default ''
---
::

### ExportNamedDeclaration
::CodeHighlight
---
code: export const a = 1;
highlight: export const a = 1
---
::

### ExportSpecifier
::CodeHighlight
---
code: export { a } from '';
highlight: a
---
::

### ExpressionStatement
::CodeHighlight
---
code: "a = 1;\n
(function () {});"
highlight: ['a = 1','(function () {})']
---
::

### ForInStatement
::CodeHighlight
---
code: for(let a in 3) {}
highlight: for(let a in 3) {}
---
::

### ForOfStatement
::CodeHighlight
---
code: for(let a of []) {}
highlight: for(let a of []) {}
---
::

### ForStatement
::CodeHighlight
---
code: for(let a = 0; a < 1; a++) {}
highlight: for(let a = 0; a < 1; a++) {}
---
::

### FunctionDeclaration
::CodeHighlight
---
code: function a() {}
highlight: function a() {}
---
::

### FunctionExpression
::CodeHighlight
---
code: const a = function() {};
highlight: function() {}
---
::

### Identifier
任何标识符, 如变量名,属性名,函数名
::CodeHighlight
---
code: const a = 1;
highlight: a
---
::

### IfStatement
::CodeHighlight
---
code: if(a) {}
highlight: if(a) {}
---
::

### ImportDeclaration
::CodeHighlight
---
code: import a from '';
highlight: import a from ''
---
::

### ImportDefaultSpecifier
::CodeHighlight
---
code: import a from '';
highlight: a
---
::

### ImportExpression
::CodeHighlight
---
code: import('')
highlight: import('')
---
::

### ImportNamespaceSpecifier
::CodeHighlight
---
code: "import * as a from '';"
highlight: '* as a'
---
::

### ImportSpecifier
::CodeHighlight
---
code: import { a } from ''
highlight: a
---
::

### JSXAttribute
::CodeHighlight
---
code: const a = <a name=''></a>;
highlight: name=''
---
::

### JSXClosingElement
::CodeHighlight
---
code: const a = <a name=''></a>
highlight: </a>
---
::

### JSXClosingFragment
::CodeHighlight
---
code: const a = <><Foo /></>
highlight: </>
---
::

### JSXElement
::CodeHighlight
---
code: "const a = <a></a>\n
const a = <a />"
highlight: ["<a></a>", "<a />"]
---
::

### JSXEmptyExpression
::CodeHighlight
---
code: const a = <a>{  }</a>
highlight: '  '
---
::

### JSXExpressionContainer
::CodeHighlight
---
code: const a = <a>{ }</a>
highlight: '{ }'
---
::

### JSXFragment
::CodeHighlight
---
code: const a = <></>
highlight: <></>
---
::

### JSXIdentifier
::CodeHighlight
---
code: const b = <a a=''></a>
highlight: a
---
::

### JSXMemberExpression
::CodeHighlight
---
code: const a = <A.a></A.a>
highlight: A.a
---
::

### JSXOpeningElement
::CodeHighlight
---
code: const a = <a></a>
highlight: <a>
---
::

### JSXOpeningFragment
::CodeHighlight
---
code: const a = <></>
highlight: <>
---
::

### JSXSpreadAttribute
::CodeHighlight
---
code: const a = <a {...a}></a>
highlight: '{...a}'
---
::

### JSXSpreadChild
::CodeHighlight
---
code: const a = <a>{...a}</a>
highlight: '{...a}'
---
::

### JSXText
::CodeHighlight
---
code: const a = <a>text</a>
highlight: text
---
::

### LabeledStatement
::CodeHighlight
---
code: label:a
highlight: label:a
---
::

### Literal
字面量
::CodeHighlight
---
code: '1'
highlight: '1'
---
::

### LogicalExpression
::CodeHighlight
---
code: "a && b\n
a || b"
highlight: ["a && b", "a || b"]
---
::

### MemberExpression
::CodeHighlight
---
code: a.a
highlight: a.a
---
::

### MetaProperty
::CodeHighlight
---
code: "new.target\n
import.meta"
highlight: ["new.target", "import.meta"]
---
::

### MethodDefinition
::CodeHighlight
---
code: class Test { a(){ } }
highlight: a(){ }
---
::

### NewExpression
::CodeHighlight
---
code: new Test();
highlight: new Test()
---
::

### ObjectExpression
::CodeHighlight
---
code: const a = { };
highlight: '{ }'
---
::

### ObjectPattern
::CodeHighlight
---
code: 'const { a, b } = { a: 1, b: 2};'
highlight: '{ a, b }'
---
::

### Program
表示完整源码树
::CodeHighlight
---
code: '{ sourceType: "script" || "module", body: [] }'
highlight: '{ sourceType: "script" || "module", body: [] }'
---
::

### Property
::CodeHighlight
---
code: 'const a = { a: 1 };'
highlight: 'a: 1'
---
::

### PropertyDefinition
::CodeHighlight
---
code: class Test { a = 1 }
highlight: a = 1
---
::

### RestElement
::CodeHighlight
---
code: const [ a, b, ...c ] = [ 1, 2, 3, 4 ];
highlight: ...c
---
::

### ReturnStatement
::CodeHighlight
---
code: return
highlight: return
---
::

### SequenceExpression
::CodeHighlight
---
code: "a, b\n
a = 1, b = 2"
highlight: ["a, b", "a = 1, b = 2"]
---
::

### SpreadElement
::CodeHighlight
---
code: "const a = [ 1, ...b ]\n
const a = { a: 1, ...b }"
highlight: ...b
---
::

### Super
::CodeHighlight
---
code: "class bar extends foo {\n
&nbsp;&nbsp;constructor() {\n
&nbsp;&nbsp;&nbsp;&nbsp;super();\n
&nbsp;&nbsp;}\n
}"
highlight: super
---
::

### SwitchCase
::CodeHighlight
---
code: "switch(a){\n
&nbsp;&nbsp;case '1':\n
&nbsp;&nbsp;&nbsp;&nbsp;break;\n
&nbsp;&nbsp;default:\n
}"
highlight: ["case '1':", "break;", "default:"]
---
::

### SwitchStatement
::CodeHighlight
---
code: "switch(a){\n
&nbsp;&nbsp;case '1':\n
&nbsp;&nbsp;&nbsp;&nbsp;break;\n
&nbsp;&nbsp;default:\n
}"
highlight: "switch(a){\n
&nbsp;&nbsp;case '1':\n
&nbsp;&nbsp;&nbsp;&nbsp;break;\n
&nbsp;&nbsp;default:\n
}"
---
::

### TaggedTemplateExpression
::CodeHighlight
---
code: foo`test`
highlight: foo`test`
---
::

### TemplateElement
::CodeHighlight
---
code: foo`test`
highlight: test
---
::

### TemplateLiteral
::CodeHighlight
---
code: foo`test`
highlight: "`test`"
---
::

### ThisExpression
::CodeHighlight
---
code: this
highlight: this
---
::

### ThrowStatement
::CodeHighlight
---
code: throw new Error
highlight: throw new Error
---
::

### TryStatement
::CodeHighlight
---
code: try{ }catch(e) { }
highlight: try{ }catch(e) { }
---
::

### TSAbstractKeyword
这个不确定
::CodeHighlight
---
code: abstract class Test { }
highlight: abstract
---
::

### TSAbstractMethodDefinition
::CodeHighlight
---
code: "abstract class Test {\n
&nbsp;&nbsp;public abstract a(): void\n
}"
highlight: "public abstract a(): void"
---
::

### TSAbstractPropertyDefinition
::CodeHighlight
---
code: "abstract class Test {\n
&nbsp;&nbsp;public abstract a: number\n
}"
highlight: "public abstract a: number"
---
::

### TSAnyKeyword
::CodeHighlight
---
code: 'let a: any;'
highlight: any
---
::

### TSArrayType
::CodeHighlight
---
code: 'let a: string[];'
highlight: string[]
---
::

### TSAsExpression
::CodeHighlight
---
code: "let a = '' as number;"
highlight: "'' as number"
---
::

### TSAsyncKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSBigIntKeyword
::CodeHighlight
---
code: 'let a: bigint;'
highlight: bigint
---
::

### TSBooleanKeyword
::CodeHighlight
---
code: 'let a: boolean;'
highlight: boolean
---
::

### TSCallSignatureDeclaration
::CodeHighlight
---
code: 'type Greet = { (name: string): void }'
highlight: '(name: string): void'
---
::

### TSClassImplements
::CodeHighlight
---
code: 
highlight: 
---
::

### TSConditionalType
::CodeHighlight
---
code: 'type A<T, U> = T extends U ? true : false;'
highlight: 'T extends U ? true : false'
---
::

### TSConstructorType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSConstructSignatureDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSDeclareFunction
::CodeHighlight
---
code: 
highlight: 
---
::

### TSDeclareKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSEmptyBodyFunctionExpression
::CodeHighlight
---
code: 
highlight: 
---
::

### TSEnumDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSEnumMember
::CodeHighlight
---
code: 
highlight: 
---
::

### TSExportAssignment
::CodeHighlight
---
code: 
highlight: 
---
::

### TSExportKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSExternalModuleReference
::CodeHighlight
---
code: 
highlight: 
---
::

### TSFunctionType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSImportEqualsDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSImportType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSIndexedAccessType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSIndexSignature
::CodeHighlight
---
code: 
highlight: 
---
::

### TSInferType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSInterfaceBody
::CodeHighlight
---
code: 
highlight: 
---
::

### TSInterfaceDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSInterfaceHeritage
::CodeHighlight
---
code: 
highlight: 
---
::

### TSIntersectionType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSLiteralType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSMappedType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSMethodSignature
::CodeHighlight
---
code: 
highlight: 
---
::

### TSModuleBlock
::CodeHighlight
---
code: 
highlight: 
---
::

### TSModuleDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSNamespaceExportDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSNeverKeyword
::CodeHighlight
---
code: 
highlight: 
---
::
### TSNonNullExpression
::CodeHighlight
---
code: 
highlight: 
---
::

### TSNullKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSNumberKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSObjectKeyword
::CodeHighlight
---
code: 
highlight: 
---
::
### TSOptionalType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSParameterProperty
::CodeHighlight
---
code: 
highlight: 
---
::

### TSPrivateKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSPropertySignature
::CodeHighlight
---
code: 
highlight: 
---
::

### TSProtectedKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSPublicKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSQualifiedName
::CodeHighlight
---
code: 
highlight: 
---
::

### TSReadonlyKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSRestType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSStaticKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSStringKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSSymbolKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSThisType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTupleType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeAliasDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeAnnotation
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeAssertion
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeLiteral
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeOperator
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeParameter
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeParameterDeclaration
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeParameterInstantiation
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypePredicate
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeQuery
::CodeHighlight
---
code: 
highlight: 
---
::

### TSTypeReference
::CodeHighlight
---
code: 
highlight: 
---
::

### TSUndefinedKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSUnionType
::CodeHighlight
---
code: 
highlight: 
---
::

### TSUnknownKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### TSVoidKeyword
::CodeHighlight
---
code: 
highlight: 
---
::

### UnaryExpression
::CodeHighlight
---
code: "!a\n
typeof\n
delete\n
void 0"
highlight: ["!a", "typeof", "delete", "void 0"]
---
::

### UpdateExpression
::CodeHighlight
---
code: "a++\n
a--"
highlight: ["a++", "a--"]
---
::

### VariableDeclaration
::CodeHighlight
---
code: let a = 1;
highlight: let a = 1
---
::

### VariableDeclarator
::CodeHighlight
---
code: let a = 1;
highlight: a = 1
---
::

### WhileStatement
::CodeHighlight
---
code: while(1){ }
highlight: while(1){ }
---
::

### WithStatement
::CodeHighlight
---
code: with(a){ }
highlight: with(a){ }
---
::

### YieldExpression
::CodeHighlight
---
code: "function* gen(x) {\n
&nbsp;&nbsp;const y = yield x + 2;\n
&nbsp;&nbsp;return y;\n
}"
highlight: yield x + 2
---
::
