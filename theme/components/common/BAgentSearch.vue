<script setup lang="ts">
import { useData } from "vitepress";
import { nextTick, onActivated, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import BButton from "./BButton.vue";

const props = defineProps<{ initialQuestion: string }>();
const emit = defineEmits<{ back: []; close: [] }>();
const { isDark } = useData();
interface Message { role: "user" | "assistant"; text: string; notice?: string; stopped?: boolean }
const draft = ref(props.initialQuestion);
const input = ref<HTMLInputElement>();
const log = ref<HTMLElement>();
const messages = ref<Message[]>([]);
const MarkdownRender = shallowRef<typeof import("markstream-vue")["default"]>();
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

async function send(retryLast = false) {
  const question = retryLast ? messages.value.at(-2)?.text : draft.value.trim();
  if (!question || request.value) {
    return;
  }
  const controller = new AbortController();
  request.value = controller;
  partial.value = "";
  const previousReply = retryLast ? messages.value.pop() : undefined;
  if (!retryLast) {
    draft.value = "";
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
    scroll();
  }
  catch (e) {
    if (request.value !== controller) {
      return;
    }
    const stopped = controller.signal.aborted;
    const notice = stopped ? "已停止回答" : e instanceof TypeError ? "未能连接到问答服务" : e instanceof SyntaxError ? "服务端返回的数据格式有误" : e instanceof Error ? e.message : "未收到错误详情";
    messages.value.push({ role: "assistant", text: partial.value || previousReply?.text || "", notice, stopped });
    scroll();
  }
  finally {
    if (request.value === controller) {
      request.value = undefined;
      nextTick(() => input.value?.focus());
    }
  }
}
</script>

<template>
  <section class="agent-panel" @keydown.esc.stop.prevent="emit('back')">
    <header class="flex items-center gap-2">
      <button type="button" class="tool" title="返回搜索" @click="emit('back')">
        <span class="i-lucide-arrow-left"></span>返回搜索
      </button>
      <button type="button" class="tool ml-auto" aria-label="关闭弹窗" title="关闭弹窗" @click="emit('close')">
        <span class="i-lucide-x"></span>
      </button>
    </header>
    <div ref="log" role="log" class="transcript">
      <div v-for="(message, i) in messages" :key="i" class="turn" :class="{ outgoing: message.role === 'user' }">
        <div class="message" :class="[message.role, { interrupted: message.notice, failed: replyFailed(message) }]">
          <MarkdownRender v-if="message.role === 'assistant' && message.text && MarkdownRender" mode="chat" :is-dark="isDark" :content="message.text" final html-policy="escape" />
          <div v-else-if="message.text" class="min-w-0 whitespace-pre-wrap break-words leading-relaxed">
            {{ message.text }}
          </div>
          <div v-if="message.notice" class="reply-notice flex items-start gap-3 text-sm">
            <div role="status" class="min-w-0 break-words">
              <strong v-if="replyFailed(message)" class="mb-1 block font-semibold">{{ message.text ? '回答未完成' : '回答生成失败' }}</strong>
              <span>{{ message.notice }}</span>
            </div>
            <BButton v-if="i === messages.length - 1" variant="ghost" size="sm" class="min-h-6 inline-flex shrink-0 items-center gap-0.5 px-1 py-0.5 text-xs text-foreground/75 focus-visible:text-foreground hover:text-foreground" @click="send(true)">
              <span class="i-lucide-rotate-ccw" aria-hidden="true"></span>重试
            </BButton>
          </div>
        </div>
      </div>
      <div v-if="request" class="message assistant" :class="{ pending: !partial }" role="status" aria-label="正在生成回答">
        <span v-if="!partial" aria-hidden="true">•••</span><MarkdownRender v-else-if="MarkdownRender" mode="chat" :is-dark="isDark" :content="partial" :final="false" html-policy="escape" /><span v-else class="whitespace-pre-wrap break-words">{{ partial }}</span>
      </div>
    </div>
    <div class="composer-area">
      <form class="composer" @submit.prevent="send()">
        <input ref="input" v-model="draft" aria-label="向博客提问" :placeholder="messages.length ? '继续追问…' : '输入你的问题…'" :readonly="!!request" maxlength="1000" />
        <button v-if="request" type="button" class="send" aria-label="停止回答" title="停止回答" @click="request.abort()">
          <span class="i-lucide-square fill-current"></span>
        </button>
        <button v-else type="submit" aria-label="发送提问" title="发送提问" :disabled="!draft.trim()" class="send">
          <span class="i-lucide-arrow-up"></span>
        </button>
      </form>
    </div>
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
header .tool:not(:first-child),
.send {
  width: 32px;
  height: 32px;
  justify-content: center;
}
.tool:focus-visible,
.send:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
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
.pending {
  align-items: center;
  color: hsl(var(--muted-foreground));
  letter-spacing: 3px;
}
@media (prefers-reduced-motion: no-preference) {
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
