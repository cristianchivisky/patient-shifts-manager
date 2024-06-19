import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';

export const Form = ({patients, setPatients, patientToEdit, setPatientToEdit}) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [error, setError] = useState(false)

  // useEffect to populate the form fields when a patient is being edited
  useEffect(() => {
    if (patientToEdit) {
      setName(patientToEdit.name);
      setLastName(patientToEdit.lastName);
      setPhone(patientToEdit.phone);
      setDate(patientToEdit.date);
      setSymptoms(patientToEdit.symptoms);
    }
  }, [patientToEdit]);

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (name === '' || lastName === '' || phone === '' || date === '' || symptoms === '') {
    setError(true);
    return;
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  const phoneRegex = /^\d+$/;
  if (!nameRegex.test(name) || !nameRegex.test(lastName) || !phoneRegex.test(phone)) {
    setError(true);
    return;
  }
    setError(false);
    const newPatient = { name, lastName, phone, date, symptoms };
    //console.log(newPatient)
    if (patientToEdit) {
      // Update existing patient
      try {
        const response = await fetch(`http://localhost:5000/update_patient/${patientToEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPatient),
        });
        const data = await response.json();
        setPatients(prev => prev.map(p => (p.id === data.id ? data : p)));
        setPatientToEdit(null);
        Swal.fire('Good Job!', 'Patient Updated Successfully!', 'success');
      } catch (error) {
        console.error('Error updating patient:', error);
        Swal.fire('Error!', 'There was an issue updating the patient.', 'error');
      }
    } else {
      // Add new patient
      try {
        const response = await fetch('http://localhost:5000/add_patient', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPatient),
        });
        const data = await response.json();
        setPatients(prev => [...prev, data.patient]);
        Swal.fire('Good Job!', 'Patient Added Successfully!', 'success');
      } catch (error) {
        console.error('Error adding patient:', error);
        Swal.fire('Error!', 'There was an issue adding the patient.', 'error');
      }
    }

    // Clear the form
    setName('');
    setLastName('');
    setPhone('');
    setDate('');
    setSymptoms('');
  };
  
  return (
    <div className='container-fluid md:w-1/2 lg:w-2/5 md:ml-2 px-2 md:px-0'>
      <h2 className="font-black text-3xl text-center">{patientToEdit ? 'Edit Patient' : 'Patient Follow'}</h2>
      <p className="text-lg mt-2 text-center mb-10">
      {patientToEdit ? 'Update Patient Details and ' : 'Add Patient and '}
      <span className="text-indigo-600 font-bold">{patientToEdit ? 'Save Changes' : 'Manage it'}</span>
      </p>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg py-10 px-5">
        {error  && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 mb-5 rounded relative" role="alert">
            All Fields Are Mandatory and Must be Valid
          </p>
        )}
        <div className="mb-5">
          <label className="block text-gray-700 uppercase font-bold">Patient Name:</label>
          <input
            className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            type="text"
            placeholder="Patient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 uppercase font-bold">Patient Last Name:</label>
          <input
            className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            type="text"
            placeholder="Patient Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 uppercase font-bold">Patient Phone:</label>
          <input
            className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            type="text"
            placeholder="Patient Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 uppercase font-bold">Date:</label>
          <input
            className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            />
        </div>
        <div className="mb-5" >
          <label className="block text-gray-700 uppercase font-bold">Symptoms:</label>
          <textarea
            className=" border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            type="text"
            placeholder="Symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            />
        </div>
        <button
          type='submit'
          className="bg-indigo-600 w-full p-3 uppercase text-white font-bold hover:bg-indigo-700 rounded-md">
          {patientToEdit ? 'Update Patient' : 'Add Patient'}
        </button>
      </form>
    </div>
  )
}