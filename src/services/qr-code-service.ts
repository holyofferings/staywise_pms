import QRCode from 'qrcode';

export const generateQRCode = async (
  data: string
) => {
  try {
    // Generate QR code image as data URL
    const qrImageDataUrl = await QRCode.toDataURL(data);
    return qrImageDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

export const generateQRCodeBuffer = async (
  data: string
) => {
  try {
    // Generate QR code image as buffer
    const qrBuffer = await QRCode.toBuffer(data);
    return qrBuffer;
  } catch (error) {
    console.error("Error generating QR code buffer:", error);
    throw new Error("Failed to generate QR code buffer");
  }
}; 