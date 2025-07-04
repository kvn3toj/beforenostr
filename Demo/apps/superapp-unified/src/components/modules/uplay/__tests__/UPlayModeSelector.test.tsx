// [SAGE/ANA] Test unitario base para UPlayModeSelector
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import UPlayModeSelector from '../UPlayModeSelector';

describe('UPlayModeSelector', () => {
  it('debe resaltar el modo seleccionado', () => {
    const { getByText } = render(<UPlayModeSelector currentMode="play" onModeSelect={() => {}} />);
    expect(getByText('🎬 Elige tu Experiencia ÜPlay')).toBeInTheDocument();
  });

  it('debe llamar a onModeSelect al hacer click en un modo', () => {
    const onModeSelect = jest.fn();
    const { getAllByRole } = render(<UPlayModeSelector currentMode="play" onModeSelect={onModeSelect} />);
    const cards = getAllByRole('button');
    fireEvent.click(cards[0]);
    expect(onModeSelect).toHaveBeenCalled();
  });
});
