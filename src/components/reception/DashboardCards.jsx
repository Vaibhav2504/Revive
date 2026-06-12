// components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  MdPeople,
  MdEventNote,
  MdAccessTime,
  MdEmergency,
  MdLocalHospital,
  MdPersonAdd,
  MdTrendingUp,
  MdTrendingDown,
  MdMoreHoriz
} from 'react-icons/md';
import { FaUserMd, FaProcedures, FaAmbulance } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPatients: { value: 0, change: 0, trend: 'up' },
    appointmentsToday: { value: 0, change: 0, trend: 'up' },
    waitingPatients: { value: 0, change: 0, trend: 'down' },
    emergencyCases: { value: 0, change: 0, trend: 'up' },
    availableDoctors: { value: 0, change: 0, trend: 'down' },
    admissionsToday: { value: 0, change: 0, trend: 'up' }
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [hourlyVisits, setHourlyVisits] = useState([]);

  // Mock data - Replace with API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        totalPatients: { value: 247, change: 12.5, trend: 'up' },
        appointmentsToday: { value: 86, change: 5.2, trend: 'up' },
        waitingPatients: { value: 12, change: 8.3, trend: 'down' },
        emergencyCases: { value: 8, change: 15.2, trend: 'up' },
        availableDoctors: { value: 24, change: 4.1, trend: 'down' },
        admissionsToday: { value: 32, change: 10.5, trend: 'up' }
      });

      setRecentActivities([
        { id: 1, patient: 'John Doe', type: 'Check-in', time: '2 min ago', status: 'completed', doctor: 'Dr. Smith' },
        { id: 2, patient: 'Emma Wilson', type: 'Emergency', time: '5 min ago', status: 'urgent', doctor: 'Dr. Johnson' },
        { id: 3, patient: 'Michael Brown', type: 'Appointment', time: '10 min ago', status: 'waiting', doctor: 'Dr. Davis' },
        { id: 4, patient: 'Sarah Lee', type: 'Discharge', time: '15 min ago', status: 'completed', doctor: 'Dr. Miller' },
        { id: 5, patient: 'Robert Taylor', type: 'Admission', time: '20 min ago', status: 'pending', doctor: 'Dr. Wilson' }
      ]);

      setDepartmentStats([
        { name: 'Cardiology', patients: 45, appointments: 28, emergency: 5 },
        { name: 'Neurology', patients: 32, appointments: 22, emergency: 3 },
        { name: 'Pediatrics', patients: 58, appointments: 35, emergency: 2 },
        { name: 'Orthopedics', patients: 41, appointments: 30, emergency: 4 },
        { name: 'General', patients: 71, appointments: 45, emergency: 6 }
      ]);

      setHourlyVisits([
        { hour: '8 AM', patients: 12, appointments: 8 },
        { hour: '10 AM', patients: 28, appointments: 15 },
        { hour: '12 PM', patients: 35, appointments: 22 },
        { hour: '2 PM', patients: 42, appointments: 28 },
        { hour: '4 PM', patients: 38, appointments: 25 },
        { hour: '6 PM', patients: 25, appointments: 18 }
      ]);
    }, 500);
  }, []);

  const cards = [
    {
      id: 1,
      title: 'Total Patients Today',
      value: dashboardData.totalPatients.value,
      icon: <MdPeople className="text-4xl" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
      change: dashboardData.totalPatients.change,
      trend: dashboardData.totalPatients.trend,
      prefix: '',
      suffix: 'patients'
    },
    {
      id: 2,
      title: 'Appointments Today',
      value: dashboardData.appointmentsToday.value,
      icon: <MdEventNote className="text-4xl" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      change: dashboardData.appointmentsToday.change,
      trend: dashboardData.appointmentsToday.trend,
      prefix: '',
      suffix: 'appointments'
    },
    {
      id: 3,
      title: 'Waiting Patients',
      value: dashboardData.waitingPatients.value,
      icon: <MdAccessTime className="text-4xl" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      change: dashboardData.waitingPatients.change,
      trend: dashboardData.waitingPatients.trend,
      prefix: '',
      suffix: 'waiting'
    },
    {
      id: 4,
      title: 'Emergency Cases',
      value: dashboardData.emergencyCases.value,
      icon: <MdEmergency className="text-4xl" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500',
      change: dashboardData.emergencyCases.change,
      trend: dashboardData.emergencyCases.trend,
      prefix: '',
      suffix: 'cases'
    },
    {
      id: 5,
      title: 'Available Doctors',
      value: dashboardData.availableDoctors.value,
      icon: <FaUserMd className="text-4xl" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      change: dashboardData.availableDoctors.change,
      trend: dashboardData.availableDoctors.trend,
      prefix: '',
      suffix: 'doctors'
    },
    {
      id: 6,
      title: 'Admissions Today',
      value: dashboardData.admissionsToday.value,
      icon: <FaProcedures className="text-4xl" />,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      change: dashboardData.admissionsToday.change,
      trend: dashboardData.admissionsToday.trend,
      prefix: '',
      suffix: 'admissions'
    }
  ];

  const StatCard = ({ card, index }) => {
    return (
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl 
          transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up
          border border-gray-100
        `}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Gradient Background Effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`}></div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl ${card.iconColor} shadow-md`}>
              {card.icon}
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MdMoreHoriz className="text-xl" />
            </button>
          </div>

          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-bold text-gray-800">
                {card.prefix}{card.value}{card.suffix && ` ${card.suffix}`}
              </h3>
              <div className={`flex items-center space-x-1 ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend === 'up' ? <MdTrendingUp /> : <MdTrendingDown />}
                <span className="text-sm font-semibold">{card.change}%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-400">
              <span>vs. yesterday</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1 bg-gray-100 w-full">
          <div
            className={`h-full bg-gradient-to-r ${card.color} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(100, (card.value / 300) * 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-600';
        case 'urgent': return 'bg-red-100 text-red-600';
        case 'waiting': return 'bg-yellow-100 text-yellow-600';
        case 'pending': return 'bg-orange-100 text-orange-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };

    const getTypeIcon = (type) => {
      switch (type) {
        case 'Check-in': return <MdPersonAdd className="text-blue-500" />;
        case 'Emergency': return <FaAmbulance className="text-red-500" />;
        case 'Appointment': return <MdEventNote className="text-green-500" />;
        case 'Discharge': return <FaProcedures className="text-purple-500" />;
        case 'Admission': return <FaUserMd className="text-indigo-500" />;
        default: return <MdPeople className="text-gray-500" />;
      }
    };

    return (
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all duration-200 animate-slide-in-left">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            {getTypeIcon(activity.type)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{activity.patient}</p>
            <p className="text-xs text-gray-500">
              {activity.type} • {activity.doctor}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
            {activity.status}
          </span>
          <span className="text-xs text-gray-400">{activity.time}</span>
        </div>
      </div>
    );
  };

  const DepartmentBar = ({ dept, maxPatients }) => {
    const percentage = (dept.patients / maxPatients) * 100;

    return (
      <div className="mb-4 animate-fade-in">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{dept.name}</span>
          <span className="text-gray-500">{dept.patients} patients</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{dept.appointments} appointments</span>
          <span>{dept.emergency} emergencies</span>
        </div>
      </div>
    );
  };

  const maxPatients = Math.max(...departmentStats.map(d => d.patients));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening at the reception today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <StatCard key={card.id} card={card} index={index} />
        ))}
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Hourly Patient Flow Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Patient Flow</h2>
              <p className="text-sm text-gray-500">Hourly patient visits and appointments</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Patients</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Appointments</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyVisits}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="patients"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Department Load</h2>
              <p className="text-sm text-gray-500">Current patient distribution by department</p>
            </div>
            <div className="text-sm text-amber-600 font-medium">
              Total: {departmentStats.reduce((sum, d) => sum + d.patients, 0)} patients
            </div>
          </div>
          <div className="space-y-4">
            {departmentStats.map((dept, idx) => (
              <DepartmentBar key={idx} dept={dept} maxPatients={maxPatients} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
              <p className="text-sm text-gray-500">Latest patient check-ins and updates</p>
            </div>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            <p className="text-sm text-gray-500">Frequently used operations</p>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-between">
              <span>➕ New Patient Registration</span>
              <span className="text-amber-600">→</span>
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-between">
              <span>📅 Schedule Appointment</span>
              <span className="text-amber-600">→</span>
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-between">
              <span>🏥 Process Admission</span>
              <span className="text-amber-600">→</span>
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-between">
              <span>💰 Generate Bill</span>
              <span className="text-amber-600">→</span>
            </button>
          </div>

          {/* Alert Banner */}
          <div className="mt-6 p-4 bg-red-100 rounded-xl border border-red-200 animate-pulse-slow">
            <div className="flex items-center space-x-2 mb-2">
              <MdEmergency className="text-red-600 text-xl" />
              <span className="font-semibold text-red-800">Emergency Alert</span>
            </div>
            <p className="text-sm text-red-700">3 critical patients waiting in ER</p>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mt-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Last updated: Just now</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Next shift change in 2 hours 15 minutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;