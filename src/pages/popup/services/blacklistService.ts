let instance: BlackListService | undefined;
let urlInstance: URLBlackListService | undefined;

export class BlackListService {
  private blacklist: Set<string>;
  constructor() {
    this.blacklist = localStorage.getItem('blacklist')
      ? new Set(JSON.parse(localStorage.getItem('blacklist')))
      : new Set();
  }
  add(address: string) {
    this.blacklist.add(address);
    this.save();
  }
  remove(address: string) {
    this.blacklist.delete(address);
    this.save();
  }
  isBlacklisted(address: string) {
    return this.blacklist.has(address);
  }
  save() {
    localStorage.setItem('blacklist', JSON.stringify(Array.from(this.blacklist)));
  }

  public static getInstance() {
    if (!instance) {
      instance = new BlackListService();
    }
    return instance;
  }
}

export class URLBlackListService {
  private blacklist: Set<string>;
  constructor() {
    this.blacklist = localStorage.getItem('blacklist')
      ? new Set(JSON.parse(localStorage.getItem('blacklist')))
      : new Set();
  }
  add(url: string) {
    this.blacklist.add(url);
    this.save();
  }
  remove(url: string) {
    this.blacklist.delete(url);
    this.save();
  }
  isBlacklisted(url: string) {
    return this.blacklist.has(url);
  }
  save() {
    localStorage.setItem('blacklist', JSON.stringify(Array.from(this.blacklist)));
  }

  public static getInstance() {
    if (!urlInstance) {
      urlInstance = new URLBlackListService();
    }
    return urlInstance;
  }
}
