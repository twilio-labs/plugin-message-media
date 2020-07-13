import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';
import BubbleMessageWrapper from "./components/BuubleMessageWrapper/BubbleMessageWrapper";
import ImageModal from "./components/ImageModal/ImageModal";
import SendMediaComponent from './components/SendMediaComponent/SendMediaComponent';

const PLUGIN_NAME = 'SmsMediaPlugin';

export default class SmsMediaPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    flex.Actions.registerAction("smsModalControl", (payload) => {
      var event = new Event("smsModalControlOpen");
      event.url = payload.url;
      document.dispatchEvent(event);
      return Promise.resolve();
    });

    flex.MessageBubble.Content.add(<BubbleMessageWrapper key="image" />);

    flex.MainContainer.Content.add(<ImageModal key="imageModal" />, {
      sortOrder: 1
    });

    flex.MessageInput.Content.add(<SendMediaComponent key="sendMedia" manager={manager}/>);

    // ignore "media not supported" errors
    manager.strings.MediaMessageError = '';
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
