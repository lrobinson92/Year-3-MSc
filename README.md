"# Year-3-MSc" 
Run requirements.txt
npm install

add env folder to frontend with REACT_APP_API_URL = 'http://localhost:8000'
add env file to backend>auth_system with database, email, and onedrive details

Create virtual environment within backend and run script

In terminal, navigate to backend and run the following
  - python manage.py makemigrations
  - python manage.py migrate
  - python manage.py runserver

In terminal, navigate to frontend and run
  - npm start
