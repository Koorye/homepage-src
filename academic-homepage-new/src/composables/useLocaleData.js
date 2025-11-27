// composables/useLocaleData.js
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

/**
 * 获取国际化数据（支持对象/数组类型）
 * @param {string} namespace - 命名空间（如 'awards', 'experience'）
 * @param {string} [key] - 可选的子键（如 'data', 'title'）
 * @returns {ComputedRef} 响应式的国际化数据
 */
export function useLocaleData(namespace, key) {
  const { locale, messages } = useI18n({ useScope: 'global' })
  
  return computed(() => {
    const currentLocale = locale.value
    const data = messages.value[currentLocale]?.[namespace]
    
    if (!data) {
      console.warn(`Locale data not found for namespace: ${namespace}`)
      return key ? undefined : {}
    }
    
    return key ? data[key] : data
  })
}

/**
 * 获取国际化列表数据的快捷方法
 * @param {string} namespace - 命名空间
 * @returns {ComputedRef<Array>} 响应式的列表数据
 */
export function useLocaleList(namespace) {
  return useLocaleData(namespace, 'data')
}

/**
 * 获取国际化标题的快捷方法
 * @param {string} namespace - 命名空间
 * @returns {ComputedRef<string>} 响应式的标题文本
 */
export function useLocaleTitle(namespace) {
  return useLocaleData(namespace, 'title')
}