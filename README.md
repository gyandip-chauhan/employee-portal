# README

# Employee Portal Web App
In the employee-portal web app, employees can be registered through invitation. Employees can easily login through remote login, and their gross and effective hours can be easily tracked.
The app will display an employees directory, showing which employees are on time, on leave, or have late arrivals.
The app also includes a chat functionality with real-time user typing status, online status, and last seen information.


Things you may want to cover:
---

## Installation

1. Clone repo to local

```
git clone https://github.com/gyandip-chauhan/employee-portal.git
```

2. Install [rvm](https://rvm.io/) and
   [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

   (**Tip**: To allow `nvm` to automatically detect and change node versions for
   your project as you `cd` into the directory follow
   [this](https://github.com/nvm-sh/nvm#deeper-shell-integration))

3. Install ruby 3.3.1

```
rvm install $(cat .ruby-version)
```

4. Install Node 18.13.0(can be skipped if you followed the tip mentioned in (2)
   above)

```
nvm install $(cat .nvmrc)
```

5. Install Postgres

```
brew install postgresql
```

6. Install Redis

```
brew install redis
```

7. update Postgres username and password in env file & database.yml


8. Setup the app

```
# Go to the employee-portal app directory

bin/setup
```

Set your system ip address to the following files
```
/app/javascript/components/common/apiService.jsx
```
```
const baseURL = 'http://0.0.0.0:3000/api/v1';
```

```
/app/javascript/components/common/apiEndpoints.jsx
```
```
export const CABLE_URL = 'ws://0.0.0.0:3000/cable'
```

```
/Procfile.dev
```
```
web: env RUBY_DEBUG_OPEN=true bin/rails s -b 0.0.0.0 -p 3000
```

9. Run app in local env

```
foreman start -f Procfile.dev
```
OR
```
./bin/dev
```

10. Navigate to [http://system_ip:3000](http://system_ip:3000)

This README would normally document whatever steps are necessary to get the
application up and running.


* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
