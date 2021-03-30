# Marvel Backend

![Alt text](https://res.cloudinary.com/cathy-cloud/image/upload/v1616924787/api/marvel-api/marvel-logo_z76ndi.png?raw=true "Marvel logo")

<br>

## Packages

-   [Axios](https://github.com/axios/axios)
-   [Cors](https://www.npmjs.com/package/cors)
-   [Crypto-js](https://www.npmjs.com/package/crypto-js)
-   [Dotenv](https://www.npmjs.com/package/dotenv)
-   [Express](https://github.com/expressjs/express)
-   [Express-formidable](https://github.com/hatashiro/express-formidable)
-   [Mongoose](https://www.npmjs.com/package/mongoose)
-   [Uid2](https://www.npmjs.com/package/uid2)

<br>

## Characters

### /characters (GET)

Get a list of characters

| Query    | Info                        | Required |
| -------- | --------------------------- | -------- |
| `apiKey` | API key received            | Yes      |
| `limit`  | between 1 and 100           | No       |
| `skip `  | number of results to ignore | No       |

<br>

## Comics

### /comics (GET)

Get a list of comics

| Query    | Info                        | Required |
| -------- | --------------------------- | -------- |
| `apiKey` | API key received            | Yes      |
| `limit`  | between 1 and 100           | No       |
| `skip `  | number of results to ignore | No       |

### /comics/:characterId (GET)

Get a list of comics containing a specific character

| Params        | Info                  | Required |
| ------------- | --------------------- | -------- |
| `characterId` | characters mongoDB id | Yes      |

| Query    | Info             | Required |
| -------- | ---------------- | -------- |
| `apiKey` | API key received | Yes      |

<br>

## User

### /user/signup (POST)

Create a new user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |
| `username` | string | Yes      |

### /user/login (POST)

Log a user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

### /user/favorite/character (POST)

| Body          | Type   | Required | Description  |
| ------------- | ------ | -------- | ------------ |
| `characterId` | string | Yes      | character id |
| `id`          | string | Yes      | user id      |

### /user/favorite/comic (POST)

| Body          | Type   | Required | Description        |
| ------------- | ------ | -------- | ------------------ |
| `comicId`     | string | Yes      | comic id           |
| `id`          | string | Yes      | user id            |
| `title`       | string | Yes      | comic title        |
| `path`        | string | Yes      | image path         |
| `extension`   | string | Yes      | image extension    |
| `description` | string | Yes      | comic descrtiption |

### /user/favorites/:\_id (GET)

Get all favorites comics and characters of one user

| Param | Required | Description |
| ----- | -------- | ----------- |
| `id`  | Yes      | user id     |
