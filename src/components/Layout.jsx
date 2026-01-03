import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Hexagon Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(150deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(30deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(150deg, #334155 12%, transparent 12.5%, transparent 87%, #334155 87.5%, #334155),
            linear-gradient(60deg, #33415577 25%, transparent 25.5%, transparent 75%, #33415577 75%, #33415577),
            linear-gradient(60deg, #33415577 25%, transparent 25.5%, transparent 75%, #33415577 75%, #33415577)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
        }}
      />
      
      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      
      {/* Main Content Container */}
      <div className="relative z-10 w-full px-8 py-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;
