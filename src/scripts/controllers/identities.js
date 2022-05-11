const InitState = {
  identities: [],
};

/**
 * Identities Controller
 * 
 * Handles all operations related to the user's identities.
 * Identities differ from credentials in their format and the data they contain.
 * Identities are a more clearly defined subset of credentials.
 * 
 * Provides specific methods for adding and removing stored credentials.
 */
export default class IdentitiesController {
  #identities;

  constructor(identities = []) {
    this.#identities = identities;
  }

  serialize() {
    if (this.#identities.length == 0) {
      return JSON.stringify([]);
    }
    return JSON.stringify(this.#identities);
  }

  static deserialize(_ids) {
    if (
      !_ids ||
      (!Array.isArray(_ids) && typeof _ids != 'string') ||
      _ids.length == 0
    ) {
      return new IdentitiesController();
    }
    let identities = JSON.parse(_ids);
    return new IdentitiesController(identities);
  }

  addIdentity(idt, data, ow, expDate, idtName) {
    return new Promise((resolve, reject) => {
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#identities.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);

        return reject(`Identity type ${idt} already exists`);
      }
      this.#identities.push({ idt, data, expDate, idtName });

      return resolve();
    });
  }

  importAsset(idt, { idtName, data, expDate }, ow = true) {
    return new Promise((resolve, reject) => {
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index != -1 && ow) {
        console.log('ALREADY EXISTs w/ OW', index);
        this.#identities.splice(index, 1);
      } else if (index != -1) {
        console.log('ALREADY EXISTs', index);

        return reject(`Identity type ${idt} already exists`);
      }
      this.#identities.push({ idt, data, expDate, idtName });

      return resolve({
        idt,
        data,
        expDate,
        idtName,
        vaultName: 'putIdentities',
      });
    });
  }

  exportAsset(idt) {
    return new Promise((resolve, reject) => {
      console.log('log id get', idt);
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index == -1) {
        console.log('ALREADY EXISTs', index);
        return reject(`ERR_IDENTITY_INEXISTENT`);
      }
      return resolve(this.#identities[index]);
    });
  }

  extractIdentity(idt) {
    return new Promise((resolve, reject) => {
      console.log(this.#identities);
      console.log(idt);
      const index = this.#identities.findIndex((id) => id.idt == idt);
      if (index == -1) {
        console.log('DOES NOT EXIST', index);
        return reject(`Identity type ${idt} DOES NOT exist`);
      } else {
        console.log('EXISTs', index);
        resolve(this.#identities[index]);
      }
    });
  }

  deleteIdentity(idt) {
    return new Promise((resolve, reject) => {
      const index = this.#identities.findIndex((id) => id.idt == idt);

      if (index != -1) {
        console.log('EXISTs w/ ', index);
        this.#identities.splice(index, 1);
        return resolve();
      } else {
        return reject(`Profile id  ${idt}  doesn´t exists`);
      }
    });
  }

  get() {
    return this.#identities;
  }

  getIDTsList() {
    return this.#identities.map((id) => {
      return {
        idt: id.idt,
        idtName: id.idtName,
      };
    });
  }
  getList() {
    return this.#identities.map((id) => {
      return {
        idt: id.idt,
        idtName: id.idtName,
      };
    });
  }
}
