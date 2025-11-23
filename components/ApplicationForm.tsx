// components/ApplicationForm.tsx

"use client";

import { useState } from 'react';

// Define the full combined state interface
interface FormData {
  // Common / Personal
  fullName: string;
  email: string;
  phoneNumber: string;
  school: string;
  birthDate: string;
  nationalId: string;
  gender: string;
  grade: string;
  city: string;
  accomodation: string;
  dietaryPreferences: string;
  additionalInfo: string;
  
  // Specific
  motivationLetter: string;
  experience: string;
  englishLevel: string; // Delegate
  committeePreferences: string[]; // Delegate
  camera: string; // Press
  
  // Delegation Specific (Main Contact)
  numberOfDelegates: number;
}

const initialFormState: FormData = {
  fullName: '',
  birthDate: '',
  phoneNumber: '',
  email: '',
  nationalId: '',
  gender: '',
  school: '',
  grade: '',
  city: '',
  accomodation: '',
  motivationLetter: '',
  experience: '',
  committeePreferences: ['', '', ''],
  additionalInfo: '',
  englishLevel: '',
  dietaryPreferences: '',
  camera: '',
  numberOfDelegates: 8
};

interface DelegateMember {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  gender: string;
  grade: string;
  city: string;
  accomodation: string;
  motivationLetter: string;
  experience: string;
  committeePreferences: string[];
  additionalInfo: string;
  englishLevel: string;
  dietaryPreferences: string;
}

const ApplicationForm = ({ applicationType }: { applicationType: string }) => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [delegates, setDelegates] = useState<DelegateMember[]>([]);
  const [formsGenerated, setFormsGenerated] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfDelegates' ? parseInt(value) || 0 : value
    }));
  };

  const handleCommitteeChange = (index: number, value: string) => {
    const newPreferences = [...formData.committeePreferences];
    newPreferences[index] = value;
    setFormData(prev => ({ ...prev, committeePreferences: newPreferences }));
  };

  const handleGenerateForms = () => {
    if (formData.numberOfDelegates < 8) {
      setMessage({ text: 'Minimum number of delegates is 8', isError: true });
      return;
    }
    // Generate full form objects for each delegate
    setDelegates(Array(formData.numberOfDelegates).fill({
       fullName: '', birthDate: '', phoneNumber: '', email: '', nationalId: '',
       gender: '', grade: '', city: '', accomodation: '', motivationLetter: '',
       experience: '', committeePreferences: ['', '', ''], additionalInfo: '',
       englishLevel: '', dietaryPreferences: ''
    }));
    setFormsGenerated(true);
    setMessage({ text: '', isError: false });
  };

  const handleDelegateMemberChange = (index: number, field: string, value: string) => {
    const newDelegates = [...delegates];
    newDelegates[index] = { ...newDelegates[index], [field]: value };
    setDelegates(newDelegates);
  };

  const handleMemberCommitteeChange = (delegateIndex: number, prefIndex: number, value: string) => {
    const newDelegates = [...delegates];
    const newPrefs = [...newDelegates[delegateIndex].committeePreferences];
    newPrefs[prefIndex] = value;
    newDelegates[delegateIndex] = { ...newDelegates[delegateIndex], committeePreferences: newPrefs };
    setDelegates(newDelegates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });

    // For delegation, we primarily use School Name as the identifier in the first step
    const name = applicationType === 'delegation' ? formData.school : formData.fullName;
    
    // Payload for first step is minimal
    const body = {
      email: formData.email,
      name: name,
      lang: 'en'
    };

    try {
      const response = await fetch(`/api/apply/${applicationType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to submit');
      setMessage({ text: result.message, isError: false });
      setVerificationModalOpen(true);
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Error', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construct full payload based on type
    let verificationBody: any = { code: verificationCode, lang: 'en', ...formData };
    
    if(applicationType === 'delegation') {
        verificationBody = {
            school: formData.school,
            email: formData.email, // Advisor/Contact Email
            numberOfDelegates: formData.numberOfDelegates,
            delegates: delegates, // Send the full array of delegates
            code: verificationCode,
            lang: 'en'
        };
    }

    try {
      const response = await fetch(`/api/verify/${applicationType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationBody)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed');
      window.location.href = '/success';
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Error', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renders ---
  
  const titleMap: Record<string, string> = {
    delegate: "Delegate Application",
    press: "Press Application",
    pr: "Public Relations Application",
    admin: "Admin Application",
    delegation: "Delegation Application"
  };

  const commonFields = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-white text-sm font-medium mb-2">
             {applicationType === 'delegation' ? 'School Name *' : 'Full Name *'}
           </label>
           <input type="text" name={applicationType === 'delegation' ? 'school' : 'fullName'} value={applicationType === 'delegation' ? formData.school : formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
        </div>
        
        {applicationType !== 'delegation' && (
            <>
                <div><label className="block text-white text-sm font-medium mb-2">Birth Date *</label><input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>
                <div><label className="block text-white text-sm font-medium mb-2">Phone Number *</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>
            </>
        )}

        <div><label className="block text-white text-sm font-medium mb-2">{applicationType === 'delegation' ? 'Contact Email *' : 'Email Address *'}</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>

        {applicationType !== 'delegation' && (
            <>
                <div><label className="block text-white text-sm font-medium mb-2">National ID *</label><input type="text" name="nationalId" value={formData.nationalId} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div><label className="block text-white text-sm font-medium mb-2">School Name *</label><input type="text" name="school" value={formData.school} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Grade/Level *</label>
                    <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required>
                         <option value="">Select grade</option>
                         <option value="9th Grade">9th Grade</option>
                         <option value="10th Grade">10th Grade</option>
                         <option value="11th Grade">11th Grade</option>
                         <option value="12th Grade">12th Grade</option>
                         <option value="Graduate">Graduate</option>
                    </select>
                </div>
                <div><label className="block text-white text-sm font-medium mb-2">City *</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required /></div>
            </>
        )}
    </div>
  );

  const detailFields = (
     <div className="space-y-6">
        <div><label className="block text-white text-sm font-medium mb-2">Motivation Letter *</label><textarea name="motivationLetter" value={formData.motivationLetter} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none" required /></div>
        <div><label className="block text-white text-sm font-medium mb-2">Experience</label><textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none" /></div>

        {applicationType === 'delegate' && (
            <>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Committee Preferences (Top 3) *</label>
                    <div className="space-y-3">
                         {[0,1,2].map(idx => (
                             <select key={idx} value={formData.committeePreferences[idx]} onChange={(e) => handleCommitteeChange(idx, e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required={idx === 0}>
                                 <option value="">{idx + 1}. Choice</option>
                                 <option value="UNICEF">UNICEF</option>
                                 <option value="UNODC">UNODC</option>
                                 <option value="TDT">TDT</option>
                                 <option value="CERN">CERN</option>
                                 <option value="H-UNSC">H-UNSC</option>
                             </select>
                         ))}
                    </div>
                </div>
                <div>
                    <label className="block text-white text-sm font-medium mb-2">English Level *</label>
                    <select name="englishLevel" value={formData.englishLevel} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required>
                         <option value="">Select Level</option>
                         <option value="Beginner">Beginner</option>
                         <option value="Intermediate">Intermediate</option>
                         <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </>
        )}

        {applicationType === 'press' && (
             <div><label className="block text-white text-sm font-medium mb-2">Camera Model</label><input name="camera" value={formData.camera} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" /></div>
        )}

        <div>
            <label className="block text-white text-sm font-medium mb-2">Accommodation Needed? *</label>
            <select name="accomodation" value={formData.accomodation} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required>
                 <option value="">Select</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
            </select>
        </div>

        <div>
             <label className="block text-white text-sm font-medium mb-2">Dietary Preferences</label>
             <select name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                 <option value="">None</option>
                 <option value="Vegetarian">Vegetarian</option>
                 <option value="Vegan">Vegan</option>
                 <option value="Halal">Halal</option>
                 <option value="Kosher">Kosher</option>
             </select>
        </div>

        <div><label className="block text-white text-sm font-medium mb-2">Additional Info</label><textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none" /></div>
     </div>
  );

  return (
    <div className="min-h-screen px-4 my-14 max-sm:my-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl max-sm:text-3xl mt-16 mb-16 max-sm:mt-8 text-center text-[hsl(42,72%,52%)] font-bold">
            {titleMap[applicationType]}
          </h1>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-[hsl(42,72%,52%)]">
              {applicationType === 'delegation' ? 'Delegation Information' : 'Personal Information'}
            </h2>
            {commonFields}

            {applicationType === 'delegation' && (
                <div className="mt-6">
                    <label className="block text-white text-sm font-medium mb-2">Number of Delegates * (Min 8)</label>
                    <input type="number" name="numberOfDelegates" value={formData.numberOfDelegates} onChange={handleInputChange} min="8" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
                    <button type="button" onClick={handleGenerateForms} className="mt-4 px-6 py-3 bg-[hsl(42,72%,52%)] text-[#0A1938] font-bold rounded-lg hover:bg-white transition-colors cursor-pointer">
                        Generate Forms
                    </button>
                </div>
            )}
          </div>

          {applicationType !== 'delegation' && (
              <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-[hsl(42,72%,52%)]">Application Details</h2>
                {detailFields}
              </div>
          )}

          {applicationType === 'delegation' && formsGenerated && (
              <div className="space-y-8">
                  {delegates.map((d, i) => (
                      <div key={i} className="bg-gray-800 rounded-xl p-8 shadow-xl border-l-4 border-[hsl(42,72%,52%)]">
                           <h3 className="text-xl font-bold text-white mb-6">Delegate #{i + 1}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input placeholder="Full Name" value={d.fullName} onChange={e => handleDelegateMemberChange(i, 'fullName', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                <input placeholder="Email" type="email" value={d.email} onChange={e => handleDelegateMemberChange(i, 'email', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                <input placeholder="Phone" type="tel" value={d.phoneNumber} onChange={e => handleDelegateMemberChange(i, 'phoneNumber', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                <input placeholder="National ID" value={d.nationalId} onChange={e => handleDelegateMemberChange(i, 'nationalId', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                <input placeholder="Birth Date" type="date" value={d.birthDate} onChange={e => handleDelegateMemberChange(i, 'birthDate', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                
                                <select value={d.gender} onChange={e => handleDelegateMemberChange(i, 'gender', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required>
                                    <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>
                                </select>
                                <select value={d.grade} onChange={e => handleDelegateMemberChange(i, 'grade', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required>
                                    <option value="">Select Grade</option><option value="9th Grade">9th Grade</option><option value="10th Grade">10th Grade</option><option value="11th Grade">11th Grade</option><option value="12th Grade">12th Grade</option>
                                </select>
                                <input placeholder="City" value={d.city} onChange={e => handleDelegateMemberChange(i, 'city', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required />
                                
                                <select value={d.accomodation} onChange={e => handleDelegateMemberChange(i, 'accomodation', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required>
                                    <option value="">Accommodation?</option><option value="Yes">Yes</option><option value="No">No</option>
                                </select>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-white text-sm">Committee Preferences</label>
                                    {[0,1,2].map(idx => (
                                        <select key={idx} value={d.committeePreferences[idx]} onChange={e => handleMemberCommitteeChange(i, idx, e.target.value)} className="w-full bg-gray-700 p-3 rounded text-white" required={idx === 0}>
                                            <option value="">{idx + 1}. Choice</option><option value="UNICEF">UNICEF</option><option value="UNODC">UNODC</option><option value="TDT">TDT</option><option value="CERN">CERN</option><option value="H-UNSC">H-UNSC</option>
                                        </select>
                                    ))}
                                </div>
                                <select value={d.englishLevel} onChange={e => handleDelegateMemberChange(i, 'englishLevel', e.target.value)} className="bg-gray-700 p-3 rounded text-white" required>
                                    <option value="">English Level</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                                </select>
                                <select value={d.dietaryPreferences} onChange={e => handleDelegateMemberChange(i, 'dietaryPreferences', e.target.value)} className="bg-gray-700 p-3 rounded text-white">
                                    <option value="">Dietary Prefs</option><option value="Vegetarian">Vegetarian</option><option value="Vegan">Vegan</option>
                                </select>

                                <textarea placeholder="Experience" value={d.experience} onChange={e => handleDelegateMemberChange(i, 'experience', e.target.value)} className="md:col-span-2 bg-gray-700 p-3 rounded text-white resize-none" rows={3} />
                                <textarea placeholder="Motivation Letter *" value={d.motivationLetter} onChange={e => handleDelegateMemberChange(i, 'motivationLetter', e.target.value)} className="md:col-span-2 bg-gray-700 p-3 rounded text-white resize-none" rows={4} required />
                           </div>
                      </div>
                  ))}
              </div>
          )}

          {(applicationType !== 'delegation' || formsGenerated) && (
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group glassmorphism text-xl max-sm:text-base cursor-pointer items-center transition-all duration-300 justify-center gap-4 max-sm:gap-2 inline-flex backdrop-blur-md rounded-full px-8 py-4 max-sm:px-6 max-sm:py-3 shadow-lg ${isSubmitting ? 'opacity-50' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <svg
                    width="24"
                    height="19"
                    viewBox="0 0 24 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:translate-x-2 max-sm:w-[15px]"
                  >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.7105 0.439344C14.1953 1.02511 14.1953 1.97487 14.7105 2.56064L19.4951 7.99997H1.56946C0.840735 7.99997 0.25 8.67155 0.25 9.49997C0.25 10.3284 0.840735 11 1.56946 11H19.4951L14.7105 16.4392C14.1953 17.0251 14.1953 17.9749 14.7105 18.5606C15.2258 19.1465 16.0614 19.1465 16.5765 18.5606L23.6136 10.5606C24.1288 9.97473 24.1288 9.02509 23.6136 8.43932L16.5765 0.439344C16.0614 -0.146448 15.2258 -0.146448 14.7105 0.439344Z"
                        className="fill-white group-hover:fill-[hsl(42,72%,52%)] transition-colors duration-300"
                    />
                  </svg>
                </button>
              </div>
          )}
        </form>

        {verificationModalOpen && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
             <div className="bg-[#0B1A39] border border-[hsl(42,72%,52%)] p-8 rounded-2xl max-w-md w-full">
               <h2 className="text-2xl font-bold mb-4 text-[hsl(42,72%,52%)]">Verify Email</h2>
               <p className="mb-4 text-white">Code sent to {formData.email}</p>
               <form onSubmit={handleVerify}>
                 <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4" placeholder="Enter code" required />
                 <button type="submit" className="w-full px-4 py-3 cursor-pointer bg-[hsl(42,72%,52%)] text-[#0A1938] font-bold rounded-lg hover:bg-white transition-colors">Verify</button>
               </form>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;