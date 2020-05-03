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

    // 测试代码：测试依赖收集
    // 0、创建watcher
    // 1、故意读一下data中的某个属性
    // 2、读属性会触发get(),就会执行Dep.target && dep.addDep(Dep.target)
    // 3、这样就把刚才指向的那个watcher添加到家deps中了
    // 4、接下来如果执行set(),就能通知watcher了
    // new Watcher();
    // this.$data.test;
    // new Watcher();
    // this.$data.foo.boo;

    new Compile(options.el, this);

    if (options.created) {
      options.created.call(this);
    }
  }

  observe(obj) {
    if (!obj || typeof obj !== 'object') {
      return;
    }
    // 遍历对象
    Object.keys(obj).forEach(key => {
      this.defineReactive(obj, key, obj[key]);
      // 把属性代理到vm上
      this.proxyData(key);
    })
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newVal) {
        this.$data[key] = newVal;
      }
    })
  }

  defineReactive(obj, key, val) {
    const dep = new Dep();

    Object.defineProperty(obj, key, {
      get() {
        // 将Dep.target添加到deps中
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal;
          // console.log(`${key}更新了：${newVal}`);
          dep.notify();
        }
      }
    })
    // 递归
    this.observe(val);
  }
}

class Dep {
  constructor() {
    // 将来的依赖watcher都放在deps里
    this.deps = [];
  }
  // 
  addDep(dep) {
    this.deps.push(dep);
  }
  // 通知所有的deps，统一去更新
  notify() {
    this.deps.forEach(dep => dep.update());
  }
}

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    // Dep的静态属性指向当前的watcher
    Dep.target = this;
    this.vm[this.key]; // 添加watcher到deps
    Dep.target = null;
  }

  update() {
    // console.log('属性更新了');
    this.cb.call(this.vm, this.vm[this.key]);
  }
}