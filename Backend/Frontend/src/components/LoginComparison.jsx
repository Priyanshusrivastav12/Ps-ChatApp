import React from 'react';
import { Link } from 'react-router-dom';

const LoginComparison = () => {
  const basicFeatures = [
    "Basic email/password form",
    "Simple validation (required fields only)",
    "Basic error handling",
    "Standard submit button",
    "Simple styling"
  ];

  const enhancedFeatures = [
    "✅ Advanced email validation with typo detection",
    "✅ Password strength indicator & visibility toggle",
    "✅ Rate limiting & account lockout protection",
    "✅ Remember me functionality",
    "✅ Forgot password integration",
    "✅ Social login preparation (Google, GitHub)",
    "✅ Real-time validation feedback",
    "✅ Accessibility features (ARIA, keyboard nav)",
    "✅ Loading states & progress indicators",
    "✅ Security features (device fingerprinting)",
    "✅ Session management",
    "✅ Responsive design with animations",
    "✅ Error recovery mechanisms",
    "✅ Form persistence",
    "✅ Input sanitization",
    "✅ Professional UI/UX design"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Login Component Comparison
          </h1>
          <p className="text-white/70 text-lg">
            See the difference between basic and enhanced authentication
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Basic Login */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Basic Login</h2>
              <p className="text-white/60">Standard implementation</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {feature}
                </div>
              ))}
            </div>

            <Link
              to="/login-basic"
              className="w-full block text-center py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-500 transition-colors"
            >
              Try Basic Login
            </Link>
          </div>

          {/* Enhanced Login */}
          <div className="bg-white/10 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Enhanced Login
              </h2>
              <p className="text-white/60">Production-ready implementation</p>
            </div>
            
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {enhancedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start text-white/80 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                  {feature}
                </div>
              ))}
            </div>

            <Link
              to="/login"
              className="w-full block text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg"
            >
              Try Enhanced Login
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Real-World Benefits
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🔐</div>
                <h4 className="font-semibold text-white">Security</h4>
                <p className="text-white/60">Protection against attacks</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-white">User Experience</h4>
                <p className="text-white/60">Smooth and intuitive</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">♿</div>
                <h4 className="font-semibold text-white">Accessibility</h4>
                <p className="text-white/60">Inclusive for all users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComparison;
