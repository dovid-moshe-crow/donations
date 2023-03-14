/* eslint-disable */

import { QRCode } from "react-qrcode-logo";

const BarCodeDisplay = ({ text }: { text: string }) => {
  return <QRCode value="https://github.com/gcoro/react-qrcode-logo" size={300} qrStyle="dots" eyeRadius={10}  />;
};

export default BarCodeDisplay;
