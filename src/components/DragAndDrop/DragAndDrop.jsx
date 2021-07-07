import React from 'react';
import { css } from 'react-emotion';
import { withTaskContext } from '@twilio/flex-ui';

import { DropAreaStyle } from './DragAndDrop.Style.js';

class DragAndDrop extends React.Component {

  dropAreaRef = React.createRef();

  counter = 0;

  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };
  }

  handleDragEnter = (e) => {
    console.log('handleDragEnter', e);

    if (this.state.dragging === false) {
      this.setState({ dragging: true });
    }

    this.counter++;

    e.preventDefault();
    e.stopPropagation();
  }

  handleDragLeave = (e) => {
    console.log('handleDragLeave', e);

    this.counter--;

    if (this.counter === 0) {
      this.setState({ dragging: false });
    }

    e.preventDefault();
    e.stopPropagation();
  }

  handleDropOnInvalidArea = (e) => {
    console.log('handleDropOnInvalidArea', e);

    this.counter = 0;
    this.setState({ dragging: false });

    e.preventDefault();
    e.stopPropagation();
  }

  handleDropOnDropArea = (e) => {
    console.log('handleDrop', e);

    this.counter = 0
    this.setState({ dragging: false });

    e.preventDefault();
    e.stopPropagation();
  }

  componentDidMount() {
    const div = this.dropAreaRef.current;

    window.addEventListener('dragenter', this.handleDragEnter);
    window.addEventListener('dragleave', this.handleDragLeave);
    window.addEventListener('drop', this.handleDropOnInvalidArea);
    div.addEventListener('drop', this.handleDropOnDropArea);
  }

  componentWillUnmount() {
    const div = this.dropAreaRef.current;

    window.removeEventListener('dragenter', this.handleDragEnter);
    window.removeEventListener('dragleave', this.handleDragLeave);
    window.removeEventListener('drop', this.handleDropOnInvalidArea);
    div.removeEventListener('drop', this.handleDropOnDropArea);
  }

  render() {
    const style = (this.state.dragging) ? DropAreaStyle : null;
    return (
      <div ref={this.dropAreaRef} className={style}></div>
    );
  }
}

export default withTaskContext(DragAndDrop);
