// Dummy base44 client for backward compatibility
// This prevents errors in files that still import base44

export const base44 = {
  auth: {
    me: () => {
      console.log('base44.auth.me() bypassed');
      return Promise.resolve(null);
    },
    logout: () => {
      console.log('base44.auth.logout() bypassed');
    },
    redirectToLogin: (url) => {
      console.log('base44.auth.redirectToLogin() bypassed');
    }
  },
  // Add any other base44 methods that might be used
  query: () => {
    console.log('base44.query() bypassed');
    return Promise.resolve([]);
  }
};
