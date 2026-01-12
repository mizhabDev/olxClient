import React from 'react';




const Layout = ({ children }) => {

  // Mock login state - in a real app this would come from context/store
  const isLoggedIn = true; 
  
  // Hide navbar on auth pages if desired, or keep it. Keeping it for now but maybe simplified?
  // For now, we show it everywhere.

  return (
    <div className="min-h-screen flex flex-col">
    
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
