# Backend

This folder contains the backend code for the project, built with Python and Flask.

## Setup and Run

1. Navigate to the backend directory:

   ```sh
   cd backend/
   ```

2. Create a virtual environment:

   ```sh
   py -m venv .venv
   ```

3. Activate the virtual environment:

   ```sh
   source .venv/Scripts/activate
   ```

4. Install dependencies:

   ```sh
   pip install -r requirements.txt
   ```

5. Start the Flask development server:
   ```sh
   flask --app app.py --debug run -h 0.0.0.0 -p 5000
   ```

The backend will be available at `http://0.0.0.0:5000/`.
