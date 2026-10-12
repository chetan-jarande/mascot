import type { GuideConfig } from '../../framework/types/guide-framework';

export const DEFAULT_GUIDE_CONFIG: GuideConfig = {
  version: '1.0.0',
  appNamespace: 'agency-onboarding',
  globalFallbacks: {
    idleMessage: "Hi! 👋 I'm your interactive companion. Let's get your agency account setup in seconds!",
    successMessage: "Woohoo! All fields are verified and crisp! You're ready to launch! 🚀",
    defaultError: "Hmm, double-check the highlighted fields above.",
  },
  components: {
    'full-name': {
      componentId: 'full-name',
      label: 'Full Legal Name',
      placeholder: 'e.g. Alex Morgan',
      infoMessage: 'Enter your preferred name for client workspace greetings.',
      defaultExpression: 'thinking',
      walkthrough: {
        stepIndex: 1,
        title: 'Personalized Profile',
        description: 'Your companion uses your name to personalize client-facing white-label reports.',
        placement: 'bottom',
      },
      validations: [
        {
          id: 'req_name',
          type: 'required',
          errorMessage: 'Full name is required.',
          mascotReaction: "Don't be shy! We need a name to introduce you to clients! 😊",
        },
        {
          id: 'min_name',
          type: 'min_length',
          value: 3,
          errorMessage: 'Name must be at least 3 characters long.',
          mascotReaction: 'That name seems a bit too short! Double-check spelling? 🤔',
        },
      ],
    },
    'work-email': {
      componentId: 'work-email',
      label: 'Primary Work Email',
      placeholder: 'alex@agency.com',
      infoMessage: 'Your team invitation and production API keys will be sent here.',
      defaultExpression: 'neutral',
      walkthrough: {
        stepIndex: 2,
        title: 'Team Credentials',
        description: 'Instant access setup magic links and SSO configurations route through this email.',
        placement: 'bottom',
      },
      validations: [
        {
          id: 'req_email',
          type: 'required',
          errorMessage: 'Work email is required.',
          mascotReaction: "Hold on! We need an email address so we know where to send keys! 📧",
        },
        {
          id: 'regex_email',
          type: 'email',
          errorMessage: 'Please enter a valid work email address.',
          mascotReaction: 'Oops! Could you format that as name@company.com? 🧐',
        },
      ],
    },
    'company-size': {
      componentId: 'company-size',
      label: 'Collaborator Team Size',
      placeholder: 'Select company tier',
      infoMessage: 'Helps configure bandwidth, workspace seats, and concurrent queries.',
      defaultExpression: 'surprised',
      walkthrough: {
        stepIndex: 3,
        title: 'Workspace Capacity',
        description: 'Select how many collaborators will manage client assets with you.',
        placement: 'bottom',
      },
      validations: [
        {
          id: 'req_size',
          type: 'required',
          errorMessage: 'Please select your team size.',
          mascotReaction: "Pick a size! Solo or enterprise, we've got you covered! ✨",
        },
      ],
    },
    'vip-token': {
      componentId: 'vip-token',
      label: 'Agency VIP Token (Optional)',
      placeholder: 'e.g. VIP-2026',
      infoMessage: 'Enter an invitation token if you received early access clearance.',
      defaultExpression: 'guiding',
      walkthrough: {
        stepIndex: 4,
        title: 'VIP Fast-Track Token',
        description: 'Enables custom plugins and unlocks priority cloud concurrency.',
        placement: 'bottom',
      },
      validations: [
        {
          id: 'custom_vip',
          type: 'custom',
          customValidatorId: 'vip_token_validator',
          errorMessage: 'Invalid VIP token format. Must start with VIP-.',
          mascotReaction: 'VIP tokens must begin with VIP- prefix (e.g. VIP-2026)! 🔑',
        },
      ],
    },
  },
};
