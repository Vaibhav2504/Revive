// components/TopBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdSearch,
  MdNotifications,
  MdPerson,
  MdLogout,
  MdSettings,
  MdAccessTime,
  MdEmergency,
  MdPayment,
  MdPeople,
  MdClose,
  MdMenu
} from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

const TopBar = ({ sidebarOpen, setSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentShift, setCurrentShift] = useState('Morning');
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    role: 'Senior Receptionist',
    avatar: null,
    employeeId: 'REC-2024-001'
  };

  // Mock notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'emergency',
        title: 'Emergency Case',
        message: 'Patient John Doe needs immediate attention in ER',
        time: '2 minutes ago',
        priority: 'high',
        icon: <MdEmergency className="text-red-500" />,
        read: false
      },
      {
        id: 2,
        type: 'waiting',
        title: 'Waiting Patient Alert',
        message: '5 patients waiting more than 30 minutes',
        time: '5 minutes ago',
        priority: 'medium',
        icon: <MdPeople className="text-yellow-500" />,
        read: false
      },
      {
        id: 3,
        type: 'billing',
        title: 'Unpaid Bills',
        message: '3 patients have pending bills over ₹5000',
        time: '10 minutes ago',
        priority: 'high',
        icon: <MdPayment className="text-orange-500" />,
        read: false
      },
      {
        id: 4,
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Next appointment in 15 minutes - Dr. Smith',
        time: '15 minutes ago',
        priority: 'low',
        icon: <MdNotifications className="text-blue-500" />,
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine shift
  useEffect(() => {
    const hours = currentTime.getHours();
    if (hours >= 6 && hours < 14) {
      setCurrentShift('Morning Shift (6:00 AM - 2:00 PM)');
    } else if (hours >= 14 && hours < 22) {
      setCurrentShift('Evening Shift (2:00 PM - 10:00 PM)');
    } else {
      setCurrentShift('Night Shift (10:00 PM - 6:00 AM)');
    }
  }, [currentTime]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const mockResults = [
        { id: 1, type: 'patient', name: 'John Doe', info: 'Patient ID: P001', path: '/patients/1' },
        { id: 2, type: 'doctor', name: 'Dr. Smith', info: 'Cardiology', path: '/doctors/2' },
        { id: 3, type: 'appointment', name: 'Appointment #A123', info: 'Today 2:00 PM', path: '/appointments/3' },
        { id: 4, type: 'token', name: 'Token #45', info: 'Waiting in Queue', path: '/queue/45' }
      ].filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.info.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setShowNotifications(false);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-blue-100 border-blue-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <header className={`
      fixed top-0 right-0 z-40
      bg-white shadow-md
      transition-all duration-300
      ${sidebarOpen ? 'lg:left-64' : 'lg:left-20'}
      left-0
    `}>
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">

        {/* Left Section - Menu Toggle & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle Menu"
          >
            <MdMenu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-gray-500">Hospital Reception Dashboard</p>
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8" ref={searchRef}>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search patients, doctors, appointments, tokens..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MdClose className="text-xl" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${result.type === 'patient' ? 'bg-blue-100' : ''}
                      ${result.type === 'doctor' ? 'bg-green-100' : ''}
                      ${result.type === 'appointment' ? 'bg-purple-100' : ''}
                      ${result.type === 'token' ? 'bg-orange-100' : ''}
                    `}>
                      {result.type === 'patient' && <MdPeople className="text-blue-600" />}
                      {result.type === 'doctor' && <MdPerson className="text-green-600" />}
                      {result.type === 'appointment' && <MdNotifications className="text-purple-600" />}
                      {result.type === 'token' && <MdAccessTime className="text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.info}</p>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{result.type}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Notifications & User */}
        <div className="flex items-center space-x-2 lg:space-x-4">

          {/* Time Display */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <MdAccessTime className="text-amber-600 text-lg" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500 hidden lg:block">{currentShift}</p>
            </div>
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <MdNotifications className="text-2xl text-gray-600" />
              {getUnreadCount() > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getUnreadCount()}
                  </span>
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <p className="text-xs text-gray-500">You have {getUnreadCount()} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`
                        w-full text-left p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0
                        ${!notification.read ? 'bg-amber-50' : ''}
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-400">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <div className={`mt-2 inline-block px-2 py-1 rounded text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.toUpperCase()} Priority
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 lg:space-x-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <FaUserCircle className="text-white text-2xl" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">SJ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {user.employeeId}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <MdPerson className="text-gray-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <MdSettings className="text-gray-500" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                  >
                    <MdLogout className="text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search patients, doctors, appointments..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;