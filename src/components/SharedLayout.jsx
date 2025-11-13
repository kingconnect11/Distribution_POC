import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const SharedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-3xl font-bold text-gray-900">True Distribute</h1>
              <p className="text-sm text-gray-600 mt-1">Court Revenue Distribution Testing Software</p>
            </div>

            {!isHomePage && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 True Distribute. Court Revenue Distribution Testing Software.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SharedLayout;
