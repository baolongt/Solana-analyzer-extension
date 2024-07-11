import axios from 'axios';
import yaml from 'js-yaml';

let instance: PhantomWalletBlacklist | undefined;

export class PhantomWalletBlacklist {
  private records: Set<string> = new Set();

  constructor(records: Set<string>) {
    this.records = records;
  }

  isBlacklisted(url: string) {
    return this.records.has(url);
  }

  getList() {
    return this.records;
  }

  public static getInstance = async () => {
    if (!instance) {
      const records = await fetchAndParseYaml();
      return new PhantomWalletBlacklist(records);
    }
    return instance;
  };
}

export async function fetchAndParseYaml() {
  const response = await axios.get('https://raw.githubusercontent.com/phantom/blocklist/master/blocklist.yaml');
  const data = yaml.load(response.data);
  const records = new Set<string>(data.map((record: { url: string }) => record.url));
  return records;
}
