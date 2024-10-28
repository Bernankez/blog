import { Comment, createTextVNode, Fragment, h, type Slot, Text, type VNode, type VNodeChild } from "vue";

export function slotToVNode<T extends Slot<any>>(slot?: T, name?: string) {
  const slotName = `slot${name ? `[${name}]` : ""}`;
  if (!slot) {
    console.warn(`${slotName} should not be empty`);
    return h("span");
  }
  const slots = flatten(slot());
  if (slots.length > 1) {
    console.warn(`${slotName} should only have one exactly child`);
  }
  const defaultSlot = slots[0];
  if (defaultSlot.type === Text) {
    return h("span", defaultSlot);
  }
  return defaultSlot;
}

export function flatten(vNodes: VNodeChild[], filterCommentNode = true, result: VNode[] = []): VNode[] {
  vNodes.forEach((vNode) => {
    if (vNode === null) {
      return;
    }
    if (typeof vNode !== "object") {
      if (typeof vNode === "string" || typeof vNode === "number") {
        result.push(createTextVNode(String(vNode)));
      }
      return;
    }
    if (Array.isArray(vNode)) {
      flatten(vNode, filterCommentNode, result);
      return;
    }
    if (vNode.type === Fragment) {
      if (vNode.children === null) {
        return;
      }
      if (Array.isArray(vNode.children)) {
        flatten(vNode.children, filterCommentNode, result);
      }
    } else if (vNode.type !== Comment) {
      result.push(vNode);
    }
  });
  return result;
}

export function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) {
    return [];
  }
  return children.flatMap((child) => {
    if (child.type === Fragment) {
      return renderSlotFragments(child.children as VNode[]);
    }
    return [child];
  });
}
