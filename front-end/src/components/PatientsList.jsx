import Swal from 'sweetalert2';

export const PatientsList = ({patients, setPatientToEdit, deletePatient}) => {
  // Handle patient deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete_patient/${id}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (response.ok) {
        deletePatient(id);
        Swal.fire('Deleted!', responseData.message, 'success');
      } else {
        console.error('Response error:', responseData);
        Swal.fire('Error!', responseData.error || 'There was an issue deleting the patient.', 'error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Swal.fire('Error!', 'There was an issue deleting the patient.', 'error');
    }
  };
  //console.log('pacientes:: ', patients)
  return (        
    <div className='w-full md:w-1/2 lg:w-3/5 md:mt-0 mt-10 px-2  md:ml-1'>
      <h2 className="font-black text-3xl text-center">Patients List</h2>
      <p className="text-lg mt-2 text-center mb-10">
        Shifts granted by the{' '} 
        <span className="text-indigo-600 font-bold">Doctor</span>
      </p>
      <div className="relative overflow-x-auto shadow-md rounded-lg mt-6 max-h-screen overflow-y-auto">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100">
              <thead className="text-xs text-white uppercase bg-indigo-600">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Last Name</th>
                  <th scope="col" className="px-6 py-3">Phone</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Symptoms</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={index} className="bg-blue-500 border-b border-blue-400">
                    <th className="px-2 py-4 font-medium text-blue-50 whitespace-nowrap">{patient.name}</th>
                    <td className="px-2 py-4 font-medium text-blue-50 whitespace-nowrap">{patient.lastName}</td>
                    <td className="px-2 py-4">{patient.phone}</td>
                    <td className="px-2 py-4 min-w-[88px]">{patient.date}</td>
                    <td className="px-2 py-4">{patient.symptoms}</td>
                    <td className="px-2 py-4">
                      <a href="#" onClick={() => setPatientToEdit(patient)} className="block font-medium text-white hover:underline mb-2">Update</a>
                      <a href="#" onClick={() => handleDelete(patient.id)} className="block font-medium text-white hover:underline">Delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
    </div>
  )
}