import React, { useState, useEffect } from 'react';

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // name, mobile, aadhaar, id
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  // Mock data - This will be replaced with MongoDB Atlas fetch
  useEffect(() => {
    // Simulate fetching from database
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        // In production: const response = await fetch('/api/patients');
        // const data = await response.json();

        // Mock data from localStorage (where registration stores data)
        const storedPhotos = JSON.parse(localStorage.getItem('patient_photos_db') || '{}');

        const mockPatients = [
          {
            id: 'PAT001',
            fullName: 'Aarav Sharma',
            gender: 'Male',
            dob: '1990-05-15',
            age: 34,
            bloodGroup: 'O+',
            maritalStatus: 'Married',
            mobileNumber: '9876543210',
            alternateNumber: '9876543211',
            email: 'aarav.sharma@example.com',
            address: '123, Green Park, New Delhi',
            city: 'New Delhi',
            state: 'Delhi',
            pinCode: '110001',
            aadhaarNumber: '1234-5678-9012',
            govtIdType: 'PAN - ABCD1234E',
            guardianName: '',
            relation: '',
            emergencyPhone: '9999999999',
            photoPath: Object.keys(storedPhotos)[0] || null,
            registrationDate: '2024-01-15'
          },
          {
            id: 'PAT002',
            fullName: 'Priya Patel',
            gender: 'Female',
            dob: '1985-08-22',
            age: 39,
            bloodGroup: 'A+',
            maritalStatus: 'Married',
            mobileNumber: '9988776655',
            alternateNumber: '',
            email: 'priya.patel@example.com',
            address: '456, Lake View, Mumbai',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400001',
            aadhaarNumber: '2345-6789-0123',
            govtIdType: 'Voter ID - XYZ123456',
            guardianName: '',
            relation: '',
            emergencyPhone: '9876543210',
            photoPath: null,
            registrationDate: '2024-02-20'
          },
          {
            id: 'PAT003',
            fullName: 'Rahul Verma',
            gender: 'Male',
            dob: '2020-03-10',
            age: 4,
            bloodGroup: 'B+',
            maritalStatus: 'Single',
            mobileNumber: '8877665544',
            alternateNumber: '',
            email: '',
            address: '789, Civil Lines, Lucknow',
            city: 'Lucknow',
            state: 'Uttar Pradesh',
            pinCode: '226001',
            aadhaarNumber: '',
            govtIdType: 'Birth Certificate - BC123456',
            guardianName: 'Anjali Verma',
            relation: 'Mother',
            emergencyPhone: '9988776655',
            photoPath: null,
            registrationDate: '2024-03-05'
          }
        ];

        setPatients(mockPatients);
        setFilteredPatients(mockPatients);
      } catch (err) {
        setError('Failed to load patients');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = patients.filter(patient => {
      switch (searchType) {
        case 'name':
          return patient.fullName.toLowerCase().includes(term);
        case 'mobile':
          return patient.mobileNumber.includes(term);
        case 'aadhaar':
          return patient.aadhaarNumber.replace(/-/g, '').includes(term);
        case 'id':
          return patient.id.toLowerCase().includes(term);
        default:
          return patient.fullName.toLowerCase().includes(term);
      }
    });

    setFilteredPatients(filtered);
  }, [searchTerm, searchType, patients]);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedPatient(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredPatients, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `patients_export_${new Date().toISOString().slice(0, 19)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Get photo from stored data
  const getPatientPhoto = (patient) => {
    if (patient.photoPath) {
      return patient.photoPath;
    }
    const storedPhotos = JSON.parse(localStorage.getItem('patient_photos_db') || '{}');
    for (const [key, value] of Object.entries(storedPhotos)) {
      if (key.includes(patient.fullName.replace(/\s/g, '_'))) {
        return value;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-slideDown">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Patient Search
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-2"></div>
          </div>
          <p className="text-gray-600 mt-3 text-lg">Search and manage patient records</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl animate-slideUp">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="name">By Name</option>
                <option value="mobile">By Mobile Number</option>
                <option value="aadhaar">By Aadhaar Number</option>
                <option value="id">By Patient ID</option>
              </select>
            </div>
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search by ${searchType}...`}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full lg:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideUp">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Patients</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Search Results</p>
                <p className="text-3xl font-bold">{filteredPatients.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Male Patients</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.gender === 'Male').length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Female Patients</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.gender === 'Female').length}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-shake">
            <p>{error}</p>
          </div>
        )}

        {/* Patient Cards Grid */}
        {!isLoading && filteredPatients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  <div className="absolute -bottom-12 left-4">
                    {getPatientPhoto(patient) ? (
                      <img
                        src={getPatientPhoto(patient)}
                        alt={patient.fullName}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white bg-opacity-90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      ID: {patient.id}
                    </span>
                  </div>
                </div>

                <div className="pt-14 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{patient.fullName}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-500">{patient.age} years</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-sm text-gray-500">{patient.gender}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-sm font-semibold text-blue-600">{patient.bloodGroup}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      {patient.mobileNumber}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      {patient.email || 'No email provided'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {patient.city}, {patient.state}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(patient)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredPatients.length === 0 && searchTerm && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fadeIn">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No patients found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Patient Details Modal */}
        {showDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={handleCloseDetails}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform animate-scaleUp" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Patient Details</h2>
                <button onClick={handleCloseDetails} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
              </div>

              <div className="p-6">
                {/* Photo and Basic Info */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b">
                  <div className="flex-shrink-0">
                    {getPatientPhoto(selectedPatient) ? (
                      <img
                        src={getPatientPhoto(selectedPatient)}
                        alt={selectedPatient.fullName}
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center border-4 border-blue-500">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800">{selectedPatient.fullName}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">ID: {selectedPatient.id}</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Age: {selectedPatient.age} years</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Blood: {selectedPatient.bloodGroup}</span>
                    </div>
                    <p className="text-gray-600 mt-3">Registered on: {new Date(selectedPatient.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                      Personal Information
                    </h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Gender:</span> <span className="font-medium">{selectedPatient.gender}</span></p>
                      <p><span className="text-gray-600">Date of Birth:</span> <span className="font-medium">{new Date(selectedPatient.dob).toLocaleDateString()}</span></p>
                      <p><span className="text-gray-600">Marital Status:</span> <span className="font-medium">{selectedPatient.maritalStatus}</span></p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Mobile:</span> <span className="font-medium">{selectedPatient.mobileNumber}</span></p>
                      {selectedPatient.alternateNumber && <p><span className="text-gray-600">Alternate:</span> <span className="font-medium">{selectedPatient.alternateNumber}</span></p>}
                      {selectedPatient.email && <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedPatient.email}</span></p>}
                      <p><span className="text-gray-600">Address:</span> <span className="font-medium">{selectedPatient.address}, {selectedPatient.city}, {selectedPatient.state} - {selectedPatient.pinCode}</span></p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                      Identity Details
                    </h4>
                    <div className="space-y-2">
                      {selectedPatient.aadhaarNumber && <p><span className="text-gray-600">Aadhaar:</span> <span className="font-medium">{selectedPatient.aadhaarNumber}</span></p>}
                      {selectedPatient.govtIdType && <p><span className="text-gray-600">Govt ID:</span> <span className="font-medium">{selectedPatient.govtIdType}</span></p>}
                    </div>
                  </div>

                  {(selectedPatient.guardianName || selectedPatient.relation || selectedPatient.emergencyPhone) && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                        Emergency Contact
                      </h4>
                      <div className="space-y-2">
                        {selectedPatient.guardianName && <p><span className="text-gray-600">Guardian:</span> <span className="font-medium">{selectedPatient.guardianName}</span></p>}
                        {selectedPatient.relation && <p><span className="text-gray-600">Relation:</span> <span className="font-medium">{selectedPatient.relation}</span></p>}
                        {selectedPatient.emergencyPhone && <p><span className="text-gray-600">Emergency Phone:</span> <span className="font-medium">{selectedPatient.emergencyPhone}</span></p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
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

export default PatientSearch;