/* eslint-disable */

import { QRCode } from "react-qrcode-logo";

const BarCodeDisplay = ({ text }: { text: string }) => {
  return <QRCode value={text} size={300} qrStyle="dots" eyeRadius={10}  />;
};

export default BarCodeDisplay;
