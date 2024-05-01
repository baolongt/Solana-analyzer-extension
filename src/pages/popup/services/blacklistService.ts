export class BlackListService {
  public blacklist: Set<string>;
  constructor() {
    this.blacklist = new Set();
  }
  add(address) {
    this.blacklist.add(address);
  }
  remove(address) {
    this.blacklist.delete(address);
  }
  isBlacklisted(address) {
    return this.blacklist.has(address);
  }
}
