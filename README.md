# project-wenduosky
project-wenduosky created by GitHub Classroom

# Project Title: PlanPal

## Team Name: Wenduo Sky

### Team Members:
- Aarin Jasikumar ([aarin.jasikumar@mail.utoronto.ca](mailto:aarin.jasikumar@mail.utoronto.ca))
- Jacky Ji ([jacky.ji@mail.utoronto.ca](mailto:jacky.ji@mail.utoronto.ca))

### Description:
PlanPal is a travel planning web app designed to help promote a multiuser planning experience. It offers a range of features to streamline the travel planning process:

- **Trip Planning**: Users can create detailed itineraries for their trips, including activities, accommodations, and transportation.
- **Route Viewing**: Users can view a live update of the route that they will be taking based on the activities they have chosen.
- **Collaboration**: The web app allows for real-time collaborative planning, enabling multiple users to contribute to the same itinerary, making it ideal for group travel, in real time. Users will be able to drag and drop, join and leave and delete events.

The overall aim of PlanPal is to simplify the travel planning experience with multiple users.

### Fulfillment of Required Elements:

#### Tech Stack
- **Frontend Framework**: Angular
- **Frontned Libraries**: Primeng https://primeng.org/
- **Drag and Drop Module**: Angular CDK https://material.angular.io/cdk/drag-drop/overview
- **Backend**: RxJS, Express using Node.js
- **Database**: Firebase

We will be writing our application's API so that it is RESTful.

We will create a CI/CD pipeline to create and deploy our application through Docker and Docker Compose.

#### Publishing the Application

#### Third Party API
For this project we are currently planning on using AT LEAST one of the following third-party applications:
- Google Maps API / Mapbox API
    https://developers.google.com/maps/documentation/javascript/overview?hl=en
    https://www.mapbox.com/
-  Google My Business API
    https://developers.google.com/my-business/content/review-data#list_all_reviews
- WeatherStack API
  https://weatherstack.com/

We are going to use the Google My Business API to recommend activities based on reviews on where users want to travel. Once they choose what they like,
we will use the Google Maps or Mapbox API to create an interactive map to preview the route of their interary for each day. We will use the WeatherStack API to get the real time weather to inform the users on weather and provide suggestions on outer wear.

#### OAuth 2.0 Usage
This authorization mechanism will be used to create new users and handle user logins and logouts to the platform.
- Access to export google calendar
    https://developers.google.com/calendar/api/v3/reference/events/insert
- Access to create google reviews
    https://developers.google.com/my-business/content/posts-data

#### Fulfillment of Additional Requirements:
- **Webhook Integration**: As the user builds their itinerary, we will use webhooks to export their itineray to a users google calendar.
- **Real-Time Collaboration**: When multiple users edit the same itinerary, those changes are reflected in real-time without the need of refreshing the webpage.

### Alpha Version Goal:
- As a user, I want to be able to create an account and login to view the itineraries that I have created and am invited to.
- As a user, I want to be able to view all of my trips.
- As a user, I want to be able to choose my preferences and create a trip.
- As a user, I want to be able to browse activities for my corresponding trip.
- As a user, I want to be able to add activities to my itinerary

### Beta Version Goal:
- As a user, I want to be able to create custom activities for my corresponding trip.
- As a user, I want to be able to invite users to my trip.
- As a user, I want to be able to accept trips from others.
- As a user, I want to be able to collaborate with others to create and modify an itinerary in real-time.
- As a user, I want to see an overlay of the weather forcase on top of the itenerary

### Final Version Goal:
- As a user, I want to be able to view the most optimal route/itinerary based on when activities are available, their distance, and transportation methods.
- Deploy Application
- Fix any bugs
- Record Video Presentation

### Potential Additional Features (if time allows):
- As a user, I want to be able to remove users from a trip.
- As a user, I want to view the optimal travel plan between activities through Google Maps.
