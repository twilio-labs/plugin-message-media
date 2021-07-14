import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';
import Button from '../Button/Button';
import { ButtonWrapper } from './SendMediaComponent.Styles';

class UploadComponent extends React.Component {

  constructor(props) {
    super(props);
    this.inputFileRef = React.createRef();
    this.formFileRef = React.createRef();
  }

  onChange = async e => {
    const { channelSid, channelDefinition, task } = this.props;
    const [file = null] = Array.from(e.target.files);

    if (file) {
      this.props.loading.current.show();
      return this.props.sendMediaService.sendMedia(file, channelSid, channelDefinition, task)
        .then(() => this.props.loading.current.hide());
    }

    return;
  };

  render() {
    const { channelDefinition } = this.props;

    if (channelDefinition && !this.props.allowedChannels.includes(channelDefinition.name)) {
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
