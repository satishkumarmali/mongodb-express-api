# express-demo
## Technology

Node.js Version | NPM Version | MongoDB Version
------------ | -------------|------------
12.14.1 | 6.13.4 | 4.2.5

## Features
- [x] Project Setup
- [x] Mongo  Connection Setup
- [x] Database Model - Post, Tag
- [x] Database Service - post, tag
- [x] Controller - post, tag
- [x] API for add and show all post data
- [x] API for add tags, edit,delete and show all tags data
- [x] POST API backend for user can edit, delete, filter by tag and order post by title, createdDate, upVote, downVote
- [x] Note - User can upVote and downVote as many as want

## Installation
```bash
$ npm install
```
## Configure the application
Create a configuration file for application:
```bash
cp .env.example .env
```

## Running the app
```bash
# development
$ NODE_ENV=dev npm start
```
