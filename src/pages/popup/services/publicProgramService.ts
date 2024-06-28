export class PublicProgramService {
  constructor() {}

  public async getPublicPrograms() {
    // TODO : add the correct endpoint
    const res = await fetch('', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return data;
  }

  public async getBlacklistedPrograms() {
    // TODO : add the correct endpoint

    const res = await fetch('', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    return data;
  }
}
