import type { GuideConfig } from '../../framework/types/guide-framework';
import { DEFAULT_GUIDE_CONFIG } from './defaultSchema';

export const SCHEMA_PRESETS: Record<string, { name: string; description: string; config: GuideConfig }> = {
  agency: {
    name: 'Agency Early Access',
    description: 'Boutique agency onboarding with team size selector and VIP fast-track token.',
    config: DEFAULT_GUIDE_CONFIG,
  },
  saasCheckout: {
    name: 'SaaS Pro Checkout',
    description: 'Subscription upgrade form with billing zip validation and promo code check.',
    config: {
      version: '1.2.0',
      appNamespace: 'saas-checkout',
      globalFallbacks: {
        idleMessage: 'Ready to upgrade to Pro tier? Let’s finalize your subscription details!',
        successMessage: 'Payment credentials verified! Ready to activate subscription. 💳',
        defaultError: 'Please check your billing details.',
      },
      components: {
        'full-name': {
          componentId: 'full-name',
          label: 'Cardholder Name',
          placeholder: 'Jordan Reed',
          infoMessage: 'Exact name printed on your payment method.',
          defaultExpression: 'thinking',
          walkthrough: {
            stepIndex: 1,
            title: 'Billing Contact',
            description: 'Name must match invoice recipient for tax receipt generation.',
          },
          validations: [
            {
              id: 'req_card_name',
              type: 'required',
              errorMessage: 'Cardholder name is required.',
              mascotReaction: 'We need the cardholder name to issue your tax receipt! 🧾',
            },
          ],
        },
        'work-email': {
          componentId: 'work-email',
          label: 'Billing Invoice Email',
          placeholder: 'billing@startup.io',
          infoMessage: 'Stripe and tax invoice notifications will be forwarded here.',
          defaultExpression: 'neutral',
          walkthrough: {
            stepIndex: 2,
            title: 'Invoicing Dispatch',
            description: 'Monthly receipts and billing renewal receipts arrive at this inbox.',
          },
          validations: [
            {
              id: 'req_billing_email',
              type: 'required',
              errorMessage: 'Invoice email is required.',
            },
            {
              id: 'email_format',
              type: 'email',
              errorMessage: 'Invalid billing email address.',
            },
          ],
        },
        'company-size': {
          componentId: 'company-size',
          label: 'Dedicated Billing Seats',
          placeholder: 'Select license volume',
          infoMessage: 'Quantity of concurrent dashboard users permitted on workspace.',
          defaultExpression: 'surprised',
          walkthrough: {
            stepIndex: 3,
            title: 'Team Licenses',
            description: 'Volume discounts automatically apply at 25+ collaborator seats.',
          },
          validations: [
            {
              id: 'req_seats',
              type: 'required',
              errorMessage: 'Please select license volume.',
            },
          ],
        },
        'vip-token': {
          componentId: 'vip-token',
          label: 'Promotional Voucher Code',
          placeholder: 'e.g. VIP-LAUNCH26',
          infoMessage: 'Optional partner coupon code for annual discounts.',
          defaultExpression: 'guiding',
          walkthrough: {
            stepIndex: 4,
            title: 'Promo Code',
            description: 'Apply voucher code to receive credits.',
          },
          validations: [
            {
              id: 'custom_vip_promo',
              type: 'custom',
              customValidatorId: 'vip_token_validator',
              errorMessage: 'Invalid promo code. Must begin with VIP-.',
              mascotReaction: 'Promo codes must begin with VIP- to apply coupon savings! 🏷️',
            },
          ],
        },
      },
    },
  },
};
