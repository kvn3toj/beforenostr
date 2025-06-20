# Question Module - Interactive Questions for Videos

## Overview

This module implements the backend functionality for managing interactive questions that appear during video playback. It provides a complete CRUD API for questions and their answer options.

## Features

- **Question Types**: Supports multiple-choice, short-answer, and true-false questions
- **Multilingual Support**: Questions can be created in different languages
- **Timestamp-based**: Questions are tied to specific timestamps in videos
- **Answer Options**: Full support for multiple-choice questions with multiple answer options
- **Validation**: Business logic validation for question types and answer options

## API Endpoints

### Questions

- `POST /questions` - Create a new question
- `GET /questions?videoItemId={id}` - Get all questions for a video item
- `GET /questions/{id}` - Get a specific question by ID
- `PATCH /questions/{id}` - Update a question
- `DELETE /questions/{id}` - Delete a question

### Query Parameters for GET /questions

- `videoItemId` (required): Filter questions by video item ID
- `languageCode` (optional): Filter by language code (e.g., "es-ES", "en-US")
- `type` (optional): Filter by question type ("multiple-choice", "short-answer", "true-false")
- `isActive` (optional): Filter by active status (boolean)

## Data Models

### Question

```typescript
{
  id: number;
  videoItemId: number;
  timestamp: number; // Time in seconds where question appears
  type: 'multiple-choice' | 'short-answer' | 'true-false';
  text: string;
  languageCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  answerOptions?: AnswerOption[]; // Only for multiple-choice questions
}
```

### AnswerOption

```typescript
{
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Business Logic

### Multiple-Choice Questions

- Must have at least one answer option
- Must have at least one correct answer option
- Answer options are automatically managed (create, update, delete) when updating questions

### Validation Rules

1. **Question Creation**:
   - Multiple-choice questions must include answer options
   - At least one answer option must be marked as correct
   - All required fields must be provided

2. **Question Updates**:
   - Answer options can be added, updated, or removed
   - Existing options not included in update are deleted
   - New options (without ID) are created
   - Existing options (with ID) are updated

## Usage Examples

### Create a Multiple-Choice Question

```json
POST /questions
{
  "videoItemId": 1,
  "timestamp": 120,
  "type": "multiple-choice",
  "text": "¿Cuál es la capital de España?",
  "languageCode": "es-ES",
  "isActive": true,
  "answerOptions": [
    {
      "text": "Madrid",
      "isCorrect": true,
      "order": 1
    },
    {
      "text": "Barcelona",
      "isCorrect": false,
      "order": 2
    },
    {
      "text": "Valencia",
      "isCorrect": false,
      "order": 3
    }
  ]
}
```

### Create a Short-Answer Question

```json
POST /questions
{
  "videoItemId": 1,
  "timestamp": 180,
  "type": "short-answer",
  "text": "Explica el concepto de gamificación en tus propias palabras.",
  "languageCode": "es-ES",
  "isActive": true
}
```

### Update a Question with Answer Options

```json
PATCH /questions/1
{
  "text": "¿Cuál es la capital de España? (Actualizada)",
  "answerOptions": [
    {
      "id": 1,
      "text": "Madrid",
      "isCorrect": true,
      "order": 1
    },
    {
      "text": "Sevilla",
      "isCorrect": false,
      "order": 4
    }
  ]
}
```

## Files Structure

```
src/questions/
├── dto/
│   ├── create-question.dto.ts
│   ├── update-question.dto.ts
│   ├── find-all-questions.dto.ts
│   └── index.ts
├── question.service.ts
├── question.controller.ts
├── question.module.ts
└── README.md
```

## Dependencies

- **NestJS**: Framework for building the API
- **Prisma**: ORM for database operations
- **class-validator**: Input validation
- **class-transformer**: Data transformation
- **@nestjs/swagger**: API documentation

## Database Schema

The module uses two main database tables:

1. **questions**: Stores question data
2. **answer_options**: Stores answer options for multiple-choice questions

See `prisma/schema.prisma` for the complete database schema.

## Security Considerations

- Authentication and authorization guards are commented out in the controller
- Uncomment and configure guards based on your security requirements
- Consider implementing rate limiting for question creation
- Validate video item ownership before allowing question creation

## Future Enhancements

- [ ] Pagination for question listing
- [ ] Question analytics and statistics
- [ ] Question templates and categories
- [ ] Bulk operations for questions
- [ ] Question versioning and history
- [ ] Advanced validation rules
- [ ] Question scheduling (show/hide based on date/time) 