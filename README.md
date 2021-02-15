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

## Main Endpoints
1. domain.com/partners/*
2. domain.com/auth/*
3. domain.com/applications/*
4. domain.com/users/*
5. domain.com/roles/*

## Database name 
tpdrmv2profiles 

## About service
The service is a work with authentication, users and partners with applications.
Here you can users CRUD,partners CUD,auth(signin,signup,signout),send referrals,
update user role and mangoes, change user password.

> Available endpoints

>> 1.Get All Users `/users`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users",
      "method": "GET",
      "headers": {
        "Authorization": "{{admin_access_token}} or {{superAdmin_access_token}}"
        }
    }
```

>> 2.Get User By ID `users/{{user_id}}`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/{{user_id}}",
      "method": "GET",
      "headers": {
        "Authorization": "{{admin_access_token}} or {{superAdmin_access_token}}"
        }
    }
```

>> 3.Get me(auth user info) `users/me`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/me",
      "method": "GET",
      "headers": {
        "Authorization": "{{member_access_token}}"
      }
    }
```

>> 4.Create User `users`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/me",
      "method": "POST",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "email": "required|string|email",
        "password": "required|string",
        "role_id": "required|number",
        "country_id": "required|number"
      }
    }
```

>> 5.Send referrals `users/referrals`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/referrals",
      "method": "POST",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "email": "required|string|email",
        "referral_link": "required|example:http(s)://{{front-end-sigup-link}}?ref_id={{user_UUID}}"
      }
    }
```

>> 6.Sign in `auth/signin`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/auth/signin",
      "method": "POST",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "email": "required|string|email",
        "password": "required|string"
      }
    }
```

>> 7.Sign up `auth/signup`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/auth/signup",
      "method": "POST",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "email": "required|string|email",
        "password": "required|string",
        "confirm_password": "required|string|password_confirmation"
      }
    }
```

>> 8.Sign out `auth/signout`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/auth/signout",
      "method": "POST",
      "headers": {
        "Authorization": "{{member_access_token}}"
      }
    }
```

>> 9.Update logged in user info `users/me`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/me",
      "method": "PUT",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "first_name": "string|optional",
        "last_name": "string|optional",
        "phone": "string|optional|format:e164",
        "address": "string|optional",
        "address2": "string|optional",
        "city": "string|optional",
        "zip_code": "string|optional",
        "birth_date": "string|date|format:YYYY-MM-DD"
      }
    }
```

>> 9.Update logged in user password `users/password`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/password",
      "method": "PUT",
      "headers": {
        "Authorization": "{{member_access_token}}"
      },
      "data": {
        "current_password": "required|string",
        "new_password": "required|string",
        "confirmed_password": "required|string|password_confirmation"
      }
    }
```

>> 9.Update user role `users/{{user_id}}/roles`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/{{user_id}}/roles",
      "method": "PUT",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      },
      "data": {
        "role_id": "required|number"
      }
    }
```

>> 10.Update user mangoes `users/{{user_id}}/mangoes`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/users/{{user_id}}/mangoes",
      "method": "PUT",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{security_access_token}}"
      },
      "data": {
        "mangoes": "required|number",
        "reason": "required|string"
      }
    }
```

>> 11.Get All Partners `partners[?except_status=deleted]`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners[?except_status=deleted]",
      "method": "GET",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      }
    }
```

>> 12.Get Partner by id `partners/{{partner_id}}`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners/{{partner_id}}",
      "method": "GET",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      }
    }
```

>> 13.Get All Applications `applications`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/applications",
      "method": "GET",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      }
    }
```

>> 14.Get Application by appId `applications/{{appId}}`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/applications/{{appId}}",
      "method": "GET",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      }
    }
```

>> 15.Get Application Publik Key `applications/{{appId}}/public_key`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/applications/{{appId}}/public_key",
      "method": "GET",
      "headers": {
        "x-privacy-secret": "{{x-privacy-secret}} Stored into Redis"
      }
    }
```

>> 16.Create Partner `partners`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners",
      "method": "POST",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      },
      "data": {
        "name": "required|string",
        "status": "required|values:active,deleted,suspended"
      }
    }
```

>> 17.Create Partner Application `partners/{{partner_id}}/applications`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners/{{partner_id}}/applications",
      "method": "POST",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      },
      "data": {
        "name": "required|string"
      }
    }
```

>> 18.Update Partner by id `partners/{{partner_id}}`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners/{{partner_id}}",
      "method": "PUT",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      },
      "data": {
        "name": "string|optional",
        "status": "string|optional|values:active,deleted,suspended"
      }
    }
```

>> 19.Delete Partner by id `partners/{{partner_id}}`
```JSON
    {
      "url": "https://dev.api2.rebatemango.com/partners/{{partner_id}}",
      "method": "DELETE",
      "headers": {
        "Authorization": "{{superAdmin_access_token}} or {{admin_access_token}}"
      }
    }
```

## DB table structures
> table users

```sql
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  `status` enum('active','suspended','deleted') DEFAULT 'active',
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `provider` enum('rebateMango','facebook','dummy') DEFAULT 'rebateMango',
  `frequencyProgramLevelId` int(10) unsigned DEFAULT NULL,
  `mangoes` int(11) DEFAULT '0',
  `countryId` int(10) unsigned DEFAULT NULL,
  `partnerId` int(10) unsigned DEFAULT NULL,
  `roleId` int(10) unsigned DEFAULT NULL,
  `externalId` varchar(255) DEFAULT NULL,
  `applicationId` int(10) unsigned DEFAULT NULL,
  `isSubscribed` tinyint(1) unsigned DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `partnerId` (`partnerId`),
  KEY `roleId` (`roleId`),
  KEY `applicationId` (`applicationId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`applicationId`) REFERENCES `applications` (`id`)
) ENGINE=InnoDB
```

> Table user_infos

```sql
CREATE TABLE `user_infos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `firstName` varchar(32) DEFAULT NULL,
  `lastName` varchar(32) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zipCode` varchar(255) DEFAULT NULL,
  `birthDate` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  UNIQUE KEY `phone` (`phone`),
  CONSTRAINT `user_infos_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
```

> Table roles

```sql
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` enum('superAdmin','admin','manager','member') NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB
```

> Table partners

```sql
CREATE TABLE `partners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('active','suspended','deleted') DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB
```

> Table applications

```sql
CREATE TABLE `applications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `appId` varchar(255) DEFAULT NULL,
  `clientSecret` varchar(255) DEFAULT NULL,
  `publicKey` text,
  `privateKey` text,
  `partnerId` int(10) unsigned DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `appId` (`appId`),
  KEY `partnerId` (`partnerId`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`partnerId`) REFERENCES `partners` (`id`)
) ENGINE=InnoDB
```