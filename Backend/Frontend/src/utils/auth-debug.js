import Cookies from "js-cookie";

export const debugAuth = () => {
  const cookieToken = Cookies.get('jwt');
  const localStorageToken = localStorage.getItem('jwt');
  const userData = localStorage.getItem('ChatApp');
  
  console.log('🔍 Authentication Debug Info:');
  console.log('📧 Cookie JWT exists:', !!cookieToken);
  console.log('💾 LocalStorage JWT exists:', !!localStorageToken);
  console.log('👤 User data exists:', !!userData);
  
  if (cookieToken) {
    console.log('🍪 Cookie token (first 20 chars):', cookieToken.substring(0, 20) + '...');
  }
  
  if (localStorageToken) {
    console.log('💾 LocalStorage token (first 20 chars):', localStorageToken.substring(0, 20) + '...');
  }
  
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      console.log('👤 User info:', {
        id: parsed.user?._id,
        email: parsed.user?.email,
        hasToken: !!parsed.token
      });
    } catch (e) {
      console.log('❌ Failed to parse user data');
    }
  }
  
  return {
    hasCookieToken: !!cookieToken,
    hasLocalStorageToken: !!localStorageToken,
    hasUserData: !!userData,
    token: cookieToken || localStorageToken
  };
};

// You can call this function in browser console: window.debugAuth()
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
