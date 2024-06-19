# Patient Shifts Manager

Patient Shifts Manager is a web application for managing patient records and shifts, built with a Flask backend using ZODB for data storage, and a React frontend.

## Backend (Flask with ZODB)

The backend of the application is built with Flask, a Python web framework, and utilizes ZODB (Zope Object Database) for storing patient records persistently.

### Setup and Installation

```bash
git clone https://github.com/cristianchivisky/patient-shifts-manager.git
cd patient-shifts-manager
cd back-end
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python app.py
```

The Flask application will start running on http://localhost:5000.

### Endpoints

- POST /add_patient: Add a new patient to the database.
- GET /patients: Retrieve all patients from the database.
- PUT /update_patient/<patient_id>: Update an existing patient record.
- DELETE /delete_patient/<patient_id>: Delete a patient record.

### Technologies Used

- Flask: Python web framework
- ZODB: Object-oriented database for Python

## Frontend (React)

The frontend of the application is built with React, a JavaScript library for building user interfaces.

### Setup and Installation

```bash
cd frontend
npm install
npm run dev
```

The React application will start running on http://localhost:5173.

## Folder Structure

- components/: Contains reusable React components like Form, Header, and PatientsList.
- App.jsx: Main component integrating Form and PatientsList components.

### Technologies Used

- React: JavaScript library for building UI components
- Vite: Build tool that aims to provide a faster and leaner development experience for modern web projects
- Axios: HTTP client for making API requests
- Tailwind CSS: Utility-first CSS framework for styling

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes.
4. Commit your changes (git commit -am 'Add some feature').
5. Push to the branch (git push origin feature/your-feature).
6. Create a new Pull Request.

## License
This project is licensed under the MIT License.
