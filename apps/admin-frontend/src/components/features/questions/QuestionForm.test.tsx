import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { QuestionForm } from './QuestionForm';
import type { Question, AnswerOption } from '@prisma/client';

// Tipo extendido que incluye las answerOptions
type QuestionWithAnswers = Question & {
  answerOptions?: AnswerOption[];
};

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'question_form_timestamp_label': 'Tiempo (segundos)',
        'question_form_type_label': 'Tipo de pregunta',
        'question_form_text_label': 'Texto de la pregunta',
        'question_form_language_label': 'Idioma',
        'question_form_active_label': 'Activa',
        'question_form_answer_options_title': 'Opciones de respuesta',
        'question_form_option_text_label': 'Texto de la opción',
        'question_form_option_correct_label': 'Respuesta correcta',
        'question_form_add_option': 'Agregar opción',
        'question_form_remove_option': 'Eliminar opción',
        'button_save': 'Guardar',
        'button_cancel': 'Cancelar',
        'question_type_multiple_choice': 'Opción múltiple',
        'question_type_short_answer': 'Respuesta corta',
        'question_type_true_false': 'Verdadero/Falso'
      };
      return translations[key] || key;
    }
  })
}));

describe('QuestionForm', () => {
  const user = userEvent.setup();
  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  const baseQuestion: QuestionWithAnswers = {
    id: 1,
    videoItemId: 123,
    timestamp: 30,
    type: 'multiple-choice',
    text: '¿Cuál es la respuesta correcta?',
    languageCode: 'es-ES',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    answerOptions: [
      {
        id: 1,
        questionId: 1,
        text: 'Opción A',
        isCorrect: true,
        order: 0,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      },
      {
        id: 2,
        questionId: 1,
        text: 'Opción B',
        isCorrect: false,
        order: 1,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render creation form with default values', () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText('Tiempo (segundos)')).toHaveValue(0);
    expect(screen.getByLabelText('Tipo de pregunta')).toBeInTheDocument();
    expect(screen.getByLabelText('Texto de la pregunta')).toHaveValue('');
    expect(screen.getByLabelText('Idioma')).toBeInTheDocument();
    expect(screen.getByLabelText('Activa')).toBeChecked();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should render editing form with initial data', () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText('Tiempo (segundos)')).toHaveValue(30);
    expect(screen.getByLabelText('Texto de la pregunta')).toHaveValue('¿Cuál es la respuesta correcta?');
    expect(screen.getByLabelText('Activa')).toBeChecked();
  });

  it('should render answer options for multiple-choice questions', () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    expect(screen.getByText('Opciones de respuesta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opción A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Opción B')).toBeInTheDocument();
  });

  it('should not render answer options for non-multiple-choice questions', () => {
    const trueFalseQuestion = {
      ...baseQuestion,
      type: 'true-false' as const,
      answerOptions: []
    };

    render(
      <QuestionForm
        videoItemId={123}
        initialData={trueFalseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Opciones de respuesta')).not.toBeInTheDocument();
  });

  it('should update form fields when user types', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.clear(textField);
    await user.type(textField, 'Nueva pregunta');

    expect(textField).toHaveValue('Nueva pregunta');

    const timestampField = screen.getByLabelText('Tiempo (segundos)');
    await user.clear(timestampField);
    await user.type(timestampField, '60');

    expect(timestampField).toHaveValue(60);
  });

  it('should change question type', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const typeSelect = screen.getByLabelText('Tipo de pregunta');
    await user.click(typeSelect);
    
    const trueFalseOption = screen.getByText('Verdadero/Falso');
    await user.click(trueFalseOption);

    // Answer options should disappear for true-false questions
    expect(screen.queryByText('Opciones de respuesta')).not.toBeInTheDocument();
  });

  it('should toggle active switch', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const activeSwitch = screen.getByLabelText('Activa');
    expect(activeSwitch).toBeChecked();

    await user.click(activeSwitch);
    expect(activeSwitch).not.toBeChecked();
  });

  it('should add new answer option', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const addButton = screen.getByText('Agregar opción');
    await user.click(addButton);

    // Should now have 3 option text fields (2 default + 1 added)
    const optionFields = screen.getAllByLabelText(/Texto de la opción/);
    expect(optionFields).toHaveLength(3);
  });

  it('should remove answer option when more than 2 exist', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Add a third option first
    const addButton = screen.getByText('Agregar opción');
    await user.click(addButton);

    // Now try to remove one
    const removeButtons = screen.getAllByLabelText('Eliminar opción');
    expect(removeButtons).toHaveLength(3);

    await user.click(removeButtons[0]);

    // Should have 2 options left
    const optionFields = screen.getAllByLabelText(/Texto de la opción/);
    expect(optionFields).toHaveLength(2);
  });

  it('should not allow removing option when only 2 exist', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const removeButtons = screen.getAllByLabelText('Eliminar opción');
    await user.click(removeButtons[0]);

    // Should still have 2 options (minimum required)
    const optionFields = screen.getAllByLabelText(/Texto de la opción/);
    expect(optionFields).toHaveLength(2);
  });

  it('should update answer option text', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const optionField = screen.getByDisplayValue('Opción A');
    await user.clear(optionField);
    await user.type(optionField, 'Nueva Opción A');

    expect(optionField).toHaveValue('Nueva Opción A');
  });

  it('should toggle correct answer for option', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const correctCheckboxes = screen.getAllByLabelText('Respuesta correcta');
    expect(correctCheckboxes[0]).toBeChecked(); // First option is correct
    expect(correctCheckboxes[1]).not.toBeChecked(); // Second option is not correct

    // Toggle second option to be correct
    await user.click(correctCheckboxes[1]);
    expect(correctCheckboxes[1]).toBeChecked();
  });

  it('should submit form with valid data', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Fill in the form
    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.type(textField, 'Test question');

    const timestampField = screen.getByLabelText('Tiempo (segundos)');
    await user.clear(timestampField);
    await user.type(timestampField, '45');

    // Fill in answer options
    const optionFields = screen.getAllByLabelText(/Texto de la opción/);
    await user.type(optionFields[0], 'Option 1');
    await user.type(optionFields[1], 'Option 2');

    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Test question',
          timestamp: 45,
          type: 'multiple-choice',
          languageCode: 'es-ES',
          isActive: true,
          videoItemId: 123
        })
      );
    });
  });

  it('should show validation errors for empty question text', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    expect(screen.getByText('El texto de la pregunta es requerido')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation errors for negative timestamp', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.type(textField, 'Test question');

    const timestampField = screen.getByLabelText('Tiempo (segundos)');
    await user.clear(timestampField);
    await user.type(timestampField, '-5');

    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    expect(screen.getByText('El tiempo debe ser mayor o igual a 0')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation errors for multiple-choice without correct answer', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.type(textField, 'Test question');

    // Fill in answer options
    const optionFields = screen.getAllByLabelText(/Texto de la opción/);
    await user.type(optionFields[0], 'Option 1');
    await user.type(optionFields[1], 'Option 2');

    // Uncheck the correct answer (first option is correct by default)
    const correctCheckboxes = screen.getAllByLabelText('Respuesta correcta');
    await user.click(correctCheckboxes[0]);

    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    expect(screen.getByText('Las preguntas de opción múltiple deben tener al menos una respuesta correcta')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation errors for empty answer options', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.type(textField, 'Test question');

    // Leave answer options empty (they start empty)
    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    expect(screen.getByText('Todas las opciones de respuesta deben tener texto')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should disable form when loading', () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={true}
      />
    );

    expect(screen.getByText('Guardar')).toBeDisabled();
  });

  it('should handle form submission in edit mode', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        initialData={baseQuestion}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Modify the question text
    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.clear(textField);
    await user.type(textField, 'Updated question');

    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'Updated question',
          timestamp: 30,
          type: 'multiple-choice',
          languageCode: 'es-ES',
          isActive: true,
          videoItemId: 123
        })
      );
    });
  });

  it('should clear validation errors when form is modified', async () => {
    render(
      <QuestionForm
        videoItemId={123}
        onSubmit={mockOnSubmit}
        onClose={mockOnClose}
        isLoading={false}
      />
    );

    // Submit empty form to trigger validation errors
    const submitButton = screen.getByText('Guardar');
    await user.click(submitButton);

    expect(screen.getByText('El texto de la pregunta es requerido')).toBeInTheDocument();

    // Now type in the text field
    const textField = screen.getByLabelText('Texto de la pregunta');
    await user.type(textField, 'Some text');

    // Error should be cleared
    expect(screen.queryByText('El texto de la pregunta es requerido')).not.toBeInTheDocument();
  });
}); 