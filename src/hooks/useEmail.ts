import { useRef } from 'react';
import emailjs from '@emailjs/browser';

// CONFIGURATION - YOU NEED TO REPLACE THESE WITH YOUR EMAILJS CREDENTIALS
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an "Email Service" (Gmail)
// 3. Add an "Email Template"
// 4. Go to Account > "Public Key" copied from there
const EMAIL_CONFIG = {
    SERVICE_ID: 'service_gsahihe',   // Replace this
    TEMPLATE_ID: 'template_xo5av7v', // Replace this
    PUBLIC_KEY: 'CVboVK5D7Ix5j2GWr',            // Replace this
    TO_EMAIL: 'jeffreye306@gmail.com'
};

export const useEmail = () => {
    const isSending = useRef(false);

    const sendProposalConfirmation = async () => {
        if (isSending.current) return;
        isSending.current = true;

        const templateParams = {
            to_email: EMAIL_CONFIG.TO_EMAIL,
            message: 'She said YES! ❤️ The proposal was accepted.',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            device_info: navigator.userAgent
        };

        try {
            // Note: If credentials are not set specific logs will show
            /* 
            if (EMAIL_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                console.warn('⚠️ EmailJS credentials not set! Email will not be sent.');
                console.log('Would have sent email to:', EMAIL_CONFIG.TO_EMAIL);
                return;
            }
            */

            const result = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAIL_CONFIG.PUBLIC_KEY
            );

            console.log('SUCCESS! Email sent:', result.text);
        } catch (error) {
            console.error('FAILED to send email:', error);
        } finally {
            isSending.current = false;
        }
    };

    return { sendProposalConfirmation };
};
