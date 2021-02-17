<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>
 
# WhatsApp MMS for Flex WebChat

The WhatsApp MMS for Flex Webchat plugin allows you to send a media message over WhatsApp and render it within a Flex chat window. Upon sending the message, any qualified agent will see an incoming chat request from a WhatsApp number following the `whatsapp:<E.164-formatted phone number>` format.

## Set up

### Requirements

To deploy this plugin, you will need:
- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project) to create one.
- npm version 5.0.0 or 6 installed (type `npm -v` in your terminal to check)
- Node version 10.12.0 or later installed (type `node -v` in your terminal to check)
- A mobile device with WhatsApp installed
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) and the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). * Run the following commands to install them:
   ```
   # Install the Twilio CLI
   npm install twilio-cli -g
   # Install the Serverless and Flex as Plugins
   twilio plugins:install @twilio-labs/plugin-serverless
   twilio plugins:install @twilio-labs/plugin-flex@beta
   ```
   
   The Twilio CLI with the Serverless and Flex Plugins are recommended for local development and debugging purposes, but you have the option to use the Functions UI in the Twilio Console.


### Twilio Account Settings

Before we begin, we need to collect
all the config values we need to run the plugin on your Flex application:

| Config&nbsp;Value | Description                                                                                                                                                  |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account&nbsp;Sid  | Your primary Twilio account identifier - find this [on the Console Dashboard](https://www.twilio.com/console).                                                         |
| Auth Token  | Your Twilio Auth Token, which acts as your password - find this [on the Console Dashboard](https://www.twilio.com/console).                                                         |
| Chat Service SID | Unique identifier for your Flex Chat Service. You can find this on the [Programmable Chat Dashboard](https://www.twilio.com/console/chat/dashboard).                                    |
| Twilio WhatsApp Number | The WhatsApp number to use when sending messages to a WhatsApp recipient. You can find this either on the [Twilio Sandbox for WhatsApp page](https://www.twilio.com/console/sms/whatsapp/learn) if you're using a test number, or the [WhatsApp Senders](https://www.twilio.com/console/sms/whatsapp/senders) if you've enabled personalized WhatsApp numbers.                                  |
| Twilio SMS Number | A Twilio phone number with MMS capability. You can check your numbers in the [Phone Numbers Dashboard](https://www.twilio.com/console/phone-numbers/incoming). |

## Plugin details

Twilio Proxy does not support media messages natively, so it is necessary to monitor Proxy messages to detect media messages and then update the Flex Chat Channel message attributes with the media URL and media type. To facilitate sending MMS via WhatsApp and rendering the media on the Flex Chat UI, we have added the following Twilio Functions:

1) **mms-handler.protected.js**: This Twilio Function will be called every time a Proxy interaction occurs. It uses the Proxy Callback URI to check for the existence of an MMS in an incoming message.

2) **send-media-message.js**: This Twilio Function is called by the Flex plugin to send the media to the recipient using the Programmable Messaging API. Since Proxy does not currently support media messages, we have to bypass it and call the Programmable Messaging API directly.

You can upload these functions to your Twilio account in two ways: deploying via the Twilio CLI or copying and pasting the Functions code into the [Functions UI](https://www.twilio.com/console/functions/manage) within the Console. Make sure to set the environment variables and package dependencies regardless of which method you use.

### Local development

After the above requirements have been met:

1. Clone this repository

```
git clone https://github.com/twilio-labs/plugin-message-media.git
```

2. Change into the `public` subdirectory of the repo and run the following:

```
cd plugin-queued-callbacks-and-voicemail/public && mv appConfig.example.js appConfig.js
```

3. Open **appConfig.js** with your text editor and update the accountSid variable with your account SID:

```
var accountSid = 'ACXXXXX'
```

4. Install dependencies

```bash
npm install
```

5. [Deploy your Twilio Functions and Assets](#twilio-serverless-deployment) 

6. Set your environment variables

```bash
npm run setup
```

See [Twilio Account Settings](#twilio-account-settings) to locate the necessary environment variables.

4. Run the application

```bash
npm start
```

Alternatively, you can use this command to start the server in development mode. It will reload whenever you change any files.

```bash
npm run dev
```

5. Navigate to [http://localhost:3000](http://localhost:3000)

That's it!

## Serverless Deployment

### Twilio CLI Setup

First of all, clone this repo in your machine. Then, make sure the [twilio-cli](https://www.twilio.com/docs/twilio-cli/quickstart) is installed in your machine. You can check it by typing `twilio` in your terminal:

```zsh
$ twilio

# output: 

unleash the power of Twilio from your command prompt

VERSION
  twilio-cli/2.3.0 darwin-x64 node-v12.14.1

USAGE
  $ twilio [COMMAND]
  [...]
```

If it is not installed, follow [this quickstart](https://www.twilio.com/docs/twilio-cli/quickstart) to install it.

After that, run the `twilio profiles:list` command and check if the active account is the one that you want to use for sending and receiving media:

```zsh
$ twilio profiles:list

ID               Account SID                         Active
flex-whatsapp    AC00000000000000000000000000000000  true  
other-account    AC00000000000000000000000000000000        
not-this-one     AC00000000000000000000000000000000         
```

If your Flex account is in the list but is not the active one, you can switch to it using the command `twilio profiles:use <YOUR-FLEX-ACCOUNT-ID>`.

If this is the first time you are using the `twilio-cli` or if your Flex account is not on the list, you should run the `twilio login` command and provide your **ACCOUNT_SID** and your **AUTH_TOKEN**.

### Installing the Serverless plugin and deploying the Functions

In the case that the `twilio-cli` was already installed in your machine, verify if the [serverless plugin](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit) is installed as well:

```zsh
$ twilio plugins
@twilio-labs/plugin-rtc 0.1.6
@twilio-labs/plugin-serverless 1.1.1 # Serverless Plugin
```

If it is not in the list, run the following command to install it:

```zsh
$ twilio plugins:install @twilio-labs/plugin-serverless
```

Inside the folder `twilio-functions` of this repository, copy the `.env.example` and create a `.env` file. Fill it with the pieces of information defined in the example file. Check the previous description of the environment variables if you need more details about them.

```
ACCOUNT_SID=AC0000000000000000000000000000000000
AUTH_TOKEN=0000000000000000000000000000000000000
CHAT_SERVICE_SID=IS00000000000000000000000000000
PROXY_SERVICE=KS00000000000000000000000000000000
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_SMS_NUMBER=+19999999999
```

After providing all these data, you can deploy these functions to your account:

```zsh
$ twilio serverless:deploy

# Output: 

Deployment Details
Domain: your-domain-dev.twil.io
Service:
   mms-media (ZS0000000000000000000000000000)
Environment:
   dev (ZE0000000000000000000000000000) 
Build SID:
   ZB0000000000000000000000000000
View Live Logs:
   https://www.twilio.com/console/assets/api/ZS0000000000000000000000000000/environment/ZE0000000000000000000000000000
Functions:
   [protected] https://your-domain-dev.twil.io/mms-handler
   https://your-domain-dev.twil.io/send-media-message
Assets:
```

When the deploy process finishes, copy and save the Functions' and the Domain's URL.

### Twilio Serverless deployment

You need to deploy the functions associated with the Callback and Voicemail Flex plugin to your Flex instance. The functions are called from the plugin you will deploy in the next step and integrate with TaskRouter, passing in required attributes to generate the callback and voicemail tasks, depending on the customer selection while listening to the in-queue menu options.

#### Pre-deployment Steps

Step 1: From the root directory of your copy of the source code, change into `public/resources` and rename `.env.example` to `.env`.

```
cd public/resources && mv .env.example .env
```

Step 2: Open `.env` with your text editor and modify TWILIO_WORKSPACE_SID with your Flex Task Assignment SID.

```
TWILIO_WORKSPACE_SID=WSxxxxxxxxxxxxxxxxxxxxxx`
```

To deploy your Callback and Voicemail functions and assets, run the following:

```
resources $ twilio serverless:deploy --assets

# Example Output
Deploying functions & assets to the Twilio Runtime
Env Variables
⠇ Creating 4 Functions
✔ Serverless project successfully deployed

Deployment Details
Domain: plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io
Service:
   plugin-queued-callbacks-voicemail-functions 
Functions:
   https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/inqueue-callback

https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/inqueue-utils  

https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/queue-menu
   https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/inqueue-voicemail

Assets:
   https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/assets/alertTone.mp3
   https://plugin-queued-callbacks-voicemail-functions-2075-dev.twil.io/assets/guitar_music.mp3
```

Copy and save the domain returned when you deploy a function. You will need it in the next step. 

If you forget to copy the domain, you can also find it by navigating to [Functions > API](https://www.twilio.com/console/functions/api) in the Twilio Console.

> Debugging Tip: Pass the -l or logging flag to review deployment logs. For example, you can pass `-l debug` to turn on debugging logs.

### Deploy your Flex Plugin 

Once you have deployed the function, it is time to deploy the plugin to your Flex instance.

Run the following commands in the plugin root directory. We will leverage the Twilio CLI to build and deploy the Plugin.

- Rename `.env.example` to `.env`.
- Open `.env` with your text editor and modify the `REACT_APP_SERVICE_BASE_URL` property to the Domain name you copied in the previous step. Make sure to prefix it with "https://".

```
plugin-queued-callbacks-and-voicemail $ mv .env.example .env

# .env
REACT_APP_SERVICE_BASE_URL=https://plugin-queued-callbacks-voicemail-functions-4135-dev.twil.io
```

When you are ready to deploy the plugin, run the following in a command shell:

```
plugin-queued-callbacks-and-voicemail $ twilio flex:plugins:deploy --major --changelog "Updating to use the latest Twilio CLI Flex plugin" --description "Queued callbacks and voicemail"
``` 

To enable the plugin on your contact center, follow the suggested next step on the deployment confirmation. To enable it via the Flex UI, see the [Plugins Dashboard documentation](https://www.twilio.com/docs/flex/developer/plugins/dashboard#stage-plugin-changes).


## Credits



## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.

[twilio]: https://www.twilio.com
