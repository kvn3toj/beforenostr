import { lazy } from 'react';

const OnboardingDemo = lazy(() => import('../components/onboarding/OnboardingDemo'));

export const LazyPages = {
  // ... existing pages ...
  OnboardingDemo,
  // ... rest of pages ...
};