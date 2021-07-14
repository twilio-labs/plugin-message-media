import React from 'react';
import { withTaskContext } from '@twilio/flex-ui';

class PasteMediaComponent extends React.Component {

  handlePaste = async (e) => {
    if(!e.clipboardData || !e.clipboardData.files[0]) {
      console.log('No file attached');
      return;
    }

    const { sid: channelSid, channelDefinition, task } = this.props;

    if (!this.props.allowedChannels.includes(channelDefinition.name)) {
      console.log('Channel does not supports media');
      return;
    }

    const file = e.clipboardData.files[0];
    if (file) {
      this.props.loading.current.show();
      return this.props.sendMediaService.sendMedia(file, channelSid, channelDefinition, task)
        .then(() => this.props.loading.current.hide());
    }

    return;
  }

  componentDidMount() {
    window.addEventListener('paste', this.handlePaste);
  }

  componentWillUnmount() {
    window.removeEventListener('paste', this.handlePaste);
  }

  render() {
    return null;
  }
}

export default withTaskContext(PasteMediaComponent);
