import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import Button from '../Button/Button';
import { ButtonWrapper } from './SendMediaComponent.Styles';

const smsChannelName = 'chat-sms';
const whatsappChannelName = 'chat-whatsapp';

class UploadComponent extends React.Component {
  baseFunctionUrl = process.env.REACT_APP_MMS_FUNCTIONS_DOMAIN;

  constructor(props) {
    super(props);
    this.inputFileRef = React.createRef();
  }

  onChange = async e => {
    const [file = null] = Array.from(e.target.files);

    if (file) {
      try {
        const { name: loggedWorkerName } = this.props.manager.workerClient;
        const channel = await this.retrieveChannel();

        // This listener isn't defined to listen to every message on the ComponentDidMount method to avoid 
        // sending duplicated media when there is more than one tab of Flex open in the user's browser
        channel.once('messageAdded', async (msg) => {
          const { media, author } = msg;

          if (author === loggedWorkerName && media) {
            const mediaUrl = await media.getContentUrl();
            await this.sendMediaMessage(mediaUrl);
          }
        });

        await channel.sendMessage({
          contentType: file.type,
          media: file
        }); 
      } catch (error) {
        console.error('Error while sending media', error);
        return;
      }
    }
  };

  sendMediaMessage = async (mediaUrl) => {
    const { manager, task } = this.props;
    const sendMediaMessageUrl = `${this.baseFunctionUrl}/send-media-message`;
    const { name: to } = task.attributes;
    const { channelDefinition } = this.props;
   
    const body = {
      mediaUrl,
      to,
      channel: channelDefinition.name,
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(body)
    };

    try {
      const response = await fetch(sendMediaMessageUrl, options);
      const json = await response.json();
      console.log(`Media message sent to ${to}.`, json);
    } catch (error) {
      console.error(`Error sending media message to ${to}.`, error);
    }
  };

  retrieveChannel = async () => {
    const { manager, channelSid } = this.props;

    try {
      return await manager.chatClient.getChannelBySid(channelSid);
    } catch (error) {
      console.error('Error fetching channel by sid.', error);
    }
  };

  render() {
    const { channelDefinition } = this.props;

    const allowedChannels = [
      whatsappChannelName,
      smsChannelName
    ];

    if (channelDefinition && !allowedChannels.includes(channelDefinition.name)) {
      return null;
    }

    return (
      <ButtonWrapper>
        <form>
          <input
            ref={this.inputFileRef}
            accept='
              image/jpeg,
              image/png,
              audio/mp3,
              audio/ogg,
              audio/amr,
              video/mp4,
              .pdf'
            name='media'
            onChange={this.onChange}
            type='file'
            hidden
          />
          <Button
            key='send-file-button'
            label='Send File'
            sendMedia={() => {
              this.inputFileRef.current.click();
            }}
          />
        </form>
      </ButtonWrapper>
    );
  }
}

export default withTaskContext(UploadComponent);
