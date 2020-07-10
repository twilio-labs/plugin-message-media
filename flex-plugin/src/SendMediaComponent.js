import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import Button from './components/Button';

const buttonContainerStyle = {
  display: 'flex',
  'flex-direction': 'horizontal'
};

class UploadComponent extends React.Component {
  baseFunctionUrl = process.env.REACT_APP_MMS_FUNCTIONS_DOMAIN;
  uploadEndpoint = process.env.REACT_APP_UPLOAD_SERVICE_ENDPOINT;

  imageUrl =
    'https://images.unsplash.com/photo-1452873867668-7325bd9f4438?ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80';

  videoUrl =
    'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4';

  pdfUrl =
    'https://file-examples.com/wp-content/uploads/2017/10/file-sample_150kB.pdf';

  audioUrl =
    'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3';

  constructor(props) {
    super(props);
    this.inputFileRef = React.createRef();
  }

  onChange = async e => {
    const [file = null] = Array.from(e.target.files);

    if (file) {
      try {
        const channel = await this.retrieveChannel();

        channel.once('messageAdded', async (msg) => {
          const { media } = msg;
          if (media) {
            const mediaUrl = await media.getContentUrl();
            await this.sendMedia(mediaUrl, media.contentType, media.sid);
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

  uploadMedia = async file => {
    const { manager } = this.props;
    const formData = new FormData();
    formData.append('media', file);

    const options = {
      method: 'POST',
      headers: {
        'x-auth-token': manager.store.getState().flex.session.ssoTokenPayload
          .token
      },
      body: formData
    };

    try {
      const res = await fetch(this.uploadEndpoint, options);

      if (!res.ok) {
        throw new Error(`request error: ${res.status} - ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error while uploading the file', error);
      return;
    }
  };

  sendMediaMessage = async (to, mediaUrl, mediaSid) => {
    const { manager } = this.props;
    const sendMediaMessageUrl = `${this.baseFunctionUrl}/send-media-message`;
    const body = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      to,
      mediaUrl,
      mediaSid
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

  sendMedia = async (mediaUrl, mediaType, mediaSid) => {
    console.debug('component props:', this.props);
    const { task } = this.props;
    try {
      const channel = await this.retrieveChannel();
      console.debug('Retrieved channel object:', channel);

      const attributes = {
        media: mediaUrl,
        mediaType
      };

      await this.sendDummyMessage(channel, attributes);
      await this.sendMediaMessage(task.attributes.name, mediaUrl, mediaSid);
    } catch (error) {
      console.error('Error while sending media', error);
    }
  };

  retrieveChannel = async () => {
    const { manager, channelSid } = this.props;

    try {
      return await manager.chatClient.getChannelBySid(channelSid);
    } catch (error) {
      console.error('Error getting channel by sid.', error);
    }
  };

  sendDummyMessage = async (channel, attributes) => {
    try {
      return await channel.sendMessage('Media', attributes);
    } catch (error) {
      console.error('Error sending message.', error);
    }
  }

  render() {
    // TODO: This button should present a file browser so the agent can select
    // the file they want to send. The file should then be uploaded to a publicly
    // accessible location like an Amazon S3 bucket. The URL for the uploaded
    // file would get passed into the sendMedia function.
    return (
      <div style={buttonContainerStyle}>
        <Button
          key='image-button'
          label='Send Image'
          sendMedia={() => {
            this.sendMedia(this.imageUrl, 'image/jpeg');
          }}
        />
        <Button
          key='audio-button'
          label='Send Audio'
          sendMedia={() => {
            this.sendMedia(this.audioUrl, 'audio/mpeg');
          }}
        />
        <Button
          key='video-button'
          label='Send Video'
          sendMedia={() => {
            this.sendMedia(this.videoUrl, 'video/mp4');
          }}
        />
        <Button
          key='pdf-button'
          label='Send PDF'
          sendMedia={() => {
            this.sendMedia(this.pdfUrl, 'application/pdf');
          }}
        />
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
            key='custom-button'
            label='Send Custom'
            sendMedia={() => {
              this.inputFileRef.current.click();
            }}
          />
        </form>
      </div>
    );
  }
}

export default withTaskContext(UploadComponent);
