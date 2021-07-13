import { css } from 'react-emotion';

const ImageStyle = css`
  margin: auto;
  display: block;
  width: 50%;
  height: 100%;
`;

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
    margin: auto;
    display: block;
    width: auto;
    height: auto;
    max-width: 300px;
    max-height: 300px;
    margin-top: 100px;
    filter: invert(98%) sepia(100%) saturate(0%) hue-rotate(143deg) brightness(100%) contrast(100%);
  }
  & > span {
    font-size: x-large;
    font-weight: bold;
    text-transform: uppercase;
  }
`;
