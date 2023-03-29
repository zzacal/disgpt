export class Cooldowns {
  constructor(private timeout: number, private cache = new Map<string, number>()) {}
  get(key: string): number {
    const timeleft = this.cache.get(key);
    if(timeleft) {
      return timeleft - Date.now();
    }
    return 0;
  }

  set(key: string) {
    this.cache.set(key, Date.now() + this.timeout)
    setTimeout(() => this.cache.delete(key), this.timeout);
  }
}
