import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QuestionManager } from './QuestionManager';
import type { Question } from '@prisma/client';

// Mock the hooks
const mockQuestionsData: Question[] = [
  {
    id: 1,
    videoItemId: 123,
    timestamp: 30,
    type: 'multiple-choice',
    text: '¿Cuál es la respuesta correcta?',
    languageCode: 'es-ES',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: 2,
    videoItemId: 123,
    timestamp: 60,
    type: 'true-false',
    text: '¿Esta afirmación es verdadera?',
    languageCode: 'es-ES',
    isActive: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
];

const mockUseQuestionsQuery = vi.fn();
const mockUseCreateQuestionMutation = vi.fn();
const mockUseUpdateQuestionMutation = vi.fn();
const mockUseDeleteQuestionMutation = vi.fn();

vi.mock('../../../hooks/features/questions/useQuestionsQuery', () => ({
  useQuestionsQuery: mockUseQuestionsQuery
}));

vi.mock('../../../hooks/features/questions/useCreateQuestionMutation', () => ({
  useCreateQuestionMutation: mockUseCreateQuestionMutation
}));

vi.mock('../../../hooks/features/questions/useUpdateQuestionMutation', () => ({
  useUpdateQuestionMutation: mockUseUpdateQuestionMutation
}));

vi.mock('../../../hooks/features/questions/useDeleteQuestionMutation', () => ({
  useDeleteQuestionMutation: mockUseDeleteQuestionMutation
}));

// Mock QuestionListItem component
vi.mock('./QuestionListItem', () => ({
  QuestionListItem: ({ question, onEdit, onDelete }: any) => (
    <div data-testid={`question-item-${question.id}`}>
      <span>{question.text}</span>
      <button onClick={() => onEdit(question)} aria-label="Editar pregunta">
        Edit
      </button>
      <button onClick={() => onDelete(question)} aria-label="Eliminar pregunta">
        Delete
      </button>
    </div>
  )
}));

// Mock QuestionForm component
vi.mock('./QuestionForm', () => ({
  QuestionForm: ({ onSubmit, onClose, initialData, isLoading }: any) => (
    <div data-testid="question-form">
      <button onClick={() => onSubmit({ text: 'Nueva pregunta' })} disabled={isLoading}>
        Submit Form
      </button>
      <button onClick={onClose}>Close Form</button>
      <span data-testid="form-mode">
        {initialData ? 'Editing' : 'Creating'}
      </span>
      {isLoading && <span data-testid="form-loading">Loading...</span>}
    </div>
  )
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'question_manager_title': 'Gestión de Preguntas',
        'button_create_question': 'Crear Pregunta',
        'question_list_empty': 'No hay preguntas disponibles',
        'dialog_title_edit_question': 'Editar Pregunta',
        'dialog_title_create_question': 'Crear Pregunta',
        'question_confirm_delete_title': 'Confirmar Eliminación',
        'question_confirm_delete_message': '¿Estás seguro de que deseas eliminar esta pregunta?',
        'button_cancel': 'Cancelar',
        'button_delete': 'Eliminar'
      };
      return translations[key] || key;
    }
  })
}));

describe('QuestionManager', () => {
  const mockCreateMutate = vi.fn();
  const mockUpdateMutate = vi.fn();
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    mockUseQuestionsQuery.mockReturnValue({
      data: mockQuestionsData,
      isLoading: false,
      error: null
    });

    mockUseCreateQuestionMutation.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: false
    });

    mockUseUpdateQuestionMutation.mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: false
    });

    mockUseDeleteQuestionMutation.mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false
    });
  });

  it('should render loading state', () => {
    mockUseQuestionsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    });

    render(<QuestionManager videoItemId={123} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const error = new Error('Failed to load questions');
    mockUseQuestionsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error
    });

    render(<QuestionManager videoItemId={123} />);

    expect(screen.getByText(/Error al cargar las preguntas/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load questions/)).toBeInTheDocument();
  });

  it('should render empty state when no questions', () => {
    mockUseQuestionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });

    render(<QuestionManager videoItemId={123} />);

    expect(screen.getByText('No hay preguntas disponibles')).toBeInTheDocument();
    expect(screen.getByText('Crear Pregunta')).toBeInTheDocument();
  });

  it('should render questions list when data is available', () => {
    render(<QuestionManager videoItemId={123} />);

    expect(screen.getByText('Gestión de Preguntas')).toBeInTheDocument();
    expect(screen.getByText('Crear Pregunta')).toBeInTheDocument();
    expect(screen.getByTestId('question-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('question-item-2')).toBeInTheDocument();
    expect(screen.getByText('¿Cuál es la respuesta correcta?')).toBeInTheDocument();
    expect(screen.getByText('¿Esta afirmación es verdadera?')).toBeInTheDocument();
  });

  it('should open create question dialog when create button is clicked', () => {
    render(<QuestionManager videoItemId={123} />);

    const createButton = screen.getByText('Crear Pregunta');
    fireEvent.click(createButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Crear Pregunta')).toBeInTheDocument();
    expect(screen.getByTestId('question-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-mode')).toHaveTextContent('Creating');
  });

  it('should open edit question dialog when edit button is clicked', () => {
    render(<QuestionManager videoItemId={123} />);

    const editButtons = screen.getAllByLabelText('Editar pregunta');
    fireEvent.click(editButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Editar Pregunta')).toBeInTheDocument();
    expect(screen.getByTestId('question-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-mode')).toHaveTextContent('Editing');
  });

  it('should open delete confirmation dialog when delete button is clicked', () => {
    render(<QuestionManager videoItemId={123} />);

    const deleteButtons = screen.getAllByLabelText('Eliminar pregunta');
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de que deseas eliminar esta pregunta?')).toBeInTheDocument();
  });

  it('should create question when form is submitted in create mode', async () => {
    render(<QuestionManager videoItemId={123} />);

    // Open create dialog
    const createButton = screen.getByText('Crear Pregunta');
    fireEvent.click(createButton);

    // Submit form
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateMutate).toHaveBeenCalledWith({
        text: 'Nueva pregunta',
        videoItemId: 123
      });
    });
  });

  it('should update question when form is submitted in edit mode', async () => {
    render(<QuestionManager videoItemId={123} />);

    // Open edit dialog
    const editButtons = screen.getAllByLabelText('Editar pregunta');
    fireEvent.click(editButtons[0]);

    // Submit form
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalledWith({
        id: 1,
        data: { text: 'Nueva pregunta' }
      });
    });
  });

  it('should delete question when deletion is confirmed', async () => {
    render(<QuestionManager videoItemId={123} />);

    // Open delete dialog
    const deleteButtons = screen.getAllByLabelText('Eliminar pregunta');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith({
        id: 1,
        videoItemId: 123
      });
    });
  });

  it('should close dialogs when close buttons are clicked', () => {
    render(<QuestionManager videoItemId={123} />);

    // Open and close create dialog
    const createButton = screen.getByText('Crear Pregunta');
    fireEvent.click(createButton);
    
    const closeFormButton = screen.getByText('Close Form');
    fireEvent.click(closeFormButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open and close delete dialog
    const deleteButtons = screen.getAllByLabelText('Eliminar pregunta');
    fireEvent.click(deleteButtons[0]);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should disable create button when form is loading', () => {
    mockUseCreateQuestionMutation.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: true
    });

    render(<QuestionManager videoItemId={123} />);

    const createButton = screen.getByText('Crear Pregunta');
    expect(createButton).toBeDisabled();
  });

  it('should disable create button when update is loading', () => {
    mockUseUpdateQuestionMutation.mockReturnValue({
      mutate: mockUpdateMutate,
      isPending: true
    });

    render(<QuestionManager videoItemId={123} />);

    const createButton = screen.getByText('Crear Pregunta');
    expect(createButton).toBeDisabled();
  });

  it('should show loading state in form when mutation is pending', () => {
    mockUseCreateQuestionMutation.mockReturnValue({
      mutate: mockCreateMutate,
      isPending: true
    });

    render(<QuestionManager videoItemId={123} />);

    // Open create dialog
    const createButton = screen.getByText('Crear Pregunta');
    fireEvent.click(createButton);

    expect(screen.getByTestId('form-loading')).toBeInTheDocument();
  });
}); 