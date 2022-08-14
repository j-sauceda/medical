# Medical Calendar

This is a full-stack project made with:

+ Django
+ jwt token auth
+ GraphQL
+ ReactJS
+ TypeScript

its purpose is to provide an example of a practical way of integrating all these technologies.
MediCal serves as web portal for setting and managing appointments and patients' records for a hypothetical medical clinic.
The source-code has been to use AWS RDS to store data, be served on an AWS EC2 using nginx + gunicorn, and send emails using AWS SES.
However, the setup is flexible enough to handle different configurations.

Please, notice that the source-code is provided without warranty. This is an unfinished project not meant for production.

## hints

- $ cd /path/to/Projects/
- $ mkdir medical
- $ cd medical
- $ git clone https://github.com/j-sauceda/medical.git ./
- $ cd ..
- $ python3 -m venv medical
- $ cd medical
- $ source bin/activate
- $ pip3 install -r requirements.txt
- $ cp .env.example .env
- $ edit .env
- $ python3 manage.py collectstatic
- uncomment STATICFILES_DIR in medical/settings.py
- $ cd frontend/
- $ npm install
- $ npm run build
- deploy -- depends on your server (nginx, apache, lighttpd)
