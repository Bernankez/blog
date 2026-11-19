<script setup lang="ts">
import { useClipboard, useLocalStorage } from "@vueuse/core";
import { useData } from "vitepress";
import { nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, shallowRef } from "vue";
import BAgentDeletePopover from "./BAgentDeletePopover.vue";
import BButton from "./BButton.vue";

const props = defineProps<{ initialQuestion: string }>();
const emit = defineEmits<{ back: []; close: [] }>();
const { isDark } = useData();
interface Message { role: "user" | "assistant"; text: string; notice?: string; stopped?: boolean }
interface Session { id: string; messages: Message[]; updated?: number }
const history = useLocalStorage<Session[]>("blog:ai-history:v1", []);
const activeId = ref("");
const historyOpen = ref(false);
const draft = ref(props.initialQuestion);
const panel = ref<HTMLElement>();
const historyButton = ref<HTMLButtonElement>();
const input = ref<HTMLInputElement>();
const log = ref<HTMLElement>();
const messages = ref<Message[]>([]);
const error = ref("");
const editing = ref(-1);
const editDraft = ref("");
const editError = ref("");
const { copy, copied } = useClipboard({ copiedDuring: 1500, legacy: true });
const copiedMessage = shallowRef<Message>();
const confirmTarget = ref<number | string>();
const MarkdownRender = shallowRef<typeof import("markstream-vue")["default"]>();
const vFocus = { mounted: (el: HTMLElement) => el.focus({ preventScroll: true }) };
const partial = ref("");
const request = shallowRef<AbortController>();
const appId = "4U4R8B36SX";
const agentId = "8e7de6ff-4801-429f-bb2f-6164d926ad1f";

onMounted(() => {
  input.value?.focus();
  void send();
  void Promise.all([import("markstream-vue"), import("markstream-vue/index.css")])
    .then(([renderer]) => { MarkdownRender.value = renderer.default; })
    .catch(() => { /* Plain text stays readable if the renderer fails to load. */ });
});
onBeforeUnmount(() => {
  request.value?.abort();
  request.value = undefined;
});
onActivated(() => input.value?.focus());
onDeactivated(() => closeConfirmation());

function back() {
  if (confirmTarget.value !== undefined) {
    closeConfirmation(true);
    return;
  }
  else if (historyOpen.value) {
    historyOpen.value = false;
  }
  else if (editing.value >= 0) {
    cancelEdit();
    return;
  }
  else {
    emit("back");
    return;
  }
  nextTick(() => input.value?.focus());
}

function openSession(session?: Session) {
  request.value?.abort();
  request.value = undefined;
  activeId.value = session?.id ?? "";
  closeConfirmation();
  editing.value = -1;
  copiedMessage.value = undefined;
  messages.value = session?.messages.slice() ?? [];
  draft.value = "";
  error.value = "";
  historyOpen.value = false;
  partial.value = "";
  nextTick(() => {
    input.value?.focus();
    log.value?.scrollTo(0, log.value.scrollHeight);
  });
}

function saveSession() {
  activeId.value ||= crypto.randomUUID();
  history.value = [{ id: activeId.value, messages: messages.value.slice(-40), updated: Date.now() }, ...history.value.filter(s => s.id !== activeId.value)].slice(0, 20);
}

function firstReplyExcerpt(session: Session) {
  const reply = session.messages.find(m => m.role === "assistant" && m.text.trim());
  return reply?.text
    .replace(/^\s*(?:```[^\n]*|#{1,6}\s+|>\s*|[-*+]\s+)/gmu, "")
    .replace(/!?\[([^\]]*)\]\([^)]+\)/gu, "$1")
    .replace(/(\*\*|__|~~|`)(.+?)\1/gu, "$2")
    .replace(/\s+/gu, " ")
    .trim();
}

function historyByDay() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const groups = new Map<string, { session: Session; excerpt?: string }[]>();
  for (const session of history.value.toSorted((a, b) => (b.updated ?? 0) - (a.updated ?? 0))) {
    let label = "日期未知";
    if (session.updated != null) {
      const day = new Date(session.updated);
      if (day.toDateString() === today.toDateString()) {
        label = "今天";
      }
      else if (day.toDateString() === yesterday.toDateString()) {
        label = "昨天";
      }
      else {
        label = day.toLocaleDateString("zh-CN", { year: day.getFullYear() !== today.getFullYear() ? "numeric" : undefined, month: "long", day: "numeric" });
      }
    }
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push({ session, excerpt: firstReplyExcerpt(session) });
  }
  return groups;
}

async function copyMessage(message: Message) {
  try {
    await copy(message.text);
    copiedMessage.value = message;
  }
  catch {
    error.value = "无法访问剪贴板，请选中文字复制。";
  }
}

function closeConfirmation(restoreFocus = false) {
  const trigger = restoreFocus && panel.value?.querySelector<HTMLButtonElement>("button[aria-haspopup=\"dialog\"][aria-expanded=\"true\"]");
  confirmTarget.value = undefined;
  if (trigger) {
    nextTick(() => trigger.focus({ preventScroll: true }));
  }
}

function updateConfirmation(target: number | string, open: boolean) {
  if (open) {
    confirmTarget.value = target;
  }
  else if (confirmTarget.value === target) {
    closeConfirmation();
  }
}

function deleteSession(id: string) {
  history.value = history.value.filter(s => s.id !== id);
  closeConfirmation();
  if (activeId.value === id) {
    openSession();
    historyOpen.value = true;
  }
  nextTick(() => historyButton.value?.focus({ preventScroll: true }));
}

function deleteFrom(index: number) {
  messages.value.splice(index);
  editing.value = -1;
  closeConfirmation();
  if (messages.value.length) {
    saveSession();
  }
  else {
    history.value = history.value.filter(s => s.id !== activeId.value);
    activeId.value = "";
  }
  nextTick(() => input.value?.focus({ preventScroll: true }));
}

function startEdit(index: number) {
  closeConfirmation();
  editError.value = "";
  editDraft.value = messages.value[index].text;
  editing.value = index;
}

function cancelEdit() {
  const index = editing.value;
  editing.value = -1;
  nextTick(() => log.value?.querySelector<HTMLButtonElement>(`[data-action-index="${index}"] .edit-trigger`)?.focus({ preventScroll: true }));
}

function onEditEnter(event: KeyboardEvent) {
  if (!event.isComposing && !event.shiftKey && event.keyCode !== 229) {
    event.preventDefault();
    void send(editing.value);
  }
}

function reasonText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 240) : "";
}

function replyFailed(message: Message) {
  return !!message.notice && !(message.stopped ?? (message.notice === "已停止回答"));
}

async function httpFailure(response: Response) {
  const body = await response.json().catch(() => null);
  const detail = reasonText(body?.message) || reasonText(body?.error?.message) || reasonText(body?.error);
  const reasons: Record<number, string> = { 401: "身份验证失败", 403: "请求被拒绝", 404: "未找到问答服务", 429: "请求过于频繁，请稍后再试" };
  const reason = detail || reasons[response.status] || response.statusText || "服务器未提供错误详情";
  return `HTTP ${response.status} · ${reason}`;
}

async function send(editIndex = -1, retryLast = false) {
  const question = retryLast ? messages.value.at(-2)?.text : (editIndex >= 0 ? editDraft : draft).value.trim();
  if (!question || request.value || (!retryLast && editIndex !== editing.value)) {
    return;
  }
  const controller = new AbortController();
  closeConfirmation();
  request.value = controller;
  partial.value = "";
  error.value = "";
  const previousReply = retryLast ? messages.value.pop() : undefined;
  const replaced = editIndex >= 0 ? messages.value.splice(editIndex) : undefined;
  if (!retryLast) {
    editError.value = "";
    editing.value = -1;
    if (!replaced) {
      draft.value = "";
    }
    messages.value.push({ role: "user", text: question });
  }
  const scroll = () => nextTick(() => log.value?.scrollTo(0, log.value.scrollHeight));
  scroll();
  try {
    const response = await fetch(`https://${appId}.algolia.net/agent-studio/1/agents/${agentId}/completions?compatibilityMode=ai-sdk-5&stream=true`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Algolia-Application-Id": appId,
        "X-Algolia-API-Key": "7e73191be126881623e4fc753fad4ec3",
      },
      body: JSON.stringify({ messages: messages.value.filter(m => m.text).slice(-11).map(({ role, text }) => ({ role, parts: [{ type: "text", text }] })) }),
    });
    if (!response.ok) {
      throw new Error(await httpFailure(response));
    }
    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
    if (!reader) {
      throw new Error("没有收到回答");
    }
    let buffer = "";
    let finished = false;
    while (!finished) {
      const { done, value } = await reader.read();
      controller.signal.throwIfAborted();
      buffer += value ?? "";
      const lines = buffer.split("\n");
      buffer = done ? "" : lines.pop()!;
      for (const line of lines) {
        if (!line.startsWith("data:")) {
          continue;
        }
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          finished = true;
          break;
        }
        const event = JSON.parse(data);
        if (event.type === "error") {
          throw new Error(reasonText(event.errorText) || reasonText(event.message) || "服务端中断了回答");
        }
        if (event.type === "text-delta") {
          const nearBottom = !log.value || log.value.scrollHeight - log.value.scrollTop - log.value.clientHeight < 48;
          partial.value += event.delta;
          if (nearBottom) {
            scroll();
          }
        }
        if (event.type === "finish") {
          finished = true;
        }
      }
      if (done && !finished) {
        throw new Error("连接已中断");
      }
    }
    const text = partial.value;
    if (!text) {
      throw new Error("没有收到文字回答");
    }
    controller.signal.throwIfAborted();
    messages.value.push({ role: "assistant", text });
    saveSession();
    scroll();
  }
  catch (e) {
    if (request.value !== controller) {
      return;
    }
    const stopped = controller.signal.aborted;
    const notice = stopped ? "已停止回答" : e instanceof TypeError ? "未能连接到问答服务" : e instanceof SyntaxError ? "服务端返回的数据格式有误" : e instanceof Error ? e.message : "未收到错误详情";
    if (replaced) {
      messages.value.splice(editIndex, messages.value.length - editIndex, ...replaced);
      editing.value = editIndex;
      editError.value = notice;
    }
    else {
      messages.value.push({ role: "assistant", text: partial.value || previousReply?.text || "", notice, stopped });
      saveSession();
      scroll();
    }
  }
  finally {
    if (request.value === controller) {
      request.value = undefined;
      if (editing.value < 0) {
        nextTick(() => input.value?.focus());
      }
    }
  }
}
</script>

<template>
  <section ref="panel" class="agent-panel" @keydown.esc.stop.prevent="back">
    <div id="message-popovers"></div>
    <header class="flex items-center gap-2">
      <button type="button" class="tool" :title="historyOpen ? '返回问答' : '返回搜索'" @click="historyOpen ? back() : emit('back')">
        <span class="i-lucide-arrow-left"></span>{{ historyOpen ? '返回问答' : '返回搜索' }}
      </button>
      <button ref="historyButton" type="button" class="tool ml-auto" title="历史会话" aria-label="历史会话" :aria-pressed="historyOpen" @click="closeConfirmation(); historyOpen = !historyOpen">
        <span class="i-lucide-history"></span>
      </button>
      <button type="button" class="tool" aria-label="新建会话" title="新建会话" @click="openSession()">
        <span class="i-lucide-square-pen"></span>
      </button>
      <button type="button" class="tool" aria-label="关闭弹窗" title="关闭弹窗" @click="emit('close')">
        <span class="i-lucide-x"></span>
      </button>
    </header>
    <div v-if="historyOpen" class="history" role="region" aria-label="历史会话">
      <p v-if="!history.length" class="empty-history">
        <span class="i-lucide-history"></span>暂无历史会话
      </p>
      <section v-for="[day, sessions] in historyByDay()" :key="day" class="history-day" :aria-label="day">
        <h3>{{ day }}</h3>
        <ul class="min-w-0">
          <li v-for="{ session, excerpt } in sessions" :key="session.id" class="history-row flex items-center gap-2">
            <button type="button" class="history-link min-w-0 flex-1 text-left" :aria-current="session.id === activeId || undefined" @click="openSession(session)">
              <time v-if="session.updated != null" :datetime="new Date(session.updated).toISOString()" class="text-sm text-muted-foreground tabular-nums">{{ new Date(session.updated).toLocaleTimeString('zh-CN', { hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }) }}</time>
              <span class="history-title truncate">
                {{ session.messages[0].text }}<span v-if="excerpt" class="ml-2 text-sm text-muted-foreground">– {{ excerpt }}</span>
              </span>
            </button>
            <BAgentDeletePopover :model-value="confirmTarget === session.id" question="删除这个会话？" confirm-label="删除会话" @update:model-value="updateConfirmation(session.id, $event)" @cancel="closeConfirmation(true)" @confirm="deleteSession(session.id)">
              <button type="button" class="tool" title="删除会话" :aria-label="`删除会话：${session.messages[0].text}`" aria-haspopup="dialog" :aria-expanded="confirmTarget === session.id">
                <span class="i-lucide-trash-2"></span>
              </button>
            </BAgentDeletePopover>
          </li>
        </ul>
      </section>
    </div>
    <template v-else>
      <div ref="log" role="log" class="transcript">
        <div v-for="(message, i) in messages" :key="i" class="turn" :class="{ outgoing: message.role === 'user', editing: editing === i }">
          <div class="message-actions" :data-action-index="i" role="group" aria-label="消息操作" :class="{ open: confirmTarget === i }">
            <button v-if="message.text" type="button" :title="copied && copiedMessage === message ? '已复制' : '复制'" :aria-label="copied && copiedMessage === message ? '已复制' : '复制'" @click="copyMessage(message)">
              <span :class="copied && copiedMessage === message ? 'i-lucide-check' : 'i-lucide-copy'" aria-hidden="true"></span>
            </button>
            <button v-if="message.role === 'user'" type="button" class="edit-trigger" title="修改提问" aria-label="修改提问" :disabled="!!request || editing === i" @click="startEdit(i)">
              <span class="i-lucide-pencil" aria-hidden="true"></span>
            </button>
            <BAgentDeletePopover :model-value="confirmTarget === i" :question="i === messages.length - 1 ? '删除这条消息？' : '删除这条消息及之后的所有消息？'" :confirm-label="`删除 ${messages.length - i} 条消息`" @update:model-value="updateConfirmation(i, $event)" @cancel="closeConfirmation(true)" @confirm="deleteFrom(i)">
              <button type="button" :disabled="!!request" title="删除消息" aria-label="删除消息" aria-haspopup="dialog" :aria-expanded="confirmTarget === i">
                <span class="i-lucide-trash-2" aria-hidden="true"></span>
              </button>
            </BAgentDeletePopover>
          </div>
          <div class="message" :class="[message.role, { interrupted: message.notice, failed: replyFailed(message) }]">
            <form v-if="editing === i" class="bubble-editor" @submit.prevent="send(i)">
              <textarea v-model="editDraft" v-focus aria-label="修改提问" rows="2" maxlength="1000" @keydown.enter="onEditEnter"></textarea>
              <div class="flex items-center justify-end gap-2">
                <div v-if="editError" role="status" class="mr-auto min-w-0 break-words text-sm">
                  <strong v-if="editError !== '已停止回答'" class="block text-error font-medium">重新提问失败</strong>
                  <span>{{ editError }}</span>
                </div>
                <BButton variant="ghost" size="sm" @click="cancelEdit">
                  取消
                </BButton>
                <BButton type="submit" variant="ghost" size="sm" class="text-primary" :class="{ 'opacity-45': !editDraft.trim() }" :inert="!editDraft.trim()" :aria-disabled="!editDraft.trim()">
                  重新提问
                </BButton>
              </div>
            </form>
            <MarkdownRender v-else-if="message.role === 'assistant' && message.text && MarkdownRender" mode="chat" :is-dark="isDark" :content="message.text" final html-policy="escape" />
            <div v-else-if="message.text" class="min-w-0 whitespace-pre-wrap break-words leading-relaxed">
              {{ message.text }}
            </div>
            <div v-if="message.notice" class="reply-notice flex items-start gap-3 text-sm">
              <div role="status" class="min-w-0 break-words">
                <strong v-if="replyFailed(message)" class="mb-1 block font-semibold">{{ message.text ? '回答未完成' : '回答生成失败' }}</strong>
                <span>{{ message.notice }}</span>
              </div>
              <BButton v-if="i === messages.length - 1" variant="ghost" size="sm" class="min-h-6 inline-flex shrink-0 items-center gap-0.5 px-1 py-0.5 text-xs text-foreground/75 focus-visible:text-foreground hover:text-foreground" @click="send(-1, true)">
                <span class="i-lucide-rotate-ccw" aria-hidden="true"></span>重试
              </BButton>
            </div>
          </div>
        </div>
        <div v-if="request" class="message assistant" :class="{ pending: !partial }" role="status" aria-label="正在生成回答">
          <span v-if="!partial" aria-hidden="true">•••</span><MarkdownRender v-else-if="MarkdownRender" mode="chat" :is-dark="isDark" :content="partial" :final="false" html-policy="escape" /><span v-else class="whitespace-pre-wrap break-words">{{ partial }}</span>
        </div>
      </div>
      <p v-if="error" role="alert">
        {{ error }}
      </p>
      <div class="composer-area">
        <form class="composer" @submit.prevent="send()">
          <input ref="input" v-model="draft" aria-label="向博客提问" :placeholder="messages.length ? '继续追问…' : '输入你的问题…'" :readonly="!!request || editing >= 0" maxlength="1000" />
          <button v-if="request" type="button" class="send" aria-label="停止回答" title="停止回答" @click="request.abort()">
            <span class="i-lucide-square fill-current"></span>
          </button>
          <button v-else type="submit" aria-label="发送提问" title="发送提问" :disabled="editing >= 0 || !draft.trim()" class="send">
            <span class="i-lucide-arrow-up"></span>
          </button>
        </form>
      </div>
    </template>
  </section>
</template>

<style scoped>
.agent-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: min(520px, 75dvh);
  color: hsl(var(--foreground));
}
.dark .agent-panel {
  --agent-user-bg: color-mix(in srgb, var(--b-local-search-bg), hsl(var(--foreground)) 24%);
  --agent-answer-bg: hsl(var(--accent));
  --agent-field-bg: hsl(var(--muted));
}
header {
  margin-inline: -12px;
  padding: 0 12px 10px;
  border-bottom: 1px solid hsl(var(--border));
}
.tool,
.send {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
}
.tool {
  background: transparent;
  height: 32px;
  justify-content: center;
}
header .tool {
  font-size: 16px;
}
header .tool span {
  font-size: 18px;
}
header .tool:first-child {
  color: hsl(var(--muted-foreground));
}
header .tool:hover {
  color: hsl(var(--primary));
}
.message-actions {
  display: flex;
  width: max-content;
  margin: 0 3px 5px auto;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
}
.message-actions button {
  background: transparent;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  color: hsl(var(--muted-foreground));
}
.message-actions button span {
  width: 14px;
  height: 14px;
}
.turn:hover .message-actions,
.message-actions:has(:focus-visible),
.message-actions.open {
  opacity: 1;
  pointer-events: auto;
}
.message-actions button:hover:not(:disabled),
.message-actions button:focus-visible {
  color: hsl(var(--primary));
}
.message-actions button:disabled {
  opacity: 0.4;
}
@media (pointer: coarse) {
  .message-actions {
    opacity: 1;
    pointer-events: auto;
  }
  .message-actions button {
    width: 44px;
    height: 44px;
  }
}
.history-day {
  --history-row-height: 36px;
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  column-gap: 8px;
  align-items: start;
}
.history-day + .history-day {
  margin-top: 12px;
}
.history-day h3 {
  padding-block: calc((var(--history-row-height) - 24px) / 2);
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  color: hsl(var(--muted-foreground));
}
.history-row {
  padding-inline-end: 4px;
}
.history-row .tool {
  opacity: 0;
}
.history-row:hover .tool,
.history-row .tool[aria-expanded="true"],
.history-row:focus-within .tool {
  opacity: 1;
}
@media (pointer: coarse) {
  .history-day {
    --history-row-height: 44px;
  }
  .history-row .tool {
    opacity: 1;
  }
}
.history-link {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: var(--history-row-height);
  background: transparent;
}
.history-title {
  grid-column: 2;
  position: relative;
  padding-inline-start: 14px;
}
.history-title::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inset-block: 0;
  margin-block: auto;
  width: 2px;
  height: 18px;
  background: hsl(var(--primary));
  opacity: 0;
  pointer-events: none;
}
.history-link[aria-current="true"] .history-title::before {
  opacity: 1;
}
.history-link[aria-current="true"],
.history-link:focus-visible,
.history-row:hover .history-link {
  color: hsl(var(--primary));
}
@media (prefers-reduced-motion: no-preference) {
  .history-link {
    transition: color var(--b-transition-duration) var(--b-transition-animation);
  }
  .history-title::before,
  .history-row .tool {
    transition: opacity var(--b-transition-duration) var(--b-transition-animation);
  }
  @starting-style {
    .history-link[aria-current="true"] .history-title::before {
      opacity: 0;
    }
  }
}
header .tool:not(:first-child),
.send {
  width: 32px;
  height: 32px;
  justify-content: center;
}
.history-row .tool:hover {
  background: hsl(var(--muted));
}
.bubble-editor button:focus-visible,
.history-link:focus-visible,
.message-actions button:focus-visible,
.tool:focus-visible,
.send:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
.history,
.transcript {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-inline: -12px;
}
.transcript {
  padding: 4px calc(12px + clamp(8px, 4vw, 48px)) 22px;
}
.transcript > .turn:first-child {
  margin-top: 0;
}
.history {
  padding: 22px clamp(16px, 3vw, 32px);
  scrollbar-width: thin;
}
.empty-history {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px 0;
  color: hsl(var(--muted-foreground));
}
.pending {
  align-items: center;
  color: hsl(var(--muted-foreground));
  letter-spacing: 3px;
}
@media (prefers-reduced-motion: no-preference) {
  .message-actions {
    transition: opacity var(--b-transition-duration) var(--b-transition-animation);
  }
  .pending span {
    animation: thinking 1s ease-in-out infinite alternate;
  }
}
@keyframes thinking {
  to {
    opacity: 0.35;
  }
}
.message {
  margin: 0 0 3px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.message.interrupted {
  flex-direction: column;
}
.message.failed {
  background: var(--b-custom-block-danger-bg);
  border-color: hsl(var(--error) / 0.45);
}
.reply-notice {
  color: hsl(var(--muted-foreground));
  max-width: 100%;
}
.failed .reply-notice :is(strong, button) {
  color: color-mix(in srgb, var(--b-custom-block-danger-text) 72%, hsl(var(--foreground)));
}
.failed .reply-notice button:is(:hover, :focus-visible) {
  background-color: var(--b-custom-block-danger-bg);
}
.turn {
  width: fit-content;
  max-width: 90%;
  margin: 4px 0 8px;
}
.turn.outgoing {
  margin-left: auto;
  max-width: 85%;
}
.turn .message {
  max-width: 100%;
}
.turn.editing {
  width: 28rem;
}
.turn.editing .user,
.bubble-editor {
  width: 100%;
}
.turn.editing .user {
  background: var(--agent-field-bg, var(--b-local-search-bg));
  outline: 1px solid hsl(var(--border));
}
.turn.editing .user:focus-within {
  outline-color: hsl(var(--primary));
}
.bubble-editor textarea {
  display: block;
  width: 100%;
  field-sizing: content;
  min-height: 3em;
  max-height: 10em;
  resize: none;
  outline: none;
  background: transparent;
  line-height: 1.5;
}
.message :deep(.markstream-vue) {
  --link-color: hsl(var(--primary) / 0.9);
  min-width: 0;
  max-width: 100%;
}
.message :deep(a.link-node) {
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.message :deep(a.link-node:is(:hover, :focus-visible)) {
  --link-color: hsl(var(--primary));
}
.assistant {
  width: fit-content;
  max-width: 90%;
  padding: 8px 15px;
  border: 1px solid hsl(var(--border));
  background: var(--agent-answer-bg, hsl(var(--pure)));
  border-radius: 4px 12px 12px;
}
.user {
  width: fit-content;
  max-width: 85%;
  margin-left: auto;
  background: var(--agent-user-bg, hsl(var(--muted)));
  padding: 8px 15px;
  border-radius: 14px 14px 3px 14px;
}
.composer-area {
  margin-inline: -12px;
  padding: 10px 12px 0;
  border-top: 1px solid hsl(var(--border));
}
.composer {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid hsl(var(--border));
  border-radius: 4px;
  background: var(--agent-field-bg, hsl(var(--pure)));
  padding: 4px 6px;
}
.composer:focus-within {
  border-color: hsl(var(--primary));
}
.composer input {
  min-width: 0;
  flex: 1;
  background: transparent;
  padding: 5px;
  outline: none;
}
.send {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: 4px;
}
.send:hover:not(:disabled) {
  filter: brightness(0.85);
}
.send:disabled {
  opacity: 0.45;
}
@media (max-width: 767px) {
  .agent-panel {
    height: calc(100dvh - 24px);
  }
}
</style>
