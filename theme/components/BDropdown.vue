<script setup lang="ts">
import {
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "radix-vue";
import { ref } from "vue";

const { level: _ = 0 } = defineProps<{
  level?: number;
}>();

const toggleState = ref(false);
const checkboxOne = ref(false);
const checkboxTwo = ref(false);
const person = ref("pedro");

function handleClick() {
  // eslint-disable-next-line no-alert
  alert("hello!");
}
</script>

<template>
  <DropdownMenuRoot v-model:open="toggleState">
    <DropdownMenuTrigger>
      <div>ff</div>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
        :side-offset="5"
      >
        <DropdownMenuItem
          value="New Tab"
          class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          @click="handleClick"
        >
          New Tab
          <div
            class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
          >
            ⌘+T
          </div>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            value="more toolsz"
            class="group text-grass11 data-[disabled]:text-mauve8 data-[state=open]:text-grass11 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1 relative h-[25px] w-full flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[state=open]:bg-green4 data-[highlighted]:text-green1"
          >
            More Tools
            <div
              class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
            >
              <Icon icon="radix-icons:chevron-right" />
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
              :side-offset="2"
              :align-offset="-5"
            >
              <DropdownMenuItem
                class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Save Page As…
                <div
                  class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                >
                  ⌘+S
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Create Shortcut…
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Name Window…
              </DropdownMenuItem>
              <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Developer Tools
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          value="New Window"
          class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
        >
          New Window
          <div
            class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
          >
            ⌘+N
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          value="New Private Window"
          class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
          disabled
        >
          New Private Window
          <div
            class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
          >
            ⇧+⌘+N
          </div>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            value="more tools"
            class="group text-grass11 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1 relative h-[25px] w-full flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[state=open]:bg-green4 data-[highlighted]:text-green1"
          >
            More Tools
            <div
              class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
            >
              <Icon icon="radix-icons:chevron-right" />
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
              :side-offset="2"
              :align-offset="-5"
            >
              <DropdownMenuItem
                class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Save Page As…
                <div
                  class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                >
                  ⌘+S
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Create Shortcut…
              </DropdownMenuItem>
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Name Window…
              </DropdownMenuItem>
              <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Developer Tools
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  value="more toolsz"
                  class="group text-grass11 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1 relative h-[25px] w-full flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[state=open]:bg-green4 data-[highlighted]:text-green1"
                >
                  More Tools
                  <div
                    class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                  >
                    <Icon icon="radix-icons:chevron-right" />
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
                    :side-offset="2"
                    :align-offset="-5"
                  >
                    <DropdownMenuItem
                      class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    >
                      Save Page As…
                      <div
                        class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                      >
                        ⌘+S
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    >
                      Create Shortcut…
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    >
                      Name Window…
                    </DropdownMenuItem>
                    <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />
                    <DropdownMenuItem
                      class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    >
                      Developer Tools
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger
                        value="more toolsz"
                        class="group text-grass11 data-[state=open]:text-grass11 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:bg-green9 data-[highlighted]:data-[state=open]:text-green1 relative h-[25px] w-full flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[state=open]:bg-green4 data-[highlighted]:text-green1"
                      >
                        More Tools
                        <div
                          class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                        >
                          <Icon icon="radix-icons:chevron-right" />
                        </div>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent
                          class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
                          :side-offset="2"
                          :align-offset="-5"
                        >
                          <DropdownMenuItem
                            class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                          >
                            Save Page As…
                            <div
                              class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
                            >
                              ⌘+S
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                          >
                            Create Shortcut…
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                          >
                            Name Window…
                          </DropdownMenuItem>
                          <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />
                          <DropdownMenuItem
                            class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                          >
                            Developer Tools
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              >
                Developer Tools
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />
        <DropdownMenuCheckboxItem
          v-model:checked="checkboxOne"
          class="group text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
        >
          <DropdownMenuItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
            <Icon icon="radix-icons:check" />
          </DropdownMenuItemIndicator>
          Show Bookmarks
          <div
            class="text-mauve11 group-data-[disabled]:text-mauve8 ml-auto pl-[20px] group-data-[highlighted]:text-white"
          >
            ⌘+B
          </div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          v-model:checked="checkboxTwo"
          class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
        >
          <DropdownMenuItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
            <Icon icon="radix-icons:check" />
          </DropdownMenuItemIndicator>
          Show Full URLs
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator class="m-[5px] h-[1px] bg-green6" />

        <DropdownMenuLabel class="text-mauve11 pl-[25px] text-xs leading-[25px]">
          People
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup v-model="person">
          <DropdownMenuRadioItem
            class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            value="pedro"
          >
            <DropdownMenuItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <Icon icon="radix-icons:dot-filled" />
            </DropdownMenuItemIndicator>
            Pedro Duarte
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            class="text-grass11 data-[disabled]:text-mauve8 relative h-[25px] flex select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
            value="colm"
          >
            <DropdownMenuItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
              <Icon icon="radix-icons:dot-filled" />
            </DropdownMenuItemIndicator>
            Colm Tuite
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuArrow class="fill-white" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
  <!-- <BPopover :placement>
    <template #reference>
      <slot>something</slot>
    </template>
    <div>
      <BDropdown :level="level + 1">
        fff
      </BDropdown>
    </div>
  </BPopover> -->
</template>
