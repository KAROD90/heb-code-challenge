# H-E-B Backend Coding Exercise
The following code was developed by Keith Andrew Rodriguez in order to meet the requirements of a Backend Coding Exercise requested by H-E-B.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Overview
Build a HTTP REST API in {Java|Node.js|Python} for a service that ingests user images, analyzes them for object detection, and returns the
enhanced content. It should implement the following specification:

### API Specification
 - GET /images
    - Returns HTTP 200 OK with a JSON response containing all image metadata.

 - GET /images?objects="dog,cat"
    - Returns a HTTP 200 OK with a JSON response body containing only images that have the detected objects specified in the query
      parameter.
  
 - GET /images/{imageId}
    - Returns HTTP 200 OK with a JSON response containing image metadata for the specified image.

 - POST /images
    - Send a JSON request body including an image file or URL, an optional label for the image, and an optional field to enable object
      detection.
    - Returns a HTTP 200 OK with a JSON response body including the image data, its label (generate one if the user did not provide it), its
      identifier provided by the persistent data store, and any objects detected (if object detection was enabled).
  
### Object detection instructions
Image object detection can be performed using any API offering of your choosing (such as Google, IBM, Imagga, etc), or with a process
managed by your backend. The only requirement is that it must return a list of object names detected within that image.

That is the extent of the API contract. HTTP error codes should be used to indicate the proper level of system failure (i.e. client versus server).

### Database
A persistent data store is required, any variant of SQL is encouraged.

### Expectations
No frontend is required, but you may create one to demo the API. Regardless, a user of the API should be able to:
  - Upload an optionally labelled image and run image object detection on it
  - Retrieve all images and any metadata obtained from their analyses
  - Search for images based on detected objects

## Features
1. Retrieve All Images Metadata:
    - Endpoint: GET /images
    - Functionality: Returns metadata for all images stored in the system.
2. Filter Images by Detected Objects:
    - Endpoint: GET /images?objects="dog,cat"
    - Functionality: Returns metadata for images that have the specified objects detected.
3. Retrieve Metadata for a Specific Image:
    - Endpoint: GET /images/{imageId}
    - Functionality: Returns metadata for a specific image identified by its imageId.
4. Upload an Image with Optional Parameters:
    - Endpoint: POST /images
    - Functionality: Uploads an image to the system with optional parameters such as a label and enabling object detection.
      Response: Returns metadata for the uploaded image including its label, identifier, and detected objects (if object detection was enabled).

## Technologies Used
- Node.js: JavaScript runtime environment used to execute JavaScript code outside of a web browser.
- Express.js: A web application framework for Node.js that simplifies the creation of web servers and building RESTful APIs.
- Sequelize: An ORM (Object-Relational Mapping) library for Node.js that provides an easy-to-use interface for interacting with relational databases like PostgreSQL using JavaScript.
- PostgreSQL: A powerful open-source relational database management system.
- Google Vision API: A cloud-based API provided by Google that enables developers to integrate machine learning models for image analysis tasks such as labeling images, detecting objects, and recognizing text within images.
- Git: A version control system for tracking changes and collaborating on projects.

## Installation

### Prerequisites
There are several items you need to have installed prior to attempting to run this project:
1. Node.js is required to run JavaScript code outside of a web browser. You can download and install Node.js from the official website: Node.js [Downloads](https://nodejs.org/en/download).
2. Since the project connects to a PostgreSQL database, you need to have PostgreSQL installed on your system. You can download and install PostgreSQL from the official website: PostgreSQL [Downloads](https://www.postgresql.org/download/)
   1. Once you have postgres install create a new database either via pgAdmin4 or terminal name `images`
3. Google Cloud project with Vision API enabled is required in order to utilize Google Vision API. You can setup a Google cloud project by following the steps to create an account and project from the official website: Google Cloud [Account](https://cloud.google.com/vision/docs/object-localizer#set-up-your-google-cloud-project-and-authentication)
   1. Note after setting up a Google Cloud account and Project you will need to ensure you enable Cloud Vision API within your project. Once you have enabled the API you will need to create a new Service Account under Credentials, after creating a Service Account you will also need to add a key by creating a new key when prompted ensure you select JSON.

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/KAROD90/ADDREPO`
2. Navigate to the project directory: `cd src`
3. Install the dependencies: `npm install`
4. In the file directory under src -> config create a new file named `cloudVisionKey.json` and place your JSON service account key inside and save.
5. Start the server: `npm start`
  - For development purposes nodemon package has been included as a dev package: `nodemon run dev`
6. Sequelize will attempt to connect and sync to the Database upon success the server will start on localhost port: 3000: `http://localhost:3000`

## Usage
After installing and running the project locally, you can access the built-in Swagger API Documentation at `http://localhost:3000/swagger/`. This documentation allows you to interact with the APIs directly. Alternatively, you can use an API platform such as Insomnia, Postman, Thunder Client, etc., to submit REST API requests.:

### GET /images
      - http://localhost:3000/api/images

### GET /images?objects="dog,cat"
      - http://localhost:3000/api/images/by
      - Use query parameters: 
        - name: objects
        - value: enter desired objects seperated by, commas between multiple objects

### GET /images/{imageId}
      - http://localhost:3000/api/images/{id}

### POST /images
      - http://localhost:3000/api/images
      - JSON Request Body:
           {
              "requests": [
                {
                  "features": [
                    {
                      "maxResults": 10,
                      "type": "OBJECT_LOCALIZATION"
                    }
                  ],
                  "image": {
                    "source": {
                      "imageUri": "Place direct image address here"
                    }
                  },
                  "labels": {
                    "label": "Place label of your choice here or Default Label will be provided"
                  }
                }
              ],
              "enableObjectDetection":  SET True or False
            }