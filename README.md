# Startup Guide

To run the application you will first need to install NodeJS to run the server. To create a local development environment, you will also need MongoDB installed and running on the default port. 

## Installing NodeJS and npm
1. Follow the installation instructions here: (https://nodejs.org/en/download/package-manager)

## Installing Mongo DB
1. Download MongoDB community edition (https://www.mongodb.com/try/download/community-kubernetes-operator) atlas is not required, compass is recommended
2. Optional: Add the bin file within MongoDB to your PATH (Probably locaed at C:/Users/<yourUsername>/ProgramFiles/MongoDB/Server/8.0/bin)
3. Create the /data/db directory in the root of the drive MongoDB was installed in. This location is where the data is stored physically
4. Run the "mongod" command. If the recommened directory was not added to the path in step 2 then you will need to run the command from that directory
5. Use MongoDBCompass (included with download) to test the connection. Open, click "add new connection", use default settings with any name you want. This will open a connection to the locally hosted server
6. Using MongoDBCompass or through other means create a new database. Record the database name for future use.

## Running the Application
1. Clone the whole repository into a local directory
2. Run "npm install" in both the server and client directories
3. Add a ".env" file to the root directory and include the text "DATABASE_NAME=" followed by the name of the database you created in MongoDB
4. Create a terminal, navigate to the server directory, enter: "npm run start". You should see that the server is running and Connected to MongoDB
5. In another terminal, navigagte to the client directory, enter: "npm start". You should see the default react web page with the name of the user you put in the database
