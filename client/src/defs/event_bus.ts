interface IStore {
  [key: string]: Function[];
}
class EventBus {
  stores: IStore = {};
  on (eventName: string, fn: Function) {
    if (typeof fn != "function") {
      console.error('fn must be a function');
      return
    }
    if (!this.stores[eventName]) {
      this.stores[eventName] = [];
    }
    this.stores[eventName].push(fn);
  }

  emit (eventName: string, params?: any) {
    const store = this.stores[eventName];
    if (store) {
      store.forEach(s => {
        setTimeout(() => {
          s(params);
        })
      }, 0);
    }
  }

  off (eventName: string, fn: Function | number) {
    if (!this.stores[eventName]) {
      return;
    }
    if (typeof fn === 'number') {
      delete this.stores[eventName];
      return;
    }
    for (let i = 0; i < this.stores[eventName].length; i++) {
      if (this.stores[eventName][i] === fn) {
        this.stores[eventName].splice(i, 1);
      }
    }
  }
}
export default new EventBus();
