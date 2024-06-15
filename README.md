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
- **Collaboration**: The web app allows for collaborative planning, enabling multiple users to contribute to the same itinerary, making it ideal for group travel.
- **Feature-Based Assistive Planning**: Utilizing AI technology to further help users select activities based on user preference and popular choices.

The overall aim of PlanPal is to simplify the travel planning experience with multiple users, providing suggestions tailored to user likings.

### Fulfillment of Required Elements:

#### Tech Stack
- **Frontend Framework**: Angular
- **Backend**: Express using Node.js

We will be writing our application's API so that it is RESTful.

We will create a CI/CD pipeline to create and deploy our application through Docker and Docker Compose.

#### Publishing the Application

#### Third Party API
For this project we are currently planning on using AT LEAST one of the following third-party applications:
- Google 3D Maps API / Mapbox API
- Google Review API
- WeatherStack API

We are going to use the google review api to filter activities depending on where users want to travel. Once they choose what they like,
we will use the google maps or mapbox api to create a preview for the route of the interary for each day. We will use the WeatherStack API
to get the real time weather to inform the users on weather and provide suggestions on outer wear.

#### OAuth 2.0 Usage
This authorization mechanism will be used to create new users and handle user logins and logouts to the platform.
- Access to export google calendar
- Access to create google reviews

#### Fulfillment of Additional Requirements:
- **Webhook Integration**: As the user builds their itinerary, we will use webhooks to automatically update a users google calendar.
- **Real-Time Collaboration**: When multiple users edit the same itinerary, those changes are reflected in real-time without the need of refreshing the webpage.
- **Long-Running Task**: Generate the route for each day to preview the itinerary for that day

### Alpha Version Goal:
- As a user, I want to be able to create an account and login to view the itineraries that I have created and am invited to.
- As a user, I want to be able to create a trip and a corresponding itinerary.
- As a user, I want to be able to choose my preferences for each of my upcoming trips.
- As a user, I want to be able to browse activities for my corresponding trip.
- As a user, I want to be able to create custom activities for my corresponding trip.

### Beta Version Goal:
- As a user, I want to be able to invite users to my trip.
- As a user, I want to be able to accept trips from others.
- As a user, I want to be able to collaborate with others to create and modify an itinerary in real-time.
- As a user, I want to be able to view the most optimal route/itinerary based on when activities are available, their distance, and transportation methods.

### Final Version Goal:
- Deploy Application
- Fix any bugs
- Record Video Presentation

### Potential Additional Features (if time allows):
- As a user, I want to be able to remove users from a trip.
- As a user, I want to view the optimal travel plan between activities through Google Maps.
