import React, { useState, useEffect } from 'react';

const AppointmentPanel = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [patientNotFound, setPatientNotFound] = useState(false);

  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    department: '',
    appointmentDate: '',
    timeSlot: '',
    appointmentType: 'New Visit',
    disease: '',
    symptoms: '',
    notes: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Mock patient database
  const mockPatients = {
    'PAT001': {
      id: 'PAT001',
      fullName: 'Aarav Sharma',
      age: 34,
      dob: '1990-05-15',
      gender: 'Male',
      mobileNumber: '9876543210',
      email: 'aarav.sharma@example.com',
      address: '123, Green Park, New Delhi',
      emergencyContact: '9999999999'
    },
    'PAT002': {
      id: 'PAT002',
      fullName: 'Priya Patel',
      age: 39,
      dob: '1985-08-22',
      gender: 'Female',
      mobileNumber: '9988776655',
      email: 'priya.patel@example.com',
      address: '456, Lake View, Mumbai',
      emergencyContact: '9876543210'
    },
    'PAT003': {
      id: 'PAT003',
      fullName: 'Rahul Verma',
      age: 4,
      dob: '2020-03-10',
      gender: 'Male',
      mobileNumber: '8877665544',
      email: '',
      address: '789, Civil Lines, Lucknow',
      emergencyContact: '9988776655'
    },
    'PAT004': {
      id: 'PAT004',
      fullName: 'Dr. Sanjay Gupta',
      age: 45,
      dob: '1979-12-01',
      gender: 'Male',
      mobileNumber: '7778889990',
      email: 'sanjay.gupta@example.com',
      address: '45, Doctor Lane, Pune',
      emergencyContact: '8887776665'
    }
  };

  // Mock doctors database
  const mockDoctors = [
    { id: 'DOC001', name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', department: 'Cardiology', experience: '15 years', available: true, image: '👨‍⚕️' },
    { id: 'DOC002', name: 'Dr. Sneha Reddy', specialty: 'Neurology', department: 'Neurology', experience: '12 years', available: true, image: '👩‍⚕️' },
    { id: 'DOC003', name: 'Dr. Amit Patel', specialty: 'Orthopedics', department: 'Orthopedics', experience: '10 years', available: true, image: '👨‍⚕️' },
    { id: 'DOC004', name: 'Dr. Priya Singh', specialty: 'Pediatrics', department: 'Pediatrics', experience: '8 years', available: true, image: '👩‍⚕️' },
    { id: 'DOC005', name: 'Dr. Anjali Sharma', specialty: 'Dermatology', department: 'Dermatology', experience: '11 years', available: true, image: '👩‍⚕️' },
    { id: 'DOC006', name: 'Dr. Vikram Mehta', specialty: 'General Medicine', department: 'General Medicine', experience: '14 years', available: true, image: '👨‍⚕️' },
    { id: 'DOC007', name: 'Dr. Neha Kapoor', specialty: 'Gynecology', department: 'Gynecology', experience: '9 years', available: true, image: '👩‍⚕️' },
    { id: 'DOC008', name: 'Dr. Sunil Joshi', specialty: 'Ophthalmology', department: 'Ophthalmology', experience: '13 years', available: true, image: '👨‍⚕️' }
  ];

  // Disease to specialty mapping
  const diseaseSpecialtyMap = {
    'heart': 'Cardiology',
    'chest pain': 'Cardiology',
    'hypertension': 'Cardiology',
    'brain': 'Neurology',
    'headache': 'Neurology',
    'migraine': 'Neurology',
    'seizure': 'Neurology',
    'bone': 'Orthopedics',
    'joint pain': 'Orthopedics',
    'fracture': 'Orthopedics',
    'back pain': 'Orthopedics',
    'child': 'Pediatrics',
    'baby': 'Pediatrics',
    'skin': 'Dermatology',
    'rash': 'Dermatology',
    'acne': 'Dermatology',
    'fever': 'General Medicine',
    'cold': 'General Medicine',
    'cough': 'General Medicine',
    'infection': 'General Medicine',
    'pregnancy': 'Gynecology',
    'menstrual': 'Gynecology',
    'eye': 'Ophthalmology',
    'vision': 'Ophthalmology'
  };

  // Time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  // Fetch patient by ID
  const fetchPatientById = () => {
    if (!patientId.trim()) {
      alert('Please enter a Patient ID');
      return;
    }

    setIsLoadingPatient(true);
    setPatientNotFound(false);

    // Simulate API call
    setTimeout(() => {
      const patient = mockPatients[patientId.toUpperCase()];
      if (patient) {
        setPatientData(patient);
        setPatientNotFound(false);
      } else {
        setPatientData(null);
        setPatientNotFound(true);
      }
      setIsLoadingPatient(false);
    }, 500);
  };

  // Handle disease input and suggest doctors
  const handleDiseaseChange = (e) => {
    const disease = e.target.value;
    setAppointmentData(prev => ({ ...prev, disease, department: '' }));

    // Auto-suggest specialty based on disease
    const lowerDisease = disease.toLowerCase();
    let suggestedSpecialty = '';

    for (const [keyword, specialty] of Object.entries(diseaseSpecialtyMap)) {
      if (lowerDisease.includes(keyword)) {
        suggestedSpecialty = specialty;
        break;
      }
    }

    if (suggestedSpecialty) {
      setAppointmentData(prev => ({ ...prev, department: suggestedSpecialty }));
      filterDoctorsBySpecialty(suggestedSpecialty);
    } else if (disease.length > 2) {
      setAppointmentData(prev => ({ ...prev, department: '' }));
      setFilteredDoctors([]);
    }
  };

  // Filter doctors by specialty
  const filterDoctorsBySpecialty = (specialty) => {
    const filtered = mockDoctors.filter(doc => doc.department === specialty && doc.available);
    setFilteredDoctors(filtered);
    if (filtered.length === 1) {
      setAppointmentData(prev => ({ ...prev, doctorId: filtered[0].id }));
    } else {
      setAppointmentData(prev => ({ ...prev, doctorId: '' }));
    }
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setAppointmentData(prev => ({ ...prev, department, doctorId: '' }));
    filterDoctorsBySpecialty(department);
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    setAppointmentData(prev => ({ ...prev, doctorId: e.target.value }));
  };

  // Generate available time slots based on date
  const handleDateChange = (e) => {
    const date = e.target.value;
    setAppointmentData(prev => ({ ...prev, appointmentDate: date, timeSlot: '' }));

    // Simulate fetching available slots for the selected date
    if (date) {
      const bookedSlots = ['10:00 AM', '02:30 PM']; // Mock booked slots
      const available = timeSlots.filter(slot => !bookedSlots.includes(slot));
      setAvailableSlots(available);
    } else {
      setAvailableSlots([]);
    }
  };

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientData) {
      alert('Please search and verify patient first');
      return;
    }

    if (!appointmentData.department || !appointmentData.doctorId || !appointmentData.appointmentDate || !appointmentData.timeSlot) {
      alert('Please fill all required appointment details');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedDoctor = mockDoctors.find(doc => doc.id === appointmentData.doctorId);
    const appointmentId = `APT${Date.now()}`;

    const bookingInfo = {
      appointmentId,
      patient: patientData,
      doctor: selectedDoctor,
      appointment: {
        ...appointmentData,
        date: new Date(appointmentData.appointmentDate).toLocaleDateString(),
        time: appointmentData.timeSlot
      },
      status: 'Confirmed',
      bookingTime: new Date().toLocaleString()
    };

    setBookingDetails(bookingInfo);
    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      // Optionally reset form
    }, 3000);
  };

  const handleReset = () => {
    setPatientId('');
    setPatientData(null);
    setPatientNotFound(false);
    setAppointmentData({
      doctorId: '',
      department: '',
      appointmentDate: '',
      timeSlot: '',
      appointmentType: 'New Visit',
      disease: '',
      symptoms: '',
      notes: ''
    });
    setFilteredDoctors([]);
    setAvailableSlots([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-slideDown">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Appointment Panel
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
          </div>
          <p className="text-gray-600 mt-3 text-lg">Schedule patient appointments with specialized doctors</p>
        </div>

        {/* Success Modal */}
        {showSuccess && bookingDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 transform animate-scaleUp">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Appointment Confirmed!</h2>
                <p className="text-gray-600 mt-2">Booking ID: {bookingDetails.appointmentId}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-semibold">{bookingDetails.patient.fullName}</p>
                    <p className="text-sm text-gray-600">{bookingDetails.patient.age} yrs | {bookingDetails.patient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-semibold">{bookingDetails.doctor.name}</p>
                    <p className="text-sm text-gray-600">{bookingDetails.doctor.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-semibold">{bookingDetails.appointment.date}</p>
                    <p className="text-sm text-gray-600">{bookingDetails.appointment.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment Type</p>
                    <p className="font-semibold">{bookingDetails.appointment.appointmentType}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Patient Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all duration-300 hover:shadow-2xl animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              Patient Verification
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter Patient ID (e.g., PAT001)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={fetchPatientById}
                  disabled={isLoadingPatient}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {isLoadingPatient ? 'Searching...' : '🔍 Fetch Patient'}
                </button>
              </div>
            </div>

            {/* Patient Details Display */}
            {isLoadingPatient && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {patientNotFound && !isLoadingPatient && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <p className="text-red-700">❌ Patient not found. Please check the ID or register a new patient.</p>
              </div>
            )}

            {patientData && !isLoadingPatient && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800">{patientData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Age / DOB</p>
                    <p className="font-semibold text-gray-800">{patientData.age} years / {new Date(patientData.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800">{patientData.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="font-semibold text-gray-800">{patientData.mobileNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800">{patientData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-gray-800 truncate">{patientData.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Emergency Contact</p>
                    <p className="font-semibold text-gray-800">{patientData.emergencyContact}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Appointment Details Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transform transition-all duration-300 hover:shadow-2xl animate-slideUp" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
              Medical & Appointment Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Medical Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease / Symptoms *</label>
                  <input
                    type="text"
                    value={appointmentData.disease}
                    onChange={handleDiseaseChange}
                    placeholder="e.g., fever, chest pain, headache"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter symptoms to get doctor suggestions</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Symptoms</label>
                  <textarea
                    value={appointmentData.symptoms}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, symptoms: e.target.value }))}
                    rows="2"
                    placeholder="Describe symptoms in detail..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department / Specialty *</label>
                  <select
                    value={appointmentData.department}
                    onChange={handleDepartmentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  >
                    <option value="">Select Department</option>
                    <option value="Cardiology">❤️ Cardiology</option>
                    <option value="Neurology">🧠 Neurology</option>
                    <option value="Orthopedics">🦴 Orthopedics</option>
                    <option value="Pediatrics">👶 Pediatrics</option>
                    <option value="Dermatology">🧴 Dermatology</option>
                    <option value="General Medicine">🏥 General Medicine</option>
                    <option value="Gynecology">👩 Gynecology</option>
                    <option value="Ophthalmology">👁️ Ophthalmology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor *</label>
                  <select
                    value={appointmentData.doctorId}
                    onChange={handleDoctorChange}
                    disabled={!appointmentData.department}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{appointmentData.department ? 'Select Doctor' : 'Select department first'}</option>
                    {filteredDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.image} {doctor.name} - {doctor.experience}
                      </option>
                    ))}
                  </select>
                  {filteredDoctors.length === 0 && appointmentData.department && (
                    <p className="text-xs text-orange-500 mt-1">No doctors available in this department</p>
                  )}
                </div>
              </div>

              {/* Right Column - Scheduling */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type *</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="New Visit"
                        checked={appointmentData.appointmentType === 'New Visit'}
                        onChange={(e) => setAppointmentData(prev => ({ ...prev, appointmentType: e.target.value }))}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span>🆕 New Visit</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="Follow-up"
                        checked={appointmentData.appointmentType === 'Follow-up'}
                        onChange={(e) => setAppointmentData(prev => ({ ...prev, appointmentType: e.target.value }))}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span>🔄 Follow-up</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    value={appointmentData.appointmentDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time Slot *</label>
                  <select
                    value={appointmentData.timeSlot}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, timeSlot: e.target.value }))}
                    disabled={!appointmentData.appointmentDate || availableSlots.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Time Slot</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {appointmentData.appointmentDate && availableSlots.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">No slots available for this date. Please select another date.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                  <textarea
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="2"
                    placeholder="Any specific requirements or notes..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Availability Info */}
          {filteredDoctors.length > 0 && appointmentData.department && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 animate-fadeIn">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span>👨‍⚕️</span> Available Doctors in {appointmentData.department}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredDoctors.map(doctor => (
                  <div key={doctor.id} className={`p-3 rounded-lg border ${appointmentData.doctorId === doctor.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                    <p className="font-medium">{doctor.image} {doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.experience} experience</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold hover:border-gray-400"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !patientData}
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 ${(isSubmitting || !patientData) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : (
                <>📅 Book Appointment</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AppointmentPanel;