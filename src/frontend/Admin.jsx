import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    User,
    Lock,
    Calendar,
    Tag,
    AlertCircle,
    Shield,
    CheckCircle,
    Sparkles,
    RefreshCw,
    Save,
    Send,
    Eye,
    EyeOff,
    Search,
    X
} from 'lucide-react';

// Separate component for input field to handle updates properly
const FormInput = ({ label, name, value, onChange, type = "text", icon: Icon, required = true, placeholder = "", error }) => {
    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-indigo-300'
                        }`}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 animate-slideDown">
                    <AlertCircle className="h-3 w-3" /> {error}
                </p>
            )}
        </div>
    );
};

// Select field component
const FormSelect = ({ label, name, value, onChange, icon: Icon, options, required = true, error }) => {
    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                )}
                <select
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-indigo-300'
                        }`}
                >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {error}
                </p>
            )}
        </div>
    );
};

// Main component
const AdminHospitalRegistration = () => {
    const [formData, setFormData] = useState({
        hospitalId: '',
        hospitalName: '',
        hospitalCode: '',
        hospitalEmail: '',
        hospitalPhone: '',
        address: '',
        adminName: '',
        adminEmail: '',
        adminPhone: '',
        password: '',
        mustChangePassword: '',
        subscriptionPlan: '',
        licenseExpiryDate: '',
        status: ''
    });

    const [generatedCredentials, setGeneratedCredentials] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [savedHospitals, setSavedHospitals] = useState([]);

    // Load saved hospitals from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('registeredHospitals');
        if (stored) {
            setSavedHospitals(JSON.parse(stored));
        }
    }, []);

    // Handle form field update - FIXED: This is the key fix
    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear error for this field if it exists
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: ''
            }));
        }
    };

    // Search hospitals
    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);

        if (searchValue.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const filtered = savedHospitals.filter(hospital =>
            hospital.hospitalName.toLowerCase().includes(searchValue.toLowerCase()) ||
            hospital.hospitalId.toLowerCase().includes(searchValue.toLowerCase()) ||
            hospital.hospitalCode.toLowerCase().includes(searchValue.toLowerCase()) ||
            hospital.adminName.toLowerCase().includes(searchValue.toLowerCase()) ||
            hospital.adminEmail.toLowerCase().includes(searchValue.toLowerCase())
        );

        setSearchResults(filtered);
        setShowSearchResults(true);
    };

    // Load selected hospital data into form
    const loadHospitalData = (hospital) => {
        setFormData({
            hospitalId: hospital.hospitalId,
            hospitalName: hospital.hospitalName,
            hospitalCode: hospital.hospitalCode,
            hospitalEmail: hospital.hospitalEmail,
            hospitalPhone: hospital.hospitalPhone,
            address: hospital.address,
            adminName: hospital.adminName,
            adminEmail: hospital.adminEmail,
            adminPhone: hospital.adminPhone,
            password: hospital.password,
            mustChangePassword: hospital.mustChangePassword,
            subscriptionPlan: hospital.subscriptionPlan,
            licenseExpiryDate: hospital.licenseExpiryDate,
            status: hospital.status
        });

        setGeneratedCredentials({
            hospitalId: hospital.hospitalId,
            password: hospital.password,
            mustChangePassword: hospital.mustChangePassword
        });

        setShowSearchResults(false);
        setSearchTerm('');

        setNotification({
            show: true,
            type: 'success',
            message: 'Hospital data loaded successfully!'
        });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        if (!formData.hospitalName?.trim()) newErrors.hospitalName = 'Hospital name is required';
        if (!formData.hospitalCode?.trim()) newErrors.hospitalCode = 'Hospital code is required';
        if (!formData.hospitalEmail?.trim()) newErrors.hospitalEmail = 'Hospital email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.hospitalEmail)) newErrors.hospitalEmail = 'Email is invalid';
        if (!formData.hospitalPhone?.trim()) newErrors.hospitalPhone = 'Hospital phone is required';
        if (!formData.adminName?.trim()) newErrors.adminName = 'Admin name is required';
        if (!formData.adminEmail?.trim()) newErrors.adminEmail = 'Admin email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) newErrors.adminEmail = 'Email is invalid';
        if (!formData.adminPhone?.trim()) newErrors.adminPhone = 'Admin phone is required';
        if (!formData.address?.trim()) newErrors.address = 'Address is required';
        if (!formData.subscriptionPlan) newErrors.subscriptionPlan = 'Subscription plan is required';
        if (!formData.licenseExpiryDate) newErrors.licenseExpiryDate = 'License expiry date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generate random ID and Password
    const generateCredentials = async () => {
        if (!validateForm()) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Please fill all required fields before generating credentials'
            });
            setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
            return;
        }

        setIsGenerating(true);

        // Simulate API call to backend
        setTimeout(() => {
            const randomId = 'HOS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            const randomPassword = Math.random().toString(36).substring(2, 10) +
                Math.random().toString(36).substring(2, 4) +
                '!@#' + Math.floor(Math.random() * 100);

            setGeneratedCredentials({
                hospitalId: randomId,
                password: randomPassword,
                mustChangePassword: true
            });

            setFormData(prev => ({
                ...prev,
                hospitalId: randomId,
                password: randomPassword,
                mustChangePassword: 'true'
            }));

            setIsGenerating(false);

            setNotification({
                show: true,
                type: 'success',
                message: 'Credentials generated successfully!'
            });
            setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
        }, 1500);
    };

    // Confirm and save to backend
    const confirmAndSave = async () => {
        if (!generatedCredentials) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Please generate credentials first'
            });
            setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
            return;
        }

        if (!validateForm()) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Please fix all validation errors'
            });
            setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
            return;
        }

        setIsSaving(true);

        // Prepare data for backend
        const hospitalData = {
            id: Date.now(),
            ...formData,
            savedAt: new Date().toISOString()
        };

        // Simulate API call to backend
        const confirmAndSave = async () => {
            if (!generatedCredentials) {
                return;
            }

            if (!validateForm()) {
                return;
            }

            setIsSaving(true);

            try {

                const hospitalData = {
                    ...formData
                };

                const response = await axios.post(
                    "http://localhost:5000/api/hospitals/register",
                    hospitalData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                console.log(response.data);

                setNotification({
                    show: true,
                    type: "success",
                    message: "Hospital registered successfully!"
                });

                resetForm();

            } catch (error) {

                setNotification({
                    show: true,
                    type: "error",
                    message:
                        error.response?.data?.message ||
                        "Failed to save hospital"
                });

            } finally {
                setIsSaving(false);
            }
        };
    };

    const resetForm = () => {
        setFormData({
            hospitalId: '',
            hospitalName: '',
            hospitalCode: '',
            hospitalEmail: '',
            hospitalPhone: '',
            address: '',
            adminName: '',
            adminEmail: '',
            adminPhone: '',
            password: '',
            mustChangePassword: '',
            subscriptionPlan: '',
            licenseExpiryDate: '',
            status: ''
        });
        setGeneratedCredentials(null);
        setErrors({});
        setSearchTerm('');
        setShowSearchResults(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg mb-4 transform transition-all duration-300 hover:scale-105">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                        Hospital Registration
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">Register new hospital and manage existing ones</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 animate-slideUp">
                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search hospital by name, ID, code, admin name or email..."
                                className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowSearchResults(false);
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && (
                            <div className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto animate-fadeIn">
                                {searchResults.length > 0 ? (
                                    <div>
                                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                                            <p className="text-sm text-gray-600">Found {searchResults.length} hospital(s)</p>
                                        </div>
                                        {searchResults.map((hospital) => (
                                            <button
                                                key={hospital.id}
                                                onClick={() => loadHospitalData(hospital)}
                                                className="w-full text-left p-4 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{hospital.hospitalName}</p>
                                                        <p className="text-sm text-gray-500">ID: {hospital.hospitalId}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${hospital.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            hospital.status === 'inactive' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {hospital.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p>Admin: {hospital.adminName} ({hospital.adminEmail})</p>
                                                    <p>Plan: {hospital.subscriptionPlan}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500">No hospitals found matching "{searchTerm}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notification */}
                {notification.show && (
                    <div className={`fixed top-20 right-4 z-50 max-w-md w-full animate-slideInRight ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white rounded-xl shadow-2xl p-4 flex items-center gap-3`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}
                        <p className="font-medium">{notification.message}</p>
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-slideUp">
                    {/* Form Sections */}
                    <div className="p-6 md:p-8">
                        {/* Hospital Information Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-indigo-100">
                                <Building2 className="h-6 w-6 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">Hospital Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Hospital Name"
                                    name="hospitalName"
                                    value={formData.hospitalName}
                                    onChange={handleFieldChange}
                                    icon={Building2}
                                    placeholder="e.g., City General Hospital"
                                    error={errors.hospitalName}
                                />
                                <FormInput
                                    label="Hospital Code"
                                    name="hospitalCode"
                                    value={formData.hospitalCode}
                                    onChange={handleFieldChange}
                                    icon={Tag}
                                    placeholder="e.g., CGH001"
                                    
                                    error={errors.hospitalCode}
                                />
                                <FormInput
                                    label="Hospital Email"
                                    name="hospitalEmail"
                                    type="email"
                                    value={formData.hospitalEmail}
                                    onChange={handleFieldChange}
                                    icon={Mail}
                                    placeholder="hospital@example.com"
                                    error={errors.hospitalEmail}
                                />
                                <FormInput
                                    label="Hospital Phone"
                                    name="hospitalPhone"
                                    type="tel"
                                    value={formData.hospitalPhone}
                                    onChange={handleFieldChange}
                                    icon={Phone}
                                    placeholder="+1 234 567 8900"
                                    error={errors.hospitalPhone}
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFieldChange}
                                        icon={MapPin}
                                        placeholder="Full hospital address"
                                        error={errors.address}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Admin Information Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-indigo-100">
                                <User className="h-6 w-6 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">Administrator Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Admin Name"
                                    name="adminName"
                                    value={formData.adminName}
                                    onChange={handleFieldChange}
                                    icon={User}
                                    placeholder="Full name"
                                    error={errors.adminName}
                                />
                                <FormInput
                                    label="Admin Email"
                                    name="adminEmail"
                                    type="email"
                                    value={formData.adminEmail}
                                    onChange={handleFieldChange}
                                    icon={Mail}
                                    placeholder="admin@example.com"
                                    error={errors.adminEmail}
                                />
                                <FormInput
                                    label="Admin Phone"
                                    name="adminPhone"
                                    type="tel"
                                    value={formData.adminPhone}
                                    onChange={handleFieldChange}
                                    icon={Phone}
                                    placeholder="+91 1234567890"
                                    error={errors.adminPhone}
                                />
                            </div>
                        </div>

                        {/* Subscription & Settings Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-indigo-100">
                                <Shield className="h-6 w-6 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">Subscription & Settings</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormSelect
                                    label="Subscription Plan"
                                    name="subscriptionPlan"
                                    value={formData.subscriptionPlan}
                                    onChange={handleFieldChange}
                                    icon={Tag}
                                    options={[
                                        { value: 'basic', label: 'Basic Plan' },
                                        { value: 'professional', label: 'Professional Plan' },
                                        { value: 'enterprise', label: 'Enterprise Plan' }
                                    ]}
                                    error={errors.subscriptionPlan}
                                />
                                <FormInput
                                    label="License Expiry Date"
                                    name="licenseExpiryDate"
                                    type="date"
                                    value={formData.licenseExpiryDate}
                                    onChange={handleFieldChange}
                                    icon={Calendar}
                                    error={errors.licenseExpiryDate}
                                />
                                <FormSelect
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFieldChange}
                                    icon={AlertCircle}
                                    required={false}
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                        { value: 'suspended', label: 'Suspended' },
                                        { value: 'pending', label: 'Pending' }
                                    ]}
                                    error={errors.status}
                                />
                            </div>
                        </div>

                        {/* Credentials Section */}
                        {generatedCredentials && (
                            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 animate-fadeIn">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lock className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-lg font-bold text-gray-800">Generated Credentials</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl">
                                        <span className="text-sm font-medium text-gray-600">Hospital ID:</span>
                                        <code className="text-indigo-700 font-mono font-semibold text-sm break-all">{generatedCredentials.hospitalId}</code>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl">
                                        <span className="text-sm font-medium text-gray-600">Temporary Password:</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-indigo-700 font-mono font-semibold text-sm break-all">
                                                {showPassword ? generatedCredentials.password : '•'.repeat(20)}
                                            </code>
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-xs text-yellow-700">User will be prompted to change password on first login</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-100">
                            <button
                                onClick={generateCredentials}
                                disabled={isGenerating}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${isGenerating
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Generate Credentials
                                    </>
                                )}
                            </button>
                            <button
                                onClick={confirmAndSave}
                                disabled={isSaving || !generatedCredentials}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${isSaving || !generatedCredentials
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <Save className="h-5 w-5 animate-pulse" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Confirm & Save
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.4s ease-out; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
        </div>
    );
};

export default AdminHospitalRegistration;