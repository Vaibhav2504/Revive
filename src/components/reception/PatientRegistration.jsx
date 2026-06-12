import React, { useState, useRef, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const PatientRegistration = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    maritalStatus: '',
    mobileNumber: '',
    alternateNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    aadhaarNumber: '',
    govtIdType: '',
    guardianName: '',
    relation: '',
    emergencyPhone: ''
  });

  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Camera refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Handle input changes with animation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge > 0 ? calculatedAge : 0);
    } else {
      setAge(0);
    }
  }, [formData.dob]);

  // Open camera with better preview
  const openCamera = async () => {
    setCameraError('');
    setIsCameraOpen(true);

    try {
      // Request with ideal constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        await videoRef.current.play();
      }
    } catch (err) {
      setCameraError('Unable to access camera. Please check permissions.');
      console.error(err);
      setIsCameraOpen(false);
    }
  };

  // Capture photo with visible preview
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Create a preview immediately
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoPreview(imageDataUrl);

      // Convert to blob/file
      canvas.toBlob(async (blob) => {
        const patientName = formData.fullName || 'unknown_patient';
        const fileName = await savePhotoToFileSystem(blob, patientName);

        // Create a File object for state
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        setPhoto(file);

        // Show success feedback
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 'image/jpeg', 0.8);

      closeCamera();
    }
  };

  // Close camera and cleanup
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields list
    const requiredFields = [
      { key: 'fullName', label: 'Full Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'mobileNumber', label: 'Mobile Number' },
      { key: 'address', label: 'Address' },
      { key: 'email', label: 'Email' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'pinCode', label: 'PIN Code' },
      { key: 'photo', label: 'Patient Photo' },
    ];

    // Aadhaar mandatory only if age >= 1
    if (age >= 1) {
      requiredFields.push({
        key: 'aadhaarNumber',
        label: 'Aadhaar Number'
      });
    }

    // Check empty fields
    for (const field of requiredFields) {
      if (!formData[field.key]?.trim()) {
        alert(`Please fill ${field.label}`);
        return;
      }
    }

    // Aadhaar validation
    if (age >= 1 && formData.aadhaarNumber.length !== 12) {
      alert('Aadhaar number must be exactly 12 digits');
      return;
    }

    // Mobile validation
    if (formData.mobileNumber.length !== 10) {
      alert('Mobile number must be exactly 10 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Patient Registered:', {
        ...formData,
        age,
        photo: photo ? photo.name : 'No photo'
      });

      alert(`✅ Patient ${formData.fullName} registered successfully!`);

    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Reset form
  const handleReset = () => {
    setFormData({
      fullName: '', gender: '', dob: '', bloodGroup: '', maritalStatus: '',
      mobileNumber: '', alternateNumber: '', email: '', address: '', city: '',
      state: '', pinCode: '', aadhaarNumber: '', govtIdType: '',
      guardianName: '', relation: '', emergencyPhone: ''
    });
    setPhoto(null);
    setPhotoPreview(null);
    setAge('');
  };

  // Input classes with animations
  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-blue-300";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200 group-focus-within:text-blue-600";
  const sectionClass = "bg-white rounded-2xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl border border-gray-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#007979] via-[#FFF0E4] to-[#24B1B1] p-4 md:p-8 animate-fadeIn rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header with animation */}
        <div className="mb-8 text-center animate-slideDown">
          <div className="inline-block">
            <h1 className="text-5xl md:text-5xl leading-normal font-bold bg-gradient-to-r from-[#0D530E] to-[#306D29] bg-clip-text text-transparent">
              Patient Registration
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-[#121358] to-[#232F72] rounded-full mx-auto mt-2"></div>
          </div>
          <p className="text-gray-600 mt-3 text-lg">Complete medical records with photo capture</p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 animate-slideInRight">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Photo captured & saved!
            </div>
          </div>
        )}

        {/* Camera Modal with improved preview */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 transform animate-scaleUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">📸 Capture Patient Photo</h3>
                <button
                  onClick={closeCamera}
                  className="text-gray-400 hover:text-gray-600 text-3xl transition-colors duration-200 hover:rotate-90 transform"
                >
                  &times;
                </button>
              </div>

              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black bg-opacity-50 py-1 text-sm">
                  Position patient in frame
                </div>
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {cameraError && (
                <p className="text-red-500 mt-3 text-sm text-center">{cameraError}</p>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold shadow-md"
                >
                  📷 Capture Photo
                </button>
                <button
                  onClick={closeCamera}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-slideUp">
          {/* Basic Details & Personal Info */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              Basic & Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="group">
                <label className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required placeholder="Enter full name" />
              </div>
              <div className="group">
                <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="group">
                <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                <DatePicker
                  selected={formData.dob ? new Date(formData.dob) : null}
                  onChange={(date) => {
                    setFormData(prev => ({
                      ...prev,
                      dob: date.toISOString().split('T')[0]
                    }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Select date of birth"
                  className={inputClass}
                />
              </div>
              <div className="group">
                <label className={labelClass}>Age</label>
                <input type="text" value={age ? `${age} years` : ''} readOnly className={`${inputClass} bg-gray-50 text-gray-600 font-medium`} placeholder="Auto from DOB" />
              </div>
              <div className="group">
                <label className={labelClass}>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                  <option value="">Select blood group</option>
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                </select>
              </div>
              <div className="group">
                <label className={labelClass}>Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                  <option value="">Select status</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className={labelClass}>Patient Photo <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Patient" className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-md animate-scaleIn" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-gray-400">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={openCamera}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-md"
                  >
                    📷 Open Camera
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div><label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label><input type="tel" name="mobileNumber" maxLength={10} pattern='[0-9]{10}' value={formData.mobileNumber} onChange={handleChange} className={inputClass} placeholder="10-digit number" /></div>
              <div><label className={labelClass}>Alternate Number</label><input type="tel" name="alternateNumber" value={formData.alternateNumber} onChange={handleChange} className={inputClass} placeholder="Optional" /></div>
              <div><label className={labelClass}>Email <span className="text-red-500">*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="patient@example.com" /></div>
              <div className="md:col-span-3"><label className={labelClass}>Address <span className="text-red-500">*</span></label><input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="Street address" /></div>
              <div><label className={labelClass}>City <span className="text-red-500">*</span></label><input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="City name" /></div>
              <div><label className={labelClass}>State <span className="text-red-500">*</span></label><input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="State name" /></div>
              <div><label className={labelClass}>PIN Code <span className="text-red-500">*</span></label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputClass} placeholder="Postal code" /></div>
            </div>
          </div>

          {/* Identity Details */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Identity Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>
                  Aadhaar Number {age >= 1 && <span className="text-red-500">*</span>}
                </label>

                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');

                    if (value.length <= 12) {
                      setFormData(prev => ({
                        ...prev,
                        aadhaarNumber: value
                      }));
                    }
                  }}
                  className={inputClass}
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  required={age >= 1}
                />

                {formData.aadhaarNumber &&
                  formData.aadhaarNumber.length !== 12 &&
                  age >= 1 && (
                    <p className="text-red-500 text-sm mt-1">
                      Aadhaar number must be exactly 12 digits
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className={sectionClass}>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-5 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-500 rounded-full"></span>
              Emergency Contact <span className="text-sm font-normal text-gray-500 ml-2">(Optional for children with guardians)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className={labelClass}>Guardian Name</label><input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className={inputClass} placeholder="Full name" /></div>
              <div><label className={labelClass}>Relation</label><input type="text" name="relation" value={formData.relation} onChange={handleChange} className={inputClass} placeholder="Father, Mother, etc." /></div>
              <div><label className={labelClass}>Emergency Phone Number</label><input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} className={inputClass} placeholder="Contact number" /></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6 animate-slideUp">
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold hover:border-gray-400"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-gradient-to-r from-[#0D530E] to-[#306D29] text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>Register Patient</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add custom CSS for animations */}
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
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default PatientRegistration;