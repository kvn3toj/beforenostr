import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { VideoPermissionsManager } from './VideoPermissionsManager';

// Mock de react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('VideoPermissionsManager', () => {
  const defaultProps = {
    videoItemId: 123,
    onSave: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all permission sections', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Verificar que se renderizan las secciones principales
    expect(screen.getByText('Derechos de visualización del jugador')).toBeInTheDocument();
    expect(screen.getByText('Posición del video en la playlist')).toBeInTheDocument();
    expect(screen.getByText('Guardar en borradores')).toBeInTheDocument();
    expect(screen.getByText('Publicar video')).toBeInTheDocument();
  });

  it('should render all permission switches', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Verificar switches principales
    expect(screen.getByLabelText('Visibilidad del número de Öndas')).toBeInTheDocument();
    expect(screen.getByLabelText('Subtítulos de video')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de publicación')).toBeInTheDocument();
  });

  it('should expand accordion sections when clicked', async () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Expandir sección de Videos
    const videosAccordion = screen.getByText('Videos').closest('button');
    expect(videosAccordion).toBeInTheDocument();
    
    fireEvent.click(videosAccordion!);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Duración de lo videos')).toBeInTheDocument();
      expect(screen.getByLabelText('Indicar me gusta')).toBeInTheDocument();
      expect(screen.getByLabelText('Retroceder y avanzar en el video')).toBeInTheDocument();
    });

    // Expandir sección de Comentarios
    const commentsAccordion = screen.getByText('Comentarios').closest('button');
    expect(commentsAccordion).toBeInTheDocument();
    
    fireEvent.click(commentsAccordion!);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Ver comentarios')).toBeInTheDocument();
      expect(screen.getByLabelText('Realizar comentarios')).toBeInTheDocument();
      expect(screen.getByLabelText('Ver nombre de la comentarista')).toBeInTheDocument();
    });
  });

  it('should handle permission toggle changes', async () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Cambiar el switch de visibilidad de Öndas
    const waveCountSwitch = screen.getByLabelText('Visibilidad del número de Öndas');
    expect(waveCountSwitch).toBeChecked(); // Debería estar activado por defecto

    fireEvent.click(waveCountSwitch);
    expect(waveCountSwitch).not.toBeChecked();
  });

  it('should handle playlist position changes', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Verificar que Posición 1 está seleccionada por defecto
    const position1Button = screen.getByText('Posición 1');
    expect(position1Button).toHaveClass('MuiButton-contained');

    // Cambiar a Posición 2
    const position2Button = screen.getByText('Posición 2');
    fireEvent.click(position2Button);
    
    expect(position2Button).toHaveClass('MuiButton-contained');
    expect(position1Button).toHaveClass('MuiButton-outlined');
  });

  it('should call onSave when publishing video', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    const publishButton = screen.getByText('Publicar video');
    fireEvent.click(publishButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        showWaveCount: true,
        showVideos: true,
        showVideoSubtitles: true,
        playlistPosition: 'position1',
      }),
      false // isDraft = false
    );
  });

  it('should open draft dialog when saving as draft', async () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    const draftButton = screen.getByText('Guardar en borradores');
    fireEvent.click(draftButton);

    await waitFor(() => {
      expect(screen.getByText('Guardar en borradores')).toBeInTheDocument();
      expect(screen.getByLabelText('Seleccionar playlist')).toBeInTheDocument();
    });
  });

  it('should handle draft save from dialog', async () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Abrir dialog de borrador
    const draftButton = screen.getByText('Guardar en borradores');
    fireEvent.click(draftButton);

    await waitFor(() => {
      const dialogSaveButton = screen.getAllByText('Guardar en borradores')[1]; // El segundo es del dialog
      fireEvent.click(dialogSaveButton);
    });

    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.any(Object),
      true // isDraft = true
    );
  });

  it('should disable buttons when loading', () => {
    render(<VideoPermissionsManager {...defaultProps} isLoading={true} />);

    const draftButton = screen.getByText('Guardar en borradores');
    const publishButton = screen.getByText('Publicar video');

    expect(draftButton).toBeDisabled();
    expect(publishButton).toBeDisabled();
  });

  it('should close draft dialog when cancelled', async () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    // Abrir dialog
    const draftButton = screen.getByText('Guardar en borradores');
    fireEvent.click(draftButton);

    await waitFor(() => {
      expect(screen.getByText('Seleccionar playlist')).toBeInTheDocument();
    });

    // Cancelar
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Seleccionar playlist')).not.toBeInTheDocument();
    });
  });

  it('should show success alert', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    expect(screen.getByText('Se guardaron los cambios')).toBeInTheDocument();
  });

  it('should display current playlist location', () => {
    render(<VideoPermissionsManager {...defaultProps} />);

    expect(screen.getByText(/El video se guarda en:/)).toBeInTheDocument();
    expect(screen.getByText(/Carpeta 2024 › Playlist Inicio/)).toBeInTheDocument();
  });
}); 