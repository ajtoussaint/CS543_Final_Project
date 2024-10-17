# Startup Guide

## Installing Mongo DB
1. Download MongoDB community edition (https://www.mongodb.com/try/download/community-kubernetes-operator) atlas not required, compass is recommended
2. Optional: Add the bin file within MongoDB to your PATH (Probably locaed at C:/Users/yourUsername/ProgramFiles/MongoDB/Server/8.0/bin)
3. Create the /data/db directory in the root of the drive MongoDB was installed in. This location is where the data is stored physically
4. Run the "mongod" command. If the recommened directory was not added to the path in step 2 then you will need to run the command from that directory
5. Use MongoDBCompass (included with download) to test the connection. Open, click "add new connection", use default settings with any name you want
6. Create a collection called "users" and insert a record by running this in the command line: "db.users.insert({ name: "John Doe", email: "john@example.com" })" You can change the name to anything you like
 

## Running the Application
1. Clone the repository into a local folder
2. Run "npm install" in both the server and client folders
3. Add a ".env" file to the root directory and include the text "DATABASE_NAME=" followed by the name of the database you created in MongoDB
4. Create a terminal, navigate to the server folder, enter: "npm run dev". You should see that the server is running and Connected to MongoDB
5. In another terminal, navigagte to the client folder, enter: "npm start". You should see the default react web page with the name of the user you put in the database
