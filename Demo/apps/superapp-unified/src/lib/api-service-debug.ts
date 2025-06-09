/**
 * 🛠️ API Service Debug - Enhanced debugging and error handling for network issues
 *
 * This service provides additional debugging capabilities to identify and resolve
 * "Failed to fetch" errors commonly caused by CORS, backend connectivity, or network issues.
 */

// 🔧 Enhanced Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const API_TIMEOUT = 15000; // Increased timeout for debugging
const MAX_RETRIES = 3;

interface NetworkDiagnostic {
  step: string;
  success: boolean;
  error?: string;
  details?: any;
  timestamp: number;
}

class ApiServiceDebug {
  private baseURL: string;
  private timeout: number;
  private diagnostics: NetworkDiagnostic[] = [];

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.logConfiguration();
  }

  /**
   * 📊 Log initial configuration
   */
  private logConfiguration(): void {
    console.group('🔧 API Service Debug Configuration');
    console.log('🎯 Base URL:', this.baseURL);
    console.log('⏱️ Timeout:', this.timeout);
    console.log('🌍 Origin:', window.location.origin);
    console.log('📡 Navigator Online:', navigator.onLine);
    console.log('🌐 User Agent:', navigator.userAgent);
    console.log('🔄 Max Retries:', MAX_RETRIES);
    console.groupEnd();
  }

  /**
   * 🏥 Comprehensive health check and diagnostics
   */
  async runDiagnostics(): Promise<{
    success: boolean;
    diagnostics: NetworkDiagnostic[];
  }> {
    this.diagnostics = [];
    console.group('🏥 Running Network Diagnostics');

    // Test 1: Basic connectivity
    await this.testBasicConnectivity();

    // Test 2: CORS preflight
    await this.testCORSPreflight();

    // Test 3: Backend health endpoint
    await this.testBackendHealth();

    // Test 4: Auth endpoint availability
    await this.testAuthEndpoint();

    // Test 5: Network timing
    await this.testNetworkTiming();

    console.log('📊 Diagnostics Summary:', this.diagnostics);
    console.groupEnd();

    const allSuccessful = this.diagnostics.every((d) => d.success);
    return {
      success: allSuccessful,
      diagnostics: this.diagnostics,
    };
  }

  /**
   * 🔗 Test basic connectivity to backend
   */
  private async testBasicConnectivity(): Promise<void> {
    const step = 'Basic Connectivity';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.baseURL, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      this.diagnostics.push({
        step,
        success: true,
        details: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
        timestamp: Date.now(),
      });

      console.log('✅ Basic connectivity test passed');
    } catch (error: any) {
      this.diagnostics.push({
        step,
        success: false,
        error: error.message,
        details: { errorType: error.name },
        timestamp: Date.now(),
      });

      console.error('❌ Basic connectivity test failed:', error);
    }
  }

  /**
   * 🚥 Test CORS preflight request
   */
  private async testCORSPreflight(): Promise<void> {
    const step = 'CORS Preflight';
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          Origin: window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
        mode: 'cors',
      });

      const corsHeaders = {
        'access-control-allow-origin': response.headers.get(
          'access-control-allow-origin'
        ),
        'access-control-allow-methods': response.headers.get(
          'access-control-allow-methods'
        ),
        'access-control-allow-headers': response.headers.get(
          'access-control-allow-headers'
        ),
        'access-control-allow-credentials': response.headers.get(
          'access-control-allow-credentials'
        ),
      };

      this.diagnostics.push({
        step,
        success: response.status === 200 || response.status === 204,
        details: {
          status: response.status,
          corsHeaders,
          originAllowed:
            corsHeaders['access-control-allow-origin'] ===
              window.location.origin ||
            corsHeaders['access-control-allow-origin'] === '*',
        },
        timestamp: Date.now(),
      });

      console.log('✅ CORS preflight test completed:', corsHeaders);
    } catch (error: any) {
      this.diagnostics.push({
        step,
        success: false,
        error: error.message,
        timestamp: Date.now(),
      });

      console.error('❌ CORS preflight test failed:', error);
    }
  }

  /**
   * 🏥 Test backend health endpoint
   */
  private async testBackendHealth(): Promise<void> {
    const step = 'Backend Health';
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const healthData = await response.json();
        this.diagnostics.push({
          step,
          success: true,
          details: healthData,
          timestamp: Date.now(),
        });

        console.log('✅ Backend health check passed:', healthData);
      } else {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } catch (error: any) {
      this.diagnostics.push({
        step,
        success: false,
        error: error.message,
        timestamp: Date.now(),
      });

      console.error('❌ Backend health check failed:', error);
    }
  }

  /**
   * 🔐 Test auth endpoint availability
   */
  private async testAuthEndpoint(): Promise<void> {
    const step = 'Auth Endpoint';
    try {
      // Try to make a login request with invalid credentials to test endpoint availability
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test',
        }),
        mode: 'cors',
      });

      // We expect this to fail with 401, which means the endpoint is available
      this.diagnostics.push({
        step,
        success: response.status === 401 || response.status === 400,
        details: {
          status: response.status,
          endpointAvailable: true,
        },
        timestamp: Date.now(),
      });

      console.log('✅ Auth endpoint availability test passed');
    } catch (error: any) {
      this.diagnostics.push({
        step,
        success: false,
        error: error.message,
        details: { endpointAvailable: false },
        timestamp: Date.now(),
      });

      console.error('❌ Auth endpoint test failed:', error);
    }
  }

  /**
   * ⏱️ Test network timing and performance
   */
  private async testNetworkTiming(): Promise<void> {
    const step = 'Network Timing';
    try {
      const startTime = Date.now();

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        mode: 'cors',
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      this.diagnostics.push({
        step,
        success: duration < 10000, // Consider successful if under 10 seconds
        details: {
          duration,
          timing: {
            slow: duration > 3000,
            acceptable: duration < 1000,
            fast: duration < 500,
          },
        },
        timestamp: Date.now(),
      });

      console.log(`✅ Network timing test: ${duration}ms`);
    } catch (error: any) {
      this.diagnostics.push({
        step,
        success: false,
        error: error.message,
        timestamp: Date.now(),
      });

      console.error('❌ Network timing test failed:', error);
    }
  }

  /**
   * 🔧 Enhanced login with comprehensive error handling and auto-diagnostics
   */
  async enhancedLogin(email: string, password: string): Promise<any> {
    console.group('🔐 Enhanced Login Attempt');
    console.log('📧 Email:', email);
    console.log('🌍 Origin:', window.location.origin);
    console.log('🎯 Target:', `${this.baseURL}/auth/login`);

    try {
      // First, run quick diagnostics if this is the first failure
      if (this.diagnostics.length === 0) {
        console.log('🏥 Running pre-login diagnostics...');
        const diagnostics = await this.runDiagnostics();

        if (!diagnostics.success) {
          console.error('❌ Pre-login diagnostics failed');
          const failedSteps = diagnostics.diagnostics
            .filter((d) => !d.success)
            .map((d) => d.step);

          throw new Error(
            `Network diagnostics failed: ${failedSteps.join(', ')}. Please check if the backend is running on ${this.baseURL}`
          );
        }
      }

      // Prepare request with enhanced debugging
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Origin: window.location.origin,
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include',
      };

      console.log('📦 Request Options:', requestOptions);

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('⏰ Request timeout - aborting');
        controller.abort();
      }, this.timeout);

      requestOptions.signal = controller.signal;

      // Make the request
      console.log('🚀 Sending login request...');
      const response = await fetch(
        `${this.baseURL}/auth/login`,
        requestOptions
      );

      clearTimeout(timeoutId);

      console.log('📨 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Failed to parse error response
        }

        console.error('❌ Login request failed:', errorMessage);
        console.groupEnd();

        // Provide helpful error messages based on status
        switch (response.status) {
          case 401:
            throw new Error(
              'Credenciales incorrectas. Verifica tu email y contraseña.'
            );
          case 404:
            throw new Error(
              'Endpoint de login no encontrado. Verifica que el backend esté configurado correctamente.'
            );
          case 500:
            throw new Error(
              'Error interno del servidor. Intenta nuevamente en unos momentos.'
            );
          case 0:
            throw new Error(
              'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.'
            );
          default:
            throw new Error(errorMessage);
        }
      }

      // Parse successful response
      const data = await response.json();
      console.log('✅ Login successful:', {
        hasToken: !!data.access_token,
        hasUser: !!data.user,
        userEmail: data.user?.email,
      });
      console.groupEnd();

      return data;
    } catch (error: any) {
      console.error('💥 Enhanced login error:', error);
      console.groupEnd();

      // Enhanced error categorization
      if (error.name === 'AbortError') {
        throw new Error(
          `Request timeout after ${this.timeout}ms. The server may be slow or unreachable.`
        );
      }

      if (error.message.includes('fetch')) {
        // This is likely a network connectivity issue
        const networkError = new Error(
          `Network Error: Cannot connect to backend at ${this.baseURL}. ` +
            `Please ensure the backend server is running and accessible. ` +
            `Current error: ${error.message}`
        );
        (networkError as any).category = 'network';
        (networkError as any).troubleshooting = [
          `Check if backend is running: npm run start:backend:dev`,
          `Verify backend URL: ${this.baseURL}`,
          `Check CORS configuration for origin: ${window.location.origin}`,
          `Test manually: curl -X POST ${this.baseURL}/auth/login -H "Content-Type: application/json" -d '{"email":"${email}","password":"***"}'`,
        ];
        throw networkError;
      }

      // Re-throw with additional context
      const enhancedError = new Error(error.message);
      (enhancedError as any).originalError = error;
      (enhancedError as any).diagnostics = this.diagnostics;
      (enhancedError as any).timestamp = Date.now();
      throw enhancedError;
    }
  }

  /**
   * 🔍 Generate diagnostic report
   */
  generateDiagnosticReport(): string {
    const report = [
      '🔍 API Service Diagnostic Report',
      '='.repeat(50),
      `🎯 Base URL: ${this.baseURL}`,
      `🌍 Origin: ${window.location.origin}`,
      `📡 Online: ${navigator.onLine}`,
      `⏱️ Timestamp: ${new Date().toISOString()}`,
      '',
      '📊 Test Results:',
      ...this.diagnostics.map(
        (d) =>
          `  ${d.success ? '✅' : '❌'} ${d.step}: ${d.success ? 'PASSED' : `FAILED - ${d.error}`}`
      ),
      '',
      '🛠️ Troubleshooting Steps:',
      '1. Ensure backend is running: npm run start:backend:dev',
      `2. Verify backend responds to: ${this.baseURL}/health`,
      `3. Check CORS allows origin: ${window.location.origin}`,
      '4. Review browser network tab for detailed error information',
      '5. Check backend logs for any errors',
      '',
      '🔧 Recommended Actions:',
      ...(this.diagnostics.some(
        (d) => !d.success && d.step === 'Basic Connectivity'
      )
        ? ['• Backend server is not running or not accessible']
        : []),
      ...(this.diagnostics.some(
        (d) => !d.success && d.step === 'CORS Preflight'
      )
        ? ['• CORS configuration issue - check backend CORS settings']
        : []),
      ...(this.diagnostics.some(
        (d) => !d.success && d.step === 'Backend Health'
      )
        ? ['• Backend health endpoint not responding - check server status']
        : []),
    ].join('\n');

    return report;
  }
}

// Export enhanced service instance
export const apiServiceDebug = new ApiServiceDebug();

// Enhanced auth API with debugging
export const authAPIDebug = {
  async login(email: string, password: string) {
    return apiServiceDebug.enhancedLogin(email, password);
  },

  async runDiagnostics() {
    return apiServiceDebug.runDiagnostics();
  },

  generateReport() {
    return apiServiceDebug.generateDiagnosticReport();
  },
};

export default apiServiceDebug;
