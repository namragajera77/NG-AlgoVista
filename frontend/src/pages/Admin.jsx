import  React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap , Video} from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  // This state keeps track of which admin option is currently selected
  const [selectedOption, setSelectedOption] = useState(null);

  // This array contains all the admin options that will be displayed as cards
  // Each option has an id, title, description, icon, colors, and route to navigate to
  const adminOptions = [
    {
      id: 'create', // Unique identifier for this option
      title: 'Create Problem', // What this option does
      description: 'Add a new coding problem to the platform', // Detailed explanation
      icon: Plus, // Which icon to show (plus sign for creating)
      color: 'btn-success', // Button color class
      bgColor: 'bg-success/10', // Background color class
      gradient: 'from-green-500/20 to-emerald-500/20', // Gradient background for icon
      iconGradient: 'from-green-400 to-emerald-500', // Gradient for the icon itself
      route: '/admin/create' // Where to navigate when clicked
    },
    {
      id: 'update', // Unique identifier for this option
      title: 'Update Problem', // What this option does
      description: 'Edit existing problems and their details', // Detailed explanation
      icon: Edit, // Which icon to show (edit icon)
      color: 'btn-warning', // Button color class
      bgColor: 'bg-warning/10', // Background color class
      gradient: 'from-yellow-500/20 to-orange-500/20', // Gradient background for icon
      iconGradient: 'from-yellow-400 to-orange-500', // Gradient for the icon itself
      route: '/admin/update' // Where to navigate when clicked
    },
    {
      id: 'delete', // Unique identifier for this option
      title: 'Delete Problem', // What this option does
      description: 'Remove problems from the platform', // Detailed explanation
      icon: Trash2, // Which icon to show (trash icon for deleting)
      color: 'btn-error', // Button color class
      bgColor: 'bg-error/10', // Background color class
      gradient: 'from-red-500/20 to-pink-500/20', // Gradient background for icon
      iconGradient: 'from-red-400 to-pink-500', // Gradient for the icon itself
      route: '/admin/delete' // Where to navigate when clicked
    },
    {
      id: 'video', // Unique identifier for this option
      title: 'video problem', // What this option does
      description: 'video upload and delete', // Detailed explanation
      icon: Video, // Which icon to show (edit icon)
      color: 'btn-warning', // Button color class
      bgColor: 'bg-warning/10', // Background color class
      gradient: 'from-yellow-500/20 to-orange-500/20', // Gradient background for icon
      iconGradient: 'from-yellow-400 to-orange-500', // Gradient for the icon itself
      route: '/admin/video' // Where to navigate when clicked
    }
  ];

  return (
    // Main container with beautiful gradient background from dark slate to purple to dark slate
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Container to center and limit the width of the content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Header section with title and description */}
        <div className="text-center mb-12">
          {/* Main title with gradient text effect (yellow to orange to pink) */}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          {/* Subtitle explaining what the admin panel does */}
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Manage coding problems on your platform with powerful tools and intuitive controls
          </p>
        </div>

        {/* Grid layout for displaying admin option cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Loop through each admin option and create a card for it */}
          {adminOptions.map((option) => {
            // Get the icon component from the option
            const IconComponent = option.icon;
            return (
              // Each card with glassmorphism effect (semi-transparent white background with blur)
              <div
                key={option.id}
                className="card bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                {/* Card content area */}
                <div className="card-body items-center text-center p-8">
                  
                  {/* Icon section with gradient background and hover effects */}
                  <div className={`bg-gradient-to-br ${option.gradient} p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className={`bg-gradient-to-r ${option.iconGradient} bg-clip-text text-transparent`}>
                      <IconComponent size={40} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Card title that changes color on hover */}
                  <h2 className="card-title text-xl mb-3 text-white group-hover:text-yellow-300 transition-colors duration-300">
                    {option.title}
                  </h2>
                  
                  {/* Card description */}
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Action button that navigates to the specific admin page */}
                  <div className="card-actions">
                    <NavLink 
                      to={option.route}
                      className={`btn ${option.color} btn-wide bg-gradient-to-r ${option.iconGradient} border-0 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105`}
                    >
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional section with quick action cards for extra admin features */}
        <div className="mt-16 max-w-4xl mx-auto">
          {/* Grid for the additional admin stats or quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
              {/* Icon with blue gradient */}
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Quick Actions</h3>
              <p className="text-white/70 text-sm">Access frequently used admin functions</p>
            </div>
            
            {/* System Status Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
              {/* Icon with purple gradient */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <RefreshCw className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">System Status</h3>
              <p className="text-white/70 text-sm">Monitor platform performance and health</p>
            </div>
            
            {/* Back to Home Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
              {/* Icon with green gradient */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Home className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Back to Home</h3>
              <p className="text-white/70 text-sm">Return to the main dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;