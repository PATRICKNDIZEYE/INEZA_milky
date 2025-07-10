// .env variables required:
// FDI_SMS_USERNAME, FDI_SMS_PASSWORD, FDI_SMS_SENDER_ID
import axios from "axios";
// If you see type errors for axios, run: npm install --save-dev @types/axios

export default class SmsService {
  private static AUTH_URL = "https://messaging.fdibiz.com/api/v1/auth/";
  private static SMS_URL = "https://messaging.fdibiz.com/api/v1/mt/single";
  private static tokenCache: { token: string; expiresAt: number } | null = null;

  private static async getAuthToken() {
    try {
      if (
          this.tokenCache &&
          this.tokenCache.expiresAt > Date.now() + 60000 // Check if token expires in more than 1 minute
      ) {
        return this.tokenCache.token;
      }

      const response = await axios.post(this.AUTH_URL, {
        api_username: process.env.FDI_SMS_USERNAME,
        api_password: process.env.FDI_SMS_PASSWORD
      });

      const data = response.data as any;
      if (data?.access_token) {
        this.tokenCache = {
          token: data.access_token,
          expiresAt: new Date(data.expires_at).getTime()
        };
        return data.access_token;
      }

      throw new Error('Failed to get authentication token');
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Failed to authenticate with FDI SMS API');
    }
  }

  static async sendSms(phoneNumber: string, message: string) {
    try {
      console.log('Original phone number:', phoneNumber);
      
      // Remove any non-digit characters
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      console.log('After removing non-digits:', formattedPhone);

      // Remove leading 250 if present
      if (formattedPhone.startsWith('250')) {
        formattedPhone = formattedPhone.substring(3);
        console.log('After removing 250 prefix:', formattedPhone);
      }

      // Remove leading 0 if present (Rwanda numbers often start with 07)
      if (formattedPhone.startsWith('0')) {
        formattedPhone = formattedPhone.substring(1);
        console.log('After removing leading 0:', formattedPhone);
      }

      // Validate phone format (must be 9 digits starting with 7)
      const phoneRegex = /^7[2-9]\d{7}$/;
      console.log('Phone number to validate:', formattedPhone);
      console.log('Regex test result:', phoneRegex.test(formattedPhone));
      
      if (!phoneRegex.test(formattedPhone)) {
        throw new Error(`Invalid phone number format: ${formattedPhone}. Must be a valid Rwanda phone number (9 digits starting with 7).`);
      }

      // Add 250 prefix for the API
      const fullPhoneNumber = `250${formattedPhone}`;
      console.log('Final phone number for API:', fullPhoneNumber);
      console.log('Message:', message);

      // Get authentication token from FDI API
      const token = await this.getAuthToken();

      // Generate a unique message reference
      const msgRef = `MSG-${Date.now()}`;

      // Build payload
      const payload = {
        msisdn: fullPhoneNumber,
        message: message,
        msgRef: msgRef,
        source_addr: process.env.FDI_SMS_SENDER_ID
      };

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
          this.SMS_URL,
          payload,
          { headers, timeout: 10000 }
      );

      console.log('SMS sent successfully');
      return response.data;
    } catch (err: any) {
      console.error('Error sending SMS:', err?.response?.data || err);
      throw new Error(
          `Failed to send SMS: ${err?.response?.data?.message || err.message}`
      );
    }
  }

  static async sendBulkSMS(recipients: { to: string; message: string }[]) {
    try {
      await Promise.all(
          recipients.map(recipient => this.sendSms(recipient.to, recipient.message))
      );
      return true;
    } catch (error) {
      console.error('Error sending bulk SMS:', error);
      throw error;
    }
  }
}

// Kinyarwanda SMS Templates
export function formatDeliveryNotificationKinyarwanda(farmerName: string, quantity: number, date: string) {
  return `Muraho ${farmerName}! Amata yawe ya ${quantity}L yashyizwemo muri sisitemu ku wa ${date}. Murakoze!`
}

export function formatPaymentNotificationKinyarwanda(farmerName: string, amount: number, period: string) {
  return `Muraho ${farmerName}! Amafaranga yawe ya ${amount.toLocaleString()} RWF ya ${period} yashyuwe. Murakoze!`
}

export function formatBulkPaymentNotificationKinyarwanda(farmerName: string, amount: number, period: string) {
  return `Murakoze ${farmerName}! Amafaranga yawe ya ${amount.toLocaleString()} RWF ya ${period} yishyuwe. Murakoze!`
}

// English fallback templates (keeping for reference)
export function formatDeliveryNotification(farmerName: string, quantity: number, date: string) {
  return `Hello ${farmerName}, your milk delivery of ${quantity}L has been recorded on ${date}. Thank you for your contribution!`
}

export function formatPaymentNotification(farmerName: string, amount: number, period: string) {
  return `Hello ${farmerName}, your payment of ${amount.toLocaleString()} RWF for ${period} has been processed. Thank you for your partnership!`
}