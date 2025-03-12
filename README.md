"# Year-3-MSc" 


add env folder to frontend with REACT_APP_API_URL = 'http://localhost:8000'
add env file to backend>auth_system with database, email, and onedrive details

Create virtual environment within backend and run script. Navigate to backend in terminal
  - python -m venv venv
  - venv\Scripts\activate

Install requirements.txt
  - pip install -r requirements.txt

Install node modules. Navigate to frontend in terminal
npm install

In virtual environment terminal, navigate to backend and run the following
  - python manage.py makemigrations
  - python manage.py migrate
  - python manage.py runserver

 In virtual environment terminal, navigate to frontend and run
  - npm start

To listen for notifications (send reminder emails prior to task due date), run the following in backend terminal
- python manage.py listen_for_notifications
