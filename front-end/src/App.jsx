import {useState, useEffect} from 'react'
import { Form } from './components/Form'
import { Header } from './components/Header'
import { PatientsList } from './components/PatientsList'

function App() {
  const [patients, setPatients] = useState([])
  const [patientToEdit, setPatientToEdit] = useState(null);
  
  // Function to delete a patient from the list
  const deletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  // Fetch patients from the backend API when the component mounts
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:5000/patients');
      const data = await response.json();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  return (
    <div className='container-fluid w-full mx-auto my-10 md:px-0 pb-4 overflow-x-hidden'>
      <Header />
      <div className='w-full my-10 md:flex'>
        <Form setPatients={setPatients} patientToEdit={patientToEdit} setPatientToEdit={setPatientToEdit} />
        <PatientsList patients={patients} setPatientToEdit={setPatientToEdit} deletePatient={deletePatient} />
      </div>
    </div>
  )
}

export default App
