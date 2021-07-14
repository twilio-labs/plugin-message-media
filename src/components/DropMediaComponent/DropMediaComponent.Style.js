import { css } from 'react-emotion';

export const DropAreaStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(100,100,100,.5);
  text-align: center;
  & > img {
    width: 26%;
    height: auto;
    max-width: 300px;
    max-height: 300px;
    filter: invert(98%) sepia(100%) saturate(0%) hue-rotate(
130deg
) brightness(100%) contrast(100%);
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;
