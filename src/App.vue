<script setup lang="ts"></script>

<template>
  <van-config-provider theme="dark" />
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive>
        <suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="loading">
              <van-loading type="spinner" size="30px" />
            </div>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<style lang="scss" scoped>
.loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
