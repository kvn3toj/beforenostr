import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QuestionListItem } from './QuestionListItem';
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
        'question_type_multiple_choice': 'Opción Múltiple',
        'question_type_short_answer': 'Respuesta Corta',
        'question_type_true_false': 'Verdadero/Falso',
        'subtitle_active_label': 'Activo',
        'subtitle_inactive_label': 'Inactivo',
        'button_edit_question': 'Editar pregunta',
        'button_delete_question': 'Eliminar pregunta',
        'answer_options_title': 'Opciones de respuesta'
      };
      return translations[key] || key;
    }
  })
}));

describe('QuestionListItem', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const baseQuestion: Question = {
    id: 1,
    videoItemId: 123,
    timestamp: 90, // 1:30
    type: 'multiple-choice',
    text: '¿Cuál es la respuesta correcta?',
    languageCode: 'es-ES',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };

  const mockAnswerOptions: AnswerOption[] = [
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
    },
    {
      id: 3,
      questionId: 1,
      text: 'Opción C',
      isCorrect: false,
      order: 2,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z')
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render basic question information', () => {
    render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('¿Cuál es la respuesta correcta?')).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument(); // Formatted timestamp
    expect(screen.getByText('Opción Múltiple')).toBeInTheDocument();
    expect(screen.getByText('es-ES')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('should render inactive question correctly', () => {
    const inactiveQuestion = { ...baseQuestion, isActive: false };
    
    render(
      <QuestionListItem
        question={inactiveQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('should format timestamp correctly for different values', () => {
    const testCases = [
      { timestamp: 0, expected: '0:00' },
      { timestamp: 5, expected: '0:05' },
      { timestamp: 60, expected: '1:00' },
      { timestamp: 125, expected: '2:05' },
      { timestamp: 3661, expected: '61:01' }
    ];

    testCases.forEach(({ timestamp, expected }) => {
      const question = { ...baseQuestion, timestamp };
      const { unmount } = render(
        <QuestionListItem
          question={question}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(expected)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render different question types correctly', () => {
    const questionTypes = [
      { type: 'multiple-choice' as const, expectedLabel: 'Opción Múltiple' },
      { type: 'short-answer' as const, expectedLabel: 'Respuesta Corta' },
      { type: 'true-false' as const, expectedLabel: 'Verdadero/Falso' }
    ];

    questionTypes.forEach(({ type, expectedLabel }) => {
      const question = { ...baseQuestion, type };
      const { unmount } = render(
        <QuestionListItem
          question={question}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render action buttons', () => {
    render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Editar pregunta')).toBeInTheDocument();
    expect(screen.getByLabelText('Eliminar pregunta')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText('Editar pregunta');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(baseQuestion);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('Eliminar pregunta');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(baseQuestion);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should render answer options for multiple-choice questions', () => {
    const questionWithAnswers: QuestionWithAnswers = {
      ...baseQuestion,
      answerOptions: mockAnswerOptions
    };

    render(
      <QuestionListItem
        question={questionWithAnswers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Opciones de respuesta:')).toBeInTheDocument();
    expect(screen.getByText('A. Opción A')).toBeInTheDocument();
    expect(screen.getByText('B. Opción B')).toBeInTheDocument();
    expect(screen.getByText('C. Opción C')).toBeInTheDocument();
  });

  it('should highlight correct answer in multiple-choice questions', () => {
    const questionWithAnswers: QuestionWithAnswers = {
      ...baseQuestion,
      answerOptions: mockAnswerOptions
    };

    render(
      <QuestionListItem
        question={questionWithAnswers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // The correct answer should have a checkmark
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should not render answer options for non-multiple-choice questions', () => {
    const trueFalseQuestion: QuestionWithAnswers = {
      ...baseQuestion,
      type: 'true-false',
      text: '¿Esta afirmación es verdadera?'
    };

    render(
      <QuestionListItem
        question={trueFalseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Opciones de respuesta:')).not.toBeInTheDocument();
  });

  it('should not render answer options section if multiple-choice has no options', () => {
    const questionWithoutAnswers: QuestionWithAnswers = {
      ...baseQuestion,
      answerOptions: []
    };

    render(
      <QuestionListItem
        question={questionWithoutAnswers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Opciones de respuesta:')).not.toBeInTheDocument();
  });

  it('should sort answer options by order', () => {
    // Unordered options
    const unorderedOptions: AnswerOption[] = [
      { ...mockAnswerOptions[2], order: 2 }, // C
      { ...mockAnswerOptions[0], order: 0 }, // A
      { ...mockAnswerOptions[1], order: 1 }  // B
    ];

    const questionWithAnswers: QuestionWithAnswers = {
      ...baseQuestion,
      answerOptions: unorderedOptions
    };

    render(
      <QuestionListItem
        question={questionWithAnswers}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const optionsText = screen.getByText('Opciones de respuesta:').parentElement;
    const optionTexts = optionsText?.textContent;

    // Should render in order A, B, C despite input order
    expect(optionTexts).toMatch(/A\..*B\..*C\./);
  });

  it('should render divider when showDivider is true', () => {
    const { container } = render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showDivider={true}
      />
    );

    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('should not render divider when showDivider is false', () => {
    const { container } = render(
      <QuestionListItem
        question={baseQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        showDivider={false}
      />
    );

    expect(container.querySelector('hr')).not.toBeInTheDocument();
  });

  it('should handle questions with different language codes', () => {
    const englishQuestion = { ...baseQuestion, languageCode: 'en-US' };
    
    render(
      <QuestionListItem
        question={englishQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('en-US')).toBeInTheDocument();
  });

  it('should handle very long question text', () => {
    const longTextQuestion = {
      ...baseQuestion,
      text: 'Esta es una pregunta muy larga que podría causar problemas de renderizado si no se maneja correctamente en la interfaz de usuario.'
    };

    render(
      <QuestionListItem
        question={longTextQuestion}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(longTextQuestion.text)).toBeInTheDocument();
  });
}); 