import { prisma } from './prisma'

export interface SMSResponse {
  success: boolean
  message: string
  messageId?: string
}

export async function sendSMS(phone: string, message: string): Promise<SMSResponse> {
  try {
    // Log SMS attempt
    const smsLog = await prisma.sMSLog.create({
      data: {
        phone,
        message,
        status: 'PENDING'
      }
    })

    // In production, integrate with actual SMS gateway
    // For demo purposes, we'll simulate SMS sending
    console.log(`SMS to ${phone}: ${message}`)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update SMS log
    await prisma.sMSLog.update({
      where: { id: smsLog.id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        messageId: Math.random().toString(36).substring(7)
      }
    })

    return {
      success: true,
      message: 'SMS sent successfully',
      messageId: smsLog.id
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    
    return {
      success: false,
      message: 'Failed to send SMS'
    }
  }
}

export function formatDeliveryNotification(farmerName: string, quantity: number, date: string) {
  return `Hello ${farmerName}, your milk delivery of ${quantity}L has been recorded on ${date}. Thank you for your contribution!`
}

export function formatPaymentNotification(farmerName: string, amount: number, period: string) {
  return `Hello ${farmerName}, your payment of ${amount.toLocaleString()} RWF for ${period} has been processed. Thank you for your partnership!`
}