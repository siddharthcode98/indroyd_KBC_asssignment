import { QRCodeCanvas } from "qrcode.react";
const Qrcode = () => {
  return (
    <div className="bg-gradient-to-r from-kbc-color1 to-kbc-color2 h-screen w-full bg-cover p-5 text-white flex flex-col justify-center gap-3">
      <h1 className="text-3xl font-bold text-center">
        Scan the QR code to play the game
      </h1>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={`https://indroydkbc.netlify.app/`}
          size={300}
          title="Scan the QR Code to play the game"
        />
      </div>
    </div>
  );
};

export default Qrcode;
