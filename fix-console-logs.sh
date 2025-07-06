#!/bin/bash

echo "🔧 Fixing console.log statements in SuperApp..."

# Fix ReciprocidadBalanceWidget
sed -i '' 's/onClick={() => console.log('\''Ver detalle de reciprocidad'\'')/onClick={() => navigate('\''\/profile\/reciprocidad'\'')}/g' Demo/apps/superapp-unified/src/components/modules/home/widgets/ReciprocidadBalanceWidget.tsx

# Fix OnboardingChecklist
sed -i '' 's/onClick: () => console.log('\''Navigate to create listing'\'')/onClick: () => navigate('\''\/marketplace\/create'\'')/g' Demo/apps/superapp-unified/src/components/onboarding/OnboardingChecklist.tsx

# Fix ProgressiveTooltips
sed -i '' 's/onClick: () => console.log('\''Navigate to create listing'\'')/onClick: () => navigate('\''\/marketplace\/create'\'')/g' Demo/apps/superapp-unified/src/components/onboarding/ProgressiveTooltips.tsx

sed -i '' 's/onClick: () => console.log('\''Open invite modal'\'')/onClick: () => setShowInviteModal(true)/g' Demo/apps/superapp-unified/src/components/onboarding/ProgressiveTooltips.tsx

echo "✅ Console.log statements fixed!"
echo "📝 Remember to add navigation imports and state management where needed."
