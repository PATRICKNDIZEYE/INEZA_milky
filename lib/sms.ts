// .env variables required:
// FDI_SMS_USERNAME, FDI_SMS_PASSWORD, FDI_SMS_SENDER_ID
import axios, { AxiosError } from "axios";
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

      if (response.data?.access_token) {
        this.tokenCache = {
          token: response.data.access_token,
          expiresAt: new Date(response.data.expires_at).getTime()
        };
        return response.data.access_token;
      }

      throw new Error('Failed to get authentication token');
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Failed to authenticate with FDI SMS API');
    }
  }

  static async sendSms(phoneNumber: string, message: string) {
    try {
      // Remove any non-digit characters
      let formattedPhone = phoneNumber.replace(/\D/g, '');

      // Remove leading 250 if present
      if (formattedPhone.startsWith('250')) {
        formattedPhone = formattedPhone.substring(3);
      }

      // Validate phone format (must be 9 digits starting with 7)
      const phoneRegex = /^7[2-9]\d{7}$/;
      if (!phoneRegex.test(formattedPhone)) {
        throw new Error("Invalid phone number format. Must be a valid Rwanda phone number.");
      }

      // Add 250 prefix for the API
      const fullPhoneNumber = `250${formattedPhone}`;
      console.log('Sending SMS to:', fullPhoneNumber);
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
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error sending SMS:', error?.response?.data || error);
      throw new Error(
          `Failed to send SMS: ${error?.response?.data?.message || error.message}`
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
  return `Murakoze ${farmerName}! Amata yawe ya ${quantity}L yashyizwemo mu gahuzu ku wa ${date}. Murakoze kwishyura!`
}

export function formatPaymentNotificationKinyarwanda(farmerName: string, amount: number, period: string) {
  return `Murakoze ${farmerName}! Amafaranga yawe ya ${amount.toLocaleString()} RWF ya ${period} yashyizwemo mu gahuzu. Murakoze kwishyura!`
}

export function formatBulkPaymentNotificationKinyarwanda(farmerName: string, amount: number, period: string) {
  return `Murakoze ${farmerName}! Amafaranga yawe ya ${amount.toLocaleString()} RWF ya ${period} yashyizwemo mu gahuzu. Murakoze kwishyura!`
}

// English fallback templates (keeping for reference)
export function formatDeliveryNotification(farmerName: string, quantity: number, date: string) {
  return `Hello ${farmerName}, your milk delivery of ${quantity}L has been recorded on ${date}. Thank you for your contribution!`
}

export function formatPaymentNotification(farmerName: string, amount: number, period: string) {
  return `Hello ${farmerName}, your payment of ${amount.toLocaleString()} RWF for ${period} has been processed. Thank you for your partnership!`
}