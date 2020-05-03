/**
 * new HxlVue({
 *  data:{msg:'hello'}
 * })
 */
class HxlVue {
  constructor(options) {
    this.$options = options;

    // 处理data选项
    this.$data = options.data;
    // 响应化
    this.observe(this.$data);
  }

  observe(obj) {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    // 遍历对象
    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key]);
    })
  }

  defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        return val;
      },
      set(newVal) {
        if(newVal !== val) {
          val = newVal;
          console.log(`${key}更新了：${newVal}`);
        }
      }
    })
    this.observe(val);
  }
}