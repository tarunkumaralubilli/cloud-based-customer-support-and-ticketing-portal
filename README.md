#  Cloud-Based Customer Support & Ticketing Portal

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![API Gateway](https://img.shields.io/badge/API_Gateway-FF4F8B?style=for-the-badge&logo=amazonapigateway&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)

</p>

---

#  Table of Contents

- Project Overview
- Features
- Technology Stack
- AWS Services Used
- System Architecture
- Application Workflow
- Project Structure
- Application Screenshots
- Getting Started
- Future Enhancements
- License

---

#  Project Overview

The **Cloud-Based Customer Support & Ticketing Portal** is a cloud-based web application developed using **Amazon Web Services (AWS)** to simplify customer support operations. The system enables customers to submit and track support tickets while providing administrators with a centralized dashboard to manage and resolve customer requests efficiently.

The application follows a serverless architecture where requests from the frontend are routed through **Amazon API Gateway**, processed by **AWS Lambda (Python 3.12)**, and stored securely in **Amazon DynamoDB**. The frontend is hosted on **Amazon EC2**, while **Amazon S3**, **AWS IAM**, and **Amazon CloudWatch** provide storage, security, and monitoring services.

---


#  Features

- Customer Registration and Login
- Administrator Login
- Submit Support Tickets
- Track Ticket Status
- View Ticket History
- Admin Dashboard
- Customer Management
- Ticket Management
- REST API Integration
- Cloud-Based Architecture
- Secure Data Storage
- Serverless Backend using AWS Lambda

---

#  Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python 3.12 |
| Cloud Platform | Amazon Web Services (AWS) |
| Hosting | Amazon EC2 |
| API | Amazon API Gateway |
| Compute | AWS Lambda |
| Database | Amazon DynamoDB |
| Storage | Amazon S3 |
| Security | AWS IAM |
| Monitoring | Amazon CloudWatch |

---

#  AWS Services Used

| AWS Service | Purpose |
|--------------|--------------------------------|
| Amazon EC2 | Hosts the frontend application |
| Amazon API Gateway | REST API communication |
| AWS Lambda | Backend business logic |
| Amazon DynamoDB | Stores customer and ticket information |
| Amazon S3 | Stores application resources |
| AWS IAM | Identity and access management |
| Amazon CloudWatch | Monitoring and logging |

---

#  System Architecture

**Architecture Flow**

- User accesses the web application hosted on Amazon EC2.
- Requests are sent to Amazon API Gateway.
- API Gateway invokes AWS Lambda functions.
- Lambda executes business logic.
- Customer and ticket information is stored in Amazon DynamoDB.
- Amazon S3 stores application resources.
- CloudWatch monitors logs and application performance.
- IAM provides secure access control.

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/c77d4dd2-2b5b-4f7f-9e8c-5726c7a11d88" />


---

#  Application Workflow

```text
Customer
      │
      ▼
Login / Register
      │
      ▼
Submit Support Ticket
      │
      ▼
Amazon API Gateway
      │
      ▼
AWS Lambda (Python)
      │
      ▼
Amazon DynamoDB
      │
      ▼
Admin Dashboard
      │
      ▼
Update Ticket Status
      │
      ▼
Customer Tracks Ticket Status
```

---

#  Project Structure

```text
Cloud-Based-Customer-Support-Ticketing-Portal
│   .gitignore
│   frontend - Shortcut.lnk
│   
├───.vscode
│       launch.json
│       
├───aws
├───backend
├───docs
│       doccs.txt
│       
└───frontend
    │   index.html
    │   
    ├───admin
    │       analytics.html
    │       customers.html
    │       dashboard.html
    │       login.html
    │       reports.html
    │       settings.html
    │       tickets.html
    │       
    ├───assets
    │   ├───css
    │   │       admin.css
    │   │       auth.css
    │   │       base.css
    │   │       components.css
    │   │       dashboard.css
    │   │       history.css
    │   │       home.css
    │   │       ticket.css
    │   │       tickets-admin.css
    │   │       track.css
    │   │       variables.css
    │   │       
    │   ├───images
    │   └───js
    │           admin-auth.js
    │           admin-guard.js
    │           admin-shell.js
    │           analytics-admin.js
    │           auth.js
    │           customers-admin.js
    │           dashboard.js
    │           home.js
    │           reports-admin.js
    │           settings-admin.js
    │           submit-ticket.js
    │           theme-toggle.js
    │           ticket-history.js
    │           ticket-store.js
    │           tickets-admin.js
    │           track-ticket.js
    │           
    └───customer
            forgot-password.html
            login.html
            register.html
            submit-ticket.html
            ticket-history.html
            track-ticket.html
            
```

---

#  Application Screenshots


##  Customer Login

<img width="1033" height="504" alt="image" src="https://github.com/user-attachments/assets/f84ada37-95be-4fe9-be2a-5f566a73cb19" />


---

##  Customer Registration

<img width="1888" height="942" alt="image" src="https://github.com/user-attachments/assets/5ac165c9-95d8-404a-8860-72619d846c8a" />


---

##  Submit Support Ticket

<img width="968" height="1086" alt="image" src="https://github.com/user-attachments/assets/a3624514-5198-47d7-962f-388773aee956" />


---


##  Track Ticket

<img width="1135" height="982" alt="image" src="https://github.com/user-attachments/assets/f732a746-7474-4934-af13-dcc0ee28b774" />


---


##  Admin Dashboard

<img width="1107" height="569" alt="image" src="https://github.com/user-attachments/assets/d2d011e9-8298-480f-a5fa-be3147db5d04" />


---

##  Ticket Management

<img width="1065" height="517" alt="image" src="https://github.com/user-attachments/assets/30d670d1-bb9f-48a9-b58f-406ac57e7fa4" />


---

##  Customer Management

<img width="1899" height="936" alt="image" src="https://github.com/user-attachments/assets/bf422a05-a5da-4186-a562-3ed93d149e98" />


---

##  Analytics Dashboard

<img width="1909" height="948" alt="image" src="https://github.com/user-attachments/assets/1b221b05-ef2f-458f-b65b-d3473cc16e5a" />


---

#  Getting Started

## Prerequisites

- AWS Account
- Python 3.12
- Visual Studio Code
- Git
- Web Browser

---

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Cloud-Based-Customer-Support-Ticketing-Portal.git
```

---

## Open Project

Open the project using **Visual Studio Code**.

---

## Configure AWS Services

- Create AWS Lambda Functions
- Configure Amazon API Gateway
- Create Amazon DynamoDB Tables
- Configure Amazon S3 Bucket
- Configure IAM Roles
- Enable CloudWatch Logs

---


#  Future Enhancements

- AI-based ticket classification
- Chatbot integration
- Email notifications
- Mobile application
- Analytics dashboard

---
