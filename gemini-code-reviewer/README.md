# 🤖 Gemini Code Reviewer

An intelligent code review tool powered by Google's Gemini AI that provides automated code analysis, suggestions, and best practices recommendations.

![Project Health](https://img.shields.io/badge/Health-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.2.0-purple)

## ✨ Features

- **Multi-Language Support**: JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, HTML, CSS, SQL, and more
- **AI-Powered Analysis**: Leverages Google's Gemini 2.5 Flash for intelligent code review
- **Real-time Feedback**: Instant code analysis with severity-based recommendations
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Robust error handling with custom error types
- **Security**: Environment-based API key management

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone and navigate to the project
git clone <repository-url>
cd gemini-code-reviewer

# Run automated setup
./setup.sh
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

3. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:5173`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node test-imports-and-functionality.js` - Run comprehensive verification tests

### Project Structure

```
gemini-code-reviewer/
├── src/
│   ├── components/          # React components
│   │   ├── CodeInput.tsx
│   │   ├── FeedbackDisplay.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── ...
│   ├── services/            # API services
│   │   └── geminiService.ts
│   ├── types.ts             # TypeScript types
│   ├── constants.ts         # App constants
│   └── App.tsx              # Main component
├── public/                  # Static assets
├── .env.example             # Environment template
└── setup.sh                # Automated setup script
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

### Supported Languages

The tool supports analysis for the following programming languages:

- JavaScript / TypeScript
- Python
- Java / Kotlin
- C# / C++
- Go / Rust
- Ruby / PHP
- Swift
- HTML / CSS
- SQL

## 📋 Code Review Features

### Feedback Types

- **🔴 Error**: Critical issues that need immediate attention
- **🟡 Warning**: Important issues that should be addressed
- **🔵 Suggestion**: Recommendations for improvement
- **🟢 Info**: General information and best practices

### Analysis Areas

- Code quality and best practices
- Performance optimizations
- Security vulnerabilities
- Type safety improvements
- Code structure and organization
- Documentation suggestions

## 🧪 Testing & Verification

The project includes a comprehensive test suite that verifies:

- ✅ Project structure integrity
- ✅ Dependency management
- ✅ TypeScript configuration
- ✅ Import/export consistency
- ✅ Component exports
- ✅ Configuration validity
- ✅ Code quality standards

Run verification tests:
```bash
node test-imports-and-functionality.js
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **AI Service**: Google Gemini API
- **Type Checking**: TypeScript 5.7.2

### Key Components

1. **CodeInput**: Multi-language code editor
2. **LanguageSelector**: Programming language selection
3. **FeedbackDisplay**: AI feedback visualization
4. **ErrorDisplay**: Error handling UI
5. **LoadingSpinner**: Loading states

### Service Layer

- **geminiService**: Handles AI API communication with robust error handling
- **Custom Error Types**: Specific error handling for different failure modes
- **Input Sanitization**: Security and validation for user input

## 🔒 Security

- Environment-based API key management
- Input sanitization and validation
- Error message sanitization
- No sensitive data logging

## 🚨 Error Handling

The application includes comprehensive error handling:

- **ConfigurationError**: API key or setup issues
- **GeminiAPIError**: API communication problems
- **ParseError**: Response parsing failures
- **Network errors**: Connection and timeout handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run verification tests: `node test-imports-and-functionality.js`
4. Ensure 100% test success rate
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure `.env` file exists with valid `GEMINI_API_KEY`
   - Check API key permissions at [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Build Errors**
   - Run `npm install` to ensure dependencies are installed
   - Check Node.js version (18+ required)

3. **Import Errors**
   - Run verification tests to check project integrity
   - Ensure all TypeScript types are properly exported

### Getting Help

- Run `./setup.sh` for automated setup and verification
- Check verification tests: `node test-imports-and-functionality.js`
- Review error messages in browser console

---

**Built with ❤️ using Google Gemini AI**
