import type { ImagePlaceholder } from './placeholder-images';
import nodemailer from 'nodemailer';
import { formatPrice } from './utils';

type OrderDetails = {
    firstName: string;
    lastName: string;
    phone: string;
    product: ImagePlaceholder;
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendOrderEmail({ firstName, lastName, phone, product }: OrderDetails) {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || !process.env.SMTP_HOST) {
        console.warn('Email configuration is missing. Skipping email notification.');
        return;
    }

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h1 style="color: hsl(45, 86%, 45%); border-bottom: 2px solid hsl(45, 86%, 45%); padding-bottom: 10px;">New Order Notification</h1>
            <p style="font-size: 16px;">You have received a new order from your <strong>Susan Fashion</strong> store.</p>
            <h2 style="color: #333;">Order Details:</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; font-weight: bold;">Customer:</td>
                    <td style="padding: 8px;">${firstName} ${lastName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; font-weight: bold;">Phone:</td>
                    <td style="padding: 8px;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; font-weight: bold;">Product:</td>
                    <td style="padding: 8px;">${product.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; font-weight: bold;">Price:</td>
                    <td style="padding: 8px;">${formatPrice(product.price)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; font-weight: bold;">Date:</td>
                    <td style="padding: 8px;">${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</td>
                </tr>
            </table>
            <p style="margin-top: 20px; font-size: 14px; color: #777;">Please contact the customer to arrange for delivery and payment. This is an automated notification.</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Susan Fashion Store" <${process.env.SMTP_USER || 'noreply@example.com'}>`,
            to: adminEmail,
            subject: `🛍️ New Order for ${product.name}`,
            html: emailHtml,
        });
        console.log('Order notification email sent successfully.');
    } catch (error) {
        console.error('Failed to send order email:', error);
        // We don't want to block the user's order confirmation if email fails.
        // In a production app, you might add this to a retry queue.
    }
}
