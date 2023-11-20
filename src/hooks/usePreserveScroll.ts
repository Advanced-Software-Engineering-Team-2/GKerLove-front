import { useScrollParent } from '@vant/use'
import { Ref, nextTick, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

export const usePreserveScroll = (root: Ref<HTMLElement | undefined>, routeName: string) => {
  let lastScrollTop = 0
  const scrollParent = useScrollParent(root) as Ref<HTMLElement>
  const route = useRoute()

  watch(
    () => route.params,
    () => {
      if (route.name !== routeName) return
      nextTick(() => scrollParent.value.scrollTo(0, lastScrollTop))
    }
  )

  onBeforeRouteLeave((_to, _from, next) => {
    lastScrollTop = scrollParent.value.scrollTop
    next()
  })
}
