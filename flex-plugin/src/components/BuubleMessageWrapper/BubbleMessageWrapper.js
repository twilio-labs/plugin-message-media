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

    if (message.media) {
      const mediaUrl = await message.media.getContentUrl();
      this.setState({ mediaUrl });
    }
  }

  render() {
    const message = this.props.message.source;
    const { media, mediaType } = message.attributes;

    // Messages sent by the agent
    if (this.state.mediaUrl) {
      return (
        <BubbleMessageWrapperDiv>
          <MediaMessageComponent mediaUrl={this.state.mediaUrl} mediaType={message.media.contentType} />
        </BubbleMessageWrapperDiv>
      );
    } else if (media && mediaType) { // incoming messages with media
      return (
        <BubbleMessageWrapperDiv>
         <MediaMessageComponent mediaUrl={media} mediaType={mediaType} />
        </BubbleMessageWrapperDiv>
      );
    }

    return <div />;
  }
}

export default MessageImageComponent;
