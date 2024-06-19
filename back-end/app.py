from flask import Flask, request, jsonify
import ZODB, ZODB.FileStorage
import transaction
from persistent import Persistent
from BTrees.OOBTree import OOBTree
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for all origins

def connection():
    # Establish connection to the ZODB database
    storage = ZODB.FileStorage.FileStorage('patients.fs')
    db = ZODB.DB(storage)
    return db

class Patient(Persistent):
    def __init__(self, name, last_name, phone, date, symptoms):
        # Patient class to represent patient objects stored in ZODB
        self.name = name
        self.last_name = last_name
        self.phone = phone
        self.date = date
        self.symptoms = symptoms

@app.route('/', methods=['GET'])
def index():
    return 'API Patients Manager'

@app.route('/add_patient', methods=['POST'])
def add_patient():
    # Endpoint to add a new patient
    db = connection()
    data = request.get_json()
    name = data.get('name')
    last_name = data.get('lastName')
    phone = data.get('phone')
    date = data.get('date')
    symptoms = data.get('symptoms')
    conn = db.open()
    root = conn.root()
    if 'patients' not in root:
        root['patients'] = OOBTree() # Use OOBTree to store patients
    if 'patient_counter' not in root:
        root['patient_counter'] = 0 # Initialize patient counter
    root['patient_counter'] += 1
    new_patient = Patient(name, last_name, phone, date, symptoms)
    patients = root['patients']
    patient_id = root['patient_counter']
    patients[patient_id] = new_patient
    transaction.commit()
    conn.close()
    db.close()
    return jsonify({
        'message': 'Patient added successfully',
        'patient': {
            'id': patient_id,
            'name': new_patient.name,
            'lastName': new_patient.last_name,
            'phone': new_patient.phone,
            'date': new_patient.date,
            'symptoms': new_patient.symptoms
        }
    })

@app.route('/patients', methods=['GET'])
def get_patients():
    # Endpoint to retrieve all patients
    db = connection()
    conn = db.open()
    root = conn.root()
    patients_list = []
    if 'patients' in root:
        patients = root['patients']
        for patient_id, patient in patients.items():
                    patient_dict = {
                        'id': patient_id,
                        'name': patient.name,
                        'lastName': patient.last_name,
                        'phone': patient.phone,
                        'date': patient.date,
                        'symptoms': patient.symptoms
                    }
                    patients_list.append(patient_dict)
    conn.close()
    db.close()
    return jsonify(patients_list)

@app.route('/update_patient/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    # Endpoint to update an existing patient
    db = connection()
    conn = db.open()
    root = conn.root()
    if 'patients' in root:
        patients = root['patients']
        if patient_id in patients:
            data = request.get_json()
            patient = patients[patient_id]
            # Update patient attributes based on JSON data received
            patient.name = data.get('name', patient.name)
            patient.last_name = data.get('lastName', patient.last_name)
            patient.phone = data.get('phone', patient.phone)
            patient.date = data.get('date', patient.date)
            patient.symptoms = data.get('symptoms', patient.symptoms)
            transaction.commit()
            conn.close()
            db.close()
            return jsonify({
                'id': patient_id,
                'name': patient.name,
                'lastName': patient.last_name,
                'phone': patient.phone,
                'date': patient.date,
                'symptoms': patient.symptoms
            })
        else:
            conn.close()
            db.close()
            return jsonify({'error': f'Patient with id {patient_id} not found'}), 404
    else:
        conn.close()
        db.close()
        return jsonify({'error': 'No patients found in database'}), 404

@app.route('/delete_patient/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    # Endpoint to delete an existing patient
    db = connection()
    conn = db.open()
    root = conn.root()
    try:
        if 'patients' in root:
            patients = root['patients']
            if patient_id in patients:
                del patients[patient_id]
                transaction.commit()
                print(f'Patient with id {patient_id} deleted successfully')
                return jsonify({'message': f'Patient with id {patient_id} deleted successfully'}), 200
            else:
                print(f'Patient with id {patient_id} not found')
                return jsonify({'error': f'Patient with id {patient_id} not found'}), 404
        else:
            print('No patients found in database')
            return jsonify({'error': 'No patients found in database'}), 404
    except Exception as e:
        print(f'Error deleting patient: {e}')
        return jsonify({'error': 'Internal server error'}), 500
    finally:
        conn.close()
        db.close()

if __name__ == '__main__':
    app.run(debug=True)
