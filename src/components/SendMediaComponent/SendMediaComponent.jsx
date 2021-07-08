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
    this.formFileRef = React.createRef();
  }

  handlePaste = (ev) => {
    if (!ev.clipboardData || !ev.clipboardData.files[0]) {
      console.log('No file attached');
      return;
    }

    this.sendFile(ev.clipboardData.files[0]);
  }

  onChange = async e => {
    const { channelSid, channelDefinition, task } = this.props;
    const [file = null] = Array.from(e.target.files);

    if (file) {
      await this.props.sendMediaService.sendMedia(file, channelSid, channelDefinition, task);
    }
  };

  componentDidMount() {
    window.addEventListener('paste', this.handlePaste);
  }

  componentWillUnmount() {
    window.removeEventListener('paste', this.handlePaste);
  }

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
        <form ref={this.formFileRef}>
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
