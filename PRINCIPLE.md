# 了解 Vditor 原理

## 公共事件与方法

### 触发渲染的事件有三种：

- 用户通过键盘输入。在各个模式的 index.ts 中，一般为 input / inputEvent
- 用户粘贴外部内容。在各个模式的 index.ts 中，在 addEventListener 监听粘贴事件
- 通过 API 调用 （如 setValue 或 insertValue 方法）
- 撤销上一次操作触发重新渲染

## 即时模式（IR）

> 即类似Typora的模式。


## 所见即所得模式（WYSIWYG）

## 分屏预览模式（SV）

