const axios = require('axios').default;
const qs = require('querystring');

class ChronoApi {
  constructor() {
    this.http = axios.create({
      baseURL: 'https://www.chronodrive.com',
      // proxy: {
      //   host: '127.0.0.1',
      //   port: 8888,
      // },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async login(username, password) {
    const response = await this.http.post(
      '/mobile/ws/login',
      qs.stringify({
        v2: true,
        login: username,
        password,
      })
    );
    if (response.status !== 200) throw new Error(response.statusText);
    this.token = response.data.token;
    this.user = {
      id: response.data.infos[0],
      email: response.data.email,
      fullname: `${response.data.infos[1]} ${response.data.infos[3]} ${response.data.infos[2]}`,
    };
    this.shop = {
      id: response.data.infos[4],
      name: response.data.infos[5],
    };
    return this.user;
  }

  async addToCart(productId) {
    const response = await this.http.post(
      '/mobile/ws/ChangeQuantities',
      qs.stringify({
        v3: true,
        shopId: this.shop.id,
        device: 'iPhone',
        userId: this.user.id,
        token: this.token,
        cugs: `,${productId},1`,
      })
    );
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data.status;
  }
}

module.exports = ChronoApi;
