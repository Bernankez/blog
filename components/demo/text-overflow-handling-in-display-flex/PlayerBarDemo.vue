<template>
  <div class="flex flex-col flex-gap-4">
    <p>
      我希望这里的歌名可以实现超出一行时使用省略号的效果
    </p>
    <div class="w-full bg-green">
      <div class="flex items-center flex-gap-4">
        <div class="h-10 w-10 shrink-0 bg-gray">
          头像
        </div>
        <div class="w-full flex flex-col flex-gap-1 bg-blue">
          <div class="bg-orange-300">
            这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
          </div>
          <div class="bg-orange-100">
            歌手
          </div>
        </div>
        <div class="flex shrink-0 items-center flex-gap-2">
          <div class="bg-red">
            一些播放控制按钮
          </div>
        </div>
      </div>
    </div>
    <p>
      正常情况下我只需要像上面的例子一样，对橙色以及它的父级蓝色部分设置text-overflow: ellipsis就行
    </p>
    <div class="w-full bg-green">
      <div class="flex items-center flex-gap-4">
        <div class="h-10 w-10 shrink-0 bg-gray">
          头像
        </div>
        <div class="w-full flex flex-col flex-gap-1 truncate bg-blue">
          <div class="truncate bg-orange-300">
            这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
          </div>
          <div class="bg-orange-100">
            歌手
          </div>
        </div>
        <div class="flex shrink-0 items-center flex-gap-2">
          <div class="bg-red">
            一些播放控制按钮
          </div>
        </div>
      </div>
    </div>
    <p>
      但是，因为一些其他原因，导致我现在必须对整个控制栏，即绿色部分，设置position: absolute
    </p>
    <div class="w-full bg-green">
      <div class="absolute flex items-center flex-gap-4">
        <div class="h-10 w-10 shrink-0 bg-gray">
          头像
        </div>
        <div class="w-full flex flex-col flex-gap-1 truncate bg-blue">
          <div class="truncate bg-orange-300">
            这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
          </div>
          <div class="bg-orange-100">
            歌手
          </div>
        </div>
        <div class="flex shrink-0 items-center flex-gap-2">
          <div class="bg-red">
            一些播放控制按钮
          </div>
        </div>
      </div>
    </div>
    <p class="m-t-13">
      这时你会发现整个绿色部分的高度已经塌缩不见了，我们先不管这一点。将你的浏览器宽度拉小一点，你会发现text-overflow: ellipsis已经不是我们想要的效果了。虽然仍然有省略号，但x方向上已经超出了页面的范围。
    </p>
    <p>
      解决方法：对蓝色部分添加
    </p>
    <pre>
      .blue {
        flex: auto;
        /* 或min-width: 0; */
        width: 0;

        /* 去掉width: 100%; */

        /* 可去可不去 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    </pre>
    <p>此时就已经生效了。</p>
    <div class="w-full bg-green">
      <div class="absolute w-full flex items-center flex-gap-4">
        <div class="h-10 w-10 shrink-0 bg-gray">
          头像
        </div>
        <div class="w-0 flex flex-auto flex-col flex-gap-1 bg-blue">
          <div class="truncate bg-orange-300">
            这是一首很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的歌名
          </div>
          <div class="bg-orange-100">
            歌手
          </div>
        </div>
        <div class="flex shrink-0 items-center flex-gap-2">
          <div class="bg-red">
            一些播放控制按钮
          </div>
        </div>
      </div>
    </div>
    <p class="m-t-13">
    </p>
  </div>
</template>

<script setup lang="ts">

</script>
