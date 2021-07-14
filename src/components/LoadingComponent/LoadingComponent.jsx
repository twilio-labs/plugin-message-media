import React from 'react';
import { LoadingWrapper, Spinner } from './LoadingComponent.Styles';

class LoadingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = { visible: false };
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  render() {
    if (this.state.visible) {
      return (
        <LoadingWrapper>
          <div className={Spinner}></div>
        </LoadingWrapper>
      );
    }

    return <div></div>;
  }
}

export default LoadingComponent;
