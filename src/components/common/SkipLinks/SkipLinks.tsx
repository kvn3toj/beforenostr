import React from 'react';
import { Box } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';

interface SkipLink {
  href: string;
  label: string;
  description?: string;
}

interface SkipLinksProps {
  links: SkipLink[];
  className?: string;
}

/**
 * SkipLinks Component
 * 
 * Provides accessible skip navigation links for quick keyboard navigation.
 * Links are hidden by default and become visible when focused.
 * 
 * Enhanced with aria-describedby for perfect accessibility score.
 * 
 * Common skip patterns:
 * - Skip to main content
 * - Skip to navigation
 * - Skip to search
 * - Skip to footer
 * 
 * @param links - Array of skip link objects with href, label, and optional description
 * @param className - Additional CSS classes
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({ links, className }) => {
  const skipLinkStyles = {
    position: 'absolute' as const,
    top: '-50px',
    left: '8px',
    zIndex: 10000,
    padding: '12px 20px',
    backgroundColor: colors.accessibility.skipLinkBackground,
    color: colors.accessibility.skipLink,
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 600,
    border: `2px solid ${colors.accessibility.focusRing}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'top 0.2s ease-in-out',
    
    '&:focus': {
      top: '8px',
      outline: `3px solid ${colors.accessibility.focusRing}`,
      outlineOffset: '2px',
    },
    
    '&:focus-visible': {
      top: '8px',
      outline: `3px solid ${colors.accessibility.focusRing}`,
      outlineOffset: '2px',
    },
  };

  const hiddenDescriptionStyles = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  return (
    <>
      <nav aria-label="Skip navigation" aria-describedby="skip-links-description" className={className}>
        {links.map((link, index) => {
          const descriptionId = `skip-link-desc-${index}`;
          return (
            <React.Fragment key={`skip-link-${index}`}>
              <Box
                component="a"
                href={link.href}
                aria-describedby={link.description ? descriptionId : undefined}
                sx={skipLinkStyles}
              >
                {link.label}
              </Box>
              {link.description && (
                <div id={descriptionId} style={hiddenDescriptionStyles}>
                  {link.description}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
      
      {/* Hidden description for the skip links navigation */}
      <div id="skip-links-description" style={hiddenDescriptionStyles}>
        Enlaces de navegación rápida para saltar a secciones principales del sitio usando el teclado
      </div>
    </>
  );
};

/**
 * Pre-configured skip link sets for common page types with enhanced descriptions
 */
export const SkipLinkSets = {
  // Standard admin layout
  main: [
    { 
      href: '#main-content', 
      label: 'Saltar al contenido principal',
      description: 'Salta directamente al área principal de contenido evitando la navegación'
    },
    { 
      href: '#navigation', 
      label: 'Saltar a la navegación',
      description: 'Accede al menú de navegación principal del sitio'
    },
  ],
  
  // Login page
  login: [
    { 
      href: '#login-form', 
      label: 'Saltar al formulario de inicio de sesión',
      description: 'Accede directamente al formulario para iniciar sesión en el sistema'
    },
  ],
  
  // Content pages with search
  contentWithSearch: [
    { 
      href: '#main-content', 
      label: 'Saltar al contenido principal',
      description: 'Salta al contenido principal de la página'
    },
    { 
      href: '#search', 
      label: 'Saltar a la búsqueda',
      description: 'Accede directamente al campo de búsqueda'
    },
    { 
      href: '#navigation', 
      label: 'Saltar a la navegación',
      description: 'Accede al menú de navegación del sitio'
    },
  ],
  
  // Form pages
  form: [
    { 
      href: '#main-form', 
      label: 'Saltar al formulario principal',
      description: 'Accede directamente al formulario principal de la página'
    },
    { 
      href: '#form-actions', 
      label: 'Saltar a las acciones del formulario',
      description: 'Salta a los botones de acción del formulario (guardar, cancelar, etc.)'
    },
  ],
} as const; 