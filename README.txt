## Setup
1.Install nodejs
2.Install MongoDB Compass
3. Install dependencies: `npm install`
4. Start the server from project folder: `node app.js`


## User Authentication

- Visit `/` to register a new user.
- Visit `/auth` to log in with your registered user.
- Visit `/rega` to register as admin(secret is:1234).
- Visit `/loga` to login as admin.

## Admin Page Functionality

- Admins can manage items related to the portfolio on the `/add-item` page.
- Each item includes three pictures, one names, one descriptions, and timestamps.

## REST API
-Used APIs:"WikipediaAPI","NewsAPI","WorldbankAPI"
- Three different pages display data from three different APIs (Stock, News and GDP.).
- Visualizations are created for enhanced user engagement and understanding of the data.

## Nodemailer

- Welcome messages are sent after user registration.

## Project Organization and Design

- Code is organized following best practices.
- Responsive design is implemented using EJS for a visually appealing interface.