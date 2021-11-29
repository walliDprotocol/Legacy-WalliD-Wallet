import * as eth from '../lib/eth-utils';

/**
 * Configurations Controller
 * 
 * Handles and exposes the plugin's configurable parameters.
 * More specifically, it defines functions that allow for setting different Web3 providers
 * from outside the controller. 
 */

export default class ConfigurationsController {
  // #provider = "https://mainnset.infura.io/v3/96f71504c4da4ad5b87e567aa3a79c9b"
  #provider = 'https://rinkeby.infura.io/v3/96f71504c4da4ad5b87e567aa3a79c9b';

  constructor() {}

  setProvider(provider) {
    if (!provider) {
      return 'ERR_NULL_PROVIDER';
    }
    this.#provider = provider;
    return eth.setProvider(provider);
  }

  getProvider() {
    return this.#provider;
  }
}
