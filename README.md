
# TRT TECHNOLOGY 
FLASK WEB APPLICATION

--A Flask based web application, that allows user to sumbit their issues,allows to communicate with Company through email, allows Company to check issues work on it, update their collegues, update customers about issue.


## Authors

- [@HarshDigambar](https://git.cs.usask.ca/aij637)
- [@NoelHoehn](https://git.cs.usask.ca/ogu057)
- [@MarwanMostafa](https://git.cs.usask.ca/mam024)
- [@KhushdeepSingh](https://git.cs.usask.ca/rnf032)
- [@RubanaSyeda](https://git.cs.usask.ca/gnk231)
- [@MohammadHafiz](https://git.cs.usask.ca/wbj741)


## Features

- Submit a issue
- Get updates on email
- Change status of issue
- Change priority of ticket
- Create a user
- Delete a user
- Assign a issue to user
- Talk with customer and give an update
- Give update to colleague with internal comments


## Deployment

-- Creating a new virtual eniornment

```bash
git clone https://git.cs.usask.ca/wbj741/team_43_cmpt370.git
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
python main.py
```


## Installation

Install my-project 

```bash
git clone https://git.cs.usask.ca/wbj741/team_43_cmpt370.git
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
python main.py
```
    
## Documentation

[FlaskDocumentation](https://flask.palletsprojects.com/en/3.0.x/api/)


## API Reference

#### Get Landing 

```http
  GET /
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `None` | `None` | Get Landing Page |

#### Get Dashboard

```http
  GET /dashboard
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `None`      | `None` | Get Dashboard Page|

#### Create Ticket in Database

```http
   POST /createTicket
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `subject`      | `string` | Required. The subject of the support ticket.|
| `customer_first_name`      | `string` | Required. Customer's first name.|
| `customer_last_name`      | `string` | Required. Customer's last name.|
| `customer_email`      | `string` | Required. Customer's email address.|
| `business_name`      | `string` | Required. Business name associated with the support ticket.|
| `customer_phone`      | `string` | Customer's phone number.|
| `description`      | `string` | Required. Description of the support issue.|


#### Get Current User Tickets

```http
    GET /getCurrentUserTickets
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `String` | Required. Authentication token.|

#### Get Current User Name

```http
    GET /getCurrentUserName
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `String` | Required. Authentication token.|

#### Delete an employee

```http
    DELETE /deleteUser/${employee_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `employee_id`      | `int` | Required. ID of the employee.|

#### Change the Priority of a Ticket

```http
    POST /changePriority/${ticket_id}/${priority}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ticket_id`      | `int` | Required. ID of the support ticket.|
|`priority` | `string` | Required. Priority value ('highpriority' or 'lowpriority').|


#### Get Customer Comments Page

```http
    GET /customerComments
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `String` | Get Customer Comments.|

#### Get Admin Comments Page

```http
    GET /adminComments
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `api_key`      | `String` | Get Admin Comments.|


#### Submit a New Message for a Ticket

```http
    POST /submitNewMessage
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `text`      | `string` | Required. Text of the new message.|
| `sender`    | `string` | Required. Sender of the message.|
| `timestamp` | `string` | Required. Timestamp of the message.|
| `ticketNum`      | `int` | Required. ID of the support ticket.|

#### Submit a New Internal Message for a Ticket

```http
    POST /submitNewInternalMessage

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `text`      | `string` | Required. Text of the new message.|
| `sender`    | `string` | Required. Sender of the message.|
| `timestamp` | `string` | Required. Timestamp of the message.|
| `ticketNum`      | `int` | Required. ID of the support ticket.|

#### Submit a New Internal Message for a Ticket

```http
    POST /statusChange


```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `text`      | `string` | Required. Text of the new message.|
| `sender`    | `string` | Required. Sender of the message.|
| `timestamp` | `string` | Required. Timestamp of the message.|
| `ticketNum`      | `int` | Required. ID of the support ticket.|
| `status`      | `string` |Required. Status value ('Resolved' or 'Unresolved').|


#### Assign a ticket

```http
    POST /assignTicket/${ticketId}/${employeeId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ticketId`      | `int` | Required. ID of the support ticket.|
| `employeeId`    | `int` | Required. ID of the employee.|

#### auth.py

#### user login

```http
    POST /login

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | Required. User's username.|
| `password`    | `string` | Required. User's password.|

#### sigup user 

```http
    POST /signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | Required. User's name.|
| `username`      | `string` | Required. User's username.|
| `password`    | `string` | Required. User's password.|
| `role`    | `string` | Required. User's role ('admin' or 'user').|




## Appendix

--Make Sure you follow the installation steps properly, cause there is dependency between modules, so create a new enviornment and run reuirements.txt to install all required modules.


## Contributing

Contributions are always welcome!

-- Please follow deployement procedure and can make changes to project, please make sure to do that in different branch and commit your changes


## Feedback

If you have any feedback, please reach out to us at wbj741@usask.ca


## Support

For support, wbj741@usask.ca or join our Slack channel.


## Tech Stack

**FrontEnd:** HTML,CSS,Javascript 

**BACKEND:** Flask, Flask_login,Flask_admin,Flask_sqlalchemy, Flask_cors

