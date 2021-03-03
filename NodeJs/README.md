##Requirements
1. Node version  >= 10.16.3 LTS

##Install and Run
everything should run in root directory 
1. create .env file (see .env.example)
2. `$ npm install`
3. `$ npm install --save sequelize-cli`
4. `$ npx sequelize-cli db:migrate`
5. `$ npm start`

##Note
Run this command only one time
`$ npx sequelize-cli db:seed:all`
