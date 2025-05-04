/**
 * QR Code utility functions
 * In a production environment, you might use a library like 'qrcode' to generate actual QR codes
 */

/**
 * Generate a short code for QR
 * @returns {String} Random short code
 */
const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate a URL for QR code
 * @param {String} shortCode - Short code for the QR
 * @param {String} baseUrl - Base URL for the QR code landing page
 * @returns {String} Full URL
 */
const generateQrUrl = (shortCode, baseUrl = 'https://staywise.com/qr') => {
  return `${baseUrl}/${shortCode}`;
};

/**
 * Generate a form schema for guest input
 * @param {String} type - QR code type
 * @returns {Array} Form schema
 */
const generateDefaultSchema = (type = 'room_service') => {
  // Different schema based on QR type
  switch (type) {
    case 'room_service':
      return [
        {
          name: 'name',
          label: 'Your Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your name'
        },
        {
          name: 'roomNumber',
          label: 'Room Number',
          type: 'text',
          required: true,
          placeholder: 'Enter your room number'
        },
        {
          name: 'orderItems',
          label: 'What would you like to order?',
          type: 'textarea',
          required: true,
          placeholder: 'Please specify your order items'
        },
        {
          name: 'specialInstructions',
          label: 'Special Instructions',
          type: 'textarea',
          required: false,
          placeholder: 'Any special instructions for your order'
        }
      ];
    
    case 'feedback':
      return [
        {
          name: 'name',
          label: 'Your Name',
          type: 'text',
          required: false,
          placeholder: 'Enter your name (optional)'
        },
        {
          name: 'roomNumber',
          label: 'Room Number',
          type: 'text',
          required: false,
          placeholder: 'Enter your room number (optional)'
        },
        {
          name: 'rating',
          label: 'How would you rate your stay?',
          type: 'select',
          required: true,
          options: [
            { label: 'Excellent', value: '5' },
            { label: 'Very Good', value: '4' },
            { label: 'Good', value: '3' },
            { label: 'Fair', value: '2' },
            { label: 'Poor', value: '1' }
          ]
        },
        {
          name: 'feedback',
          label: 'Your Feedback',
          type: 'textarea',
          required: true,
          placeholder: 'Please share your experience with us'
        },
        {
          name: 'emailForResponse',
          label: 'Email (if you would like us to respond)',
          type: 'email',
          required: false,
          placeholder: 'Your email address'
        }
      ];
    
    case 'information':
      return [];
    
    default:
      return [
        {
          name: 'name',
          label: 'Your Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your name'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: false,
          placeholder: 'Enter your email'
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
          placeholder: 'Enter your message'
        }
      ];
  }
};

/**
 * Process QR code submission data
 * @param {Object} data - Form submission data
 * @param {Object} qrCode - QR code document
 * @returns {Object} Processed data
 */
const processQrSubmission = (data, qrCode) => {
  // Increment submission count
  qrCode.submissions += 1;
  
  // Process data based on QR type
  switch (qrCode.type) {
    case 'room_service':
      return {
        type: 'room_service_order',
        data: {
          guestName: data.name,
          roomNumber: data.roomNumber,
          orderItems: data.orderItems,
          specialInstructions: data.specialInstructions,
          timestamp: new Date().toISOString(),
          qrCode: qrCode._id
        }
      };
    
    case 'feedback':
      return {
        type: 'guest_feedback',
        data: {
          guestName: data.name || 'Anonymous',
          roomNumber: data.roomNumber,
          rating: parseInt(data.rating),
          feedback: data.feedback,
          emailForResponse: data.emailForResponse,
          timestamp: new Date().toISOString(),
          qrCode: qrCode._id
        }
      };
    
    default:
      return {
        type: 'generic_submission',
        data: {
          ...data,
          timestamp: new Date().toISOString(),
          qrCode: qrCode._id
        }
      };
  }
};

module.exports = {
  generateShortCode,
  generateQrUrl,
  generateDefaultSchema,
  processQrSubmission
}; 