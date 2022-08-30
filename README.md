#About WalliD wallet

WalliD wallet allows users to create and manage an Ethereum wallet (address, public and private keys) through a javascript enabled browser extension. <br>It provides authentication for the web2, web3, self-sovereign storage of ID assets in the browser local memory and enables users to provide a proof-of-ownership over those assets in dApps or centralized webapps.<br> 
The *src* folder contains all the code that describes the plugin's behaviour and features. More specifically, the *scripts* folder contains all of the plugin's backend code. 


### About LUKSO buildup Hackathon 2022:
___

### /src/scripts:
* **controllers:** contain collection of controller modules built around clearly defined data entities. These modules are responsible for managing the plugin's multiple data entities and implementing all relevant functionalities relating to them.

* **lib:** contains a collection of functional modules responsible for the implementation of features not specific to any controller. It contains miscelaneous utility functions meant to be imported and used by the main application instances, controllers or any other scripts like the content-script.  

* **resources:** contains all resources not directly related to the plugin's configuration. Currently used to store the ABIs of the smart-contracts that the plugin interacts with.

* **app-controller.js:** contains the implementation of the AppController module which represents the main plugin instance running in the browser's background process. It provides all necessary methods to interact with the backend subsytem. It is responsible for managing the plugin's internal state and controller instances. 
All controller modules are instanciated within the main AppController instance. Controller modules should not be accessed directly. Instead any interaction with the controllers should be done through wrapped functions provided by the main AppController instance. 
This instance also provides a permissioned RequestAPI which exposes select controller features to WebApps. This allows applications to interact with the plugin's state and use its available features like, importing new assets or using cryptographic functions. The methods provided by the `RequestAPI` require apps to have certain access levels in order to access them. Applications can use a specific methods to request a given access level, which will in turn present the user with a popup window enabling him to accept or decline the requested access level. 
The AppController instance also exposes an internal API to the UI subsystem whose goal is to provide the plugin's UI components with all the functionalities they might need in order to implement the various user flows within the plugin.

* **background.js:** specific Chrome extension ManifestV2 script (https://developer.chrome.com/docs/extensions/mv2/background_pages/).
The background script is persistent, meaning it continuously runs in the browser's background process despite the plugin being in use or not. The main AppController instance runs inside the background script. The in-memory state of the application is maintained within the context of this script.

* **content-script.js:** a specific Chrome extension script (https://developer.chrome.com/docs/extensions/mv3/content_scripts/).
The content-script provides a way for the plugin to interface with web applications. The script is injected into web pages according to the whitelist defined in the *manifest.json* file. In the context of the plugin, the content-script is used to inject code that allows web applications to interact with the plugin's RequestAPI and listen to relevant events emmited by the backend. 

___

#### NOTE
This extension is built using ManifestV2. Google has recently launched ManifestV3 which introduces a big shift to the extensions platform, notably the replacement of background pages for service workers.

