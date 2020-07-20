import React, { Component } from 'react';

import { BubbleMessageWrapperDiv } from './BubbleMessageWrapper.Styles';
import MediaMessageComponent from '../MediaMessage/MediaMessage';

class MessageImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaUrl: ''
    };
  }

  async componentDidMount() {
    const message = this.props.message.source;

    if (message && message.media) {
      const mediaUrl = await message.media.getContentUrl();
      this.setState({ mediaUrl });
    }
  }

  render() {
    const message = this.props.message.source;

    // Messages sent by the agent
    if (this.state.mediaUrl) {
      return (
        <BubbleMessageWrapperDiv>
          <MediaMessageComponent
            mediaUrl={this.state.mediaUrl}
            mediaType={message.media && message.media.contentType}
          />
        </BubbleMessageWrapperDiv>
      );
    } else if (
      message.attributes &&
      message.attributes.media &&
      message.attributes.mediaType
    ) {
      // incoming messages with media
      return (
        <BubbleMessageWrapperDiv>
          <MediaMessageComponent
            mediaUrl={message.attributes.media}
            mediaType={message.attributes.mediaType}
          />
        </BubbleMessageWrapperDiv>
      );
    }

    return <div />;
  }
}

export default MessageImageComponent;
