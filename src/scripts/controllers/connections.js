/**
 * Connections Controller
 * 
 * Handles all the data related to the web sites connected to the plugin, including
 * their URL, user friendly name and display icon.
 * It allows adding and removing new connections, as well as retrieving
 * connection specific data such as its access level.
 */

export default class ConnectionsController {
  #connections; //array of connections

  constructor(connections = []) {
    this.#connections = connections;
  }

  serialize() {
    if (this.#connections.length == 0) {
      return JSON.stringify([]);
    }

    return JSON.stringify(this.#connections);
  }

  static deserialize(_conns) {
    if (
      !_conns ||
      (!Array.isArray(_conns) && typeof _conns != 'string') ||
      _conns.length == 0
    ) {
      return new ConnectionsController();
    }
    let conns = JSON.parse(_conns);
    return new ConnectionsController(conns);
  }

  addConnected(url, icon, name, level, options) {
    return new Promise((resolve, reject) => {
      if (level < 1 || level > 3) return reject('ERR_INV_ACCESS_LEVEL');
      if (this.#connections.findIndex((c) => c.url == url) != -1) {
        return reject(`ERR_CONN_ALREADY_EXISTS`);
      }
      console.log(options);
      this.#connections.push({ url, icon, name, level, ...options });
      return resolve();
    });
  }

  changePermissionLevel(url, level) {
    return new Promise((resolve, reject) => {
      console.log(url, level);
      if (level < 1 || level > 3) return reject('ERR_INV_ACCESS_LEVEL');
      let index = this.#connections.findIndex((c) => c.url == url);

      if (index != -1) {
        this.#connections[index].level = level;
        return resolve(true);
      }
      return reject(`ERR_CONN_NOT_FOUND`);
    });
  }

  removeConnected(url) {
    console.log(url);
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) => {
      console.log(index);
      if (index != -1) {
        this.#connections.splice(index, 1);
        Promise.resolve(`DISCONNECTED(${url})`);
      } else {
        return Promise.reject(`ERR_CONN_NOT_FOUND`);
      }
    });
  }

  getAllConnections() {
    return this.#connections;
  }

  isConnected(url) {
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) => index != -1);
  }

  getConnectionAccessLevel(url) {
    return Promise.resolve(
      this.#connections.findIndex((c) => c.url == url)
    ).then((index) =>
      index == -1
        ? Promise.resolve(-1)
        : Promise.resolve(this.#connections[index].level)
    );
  }
}
