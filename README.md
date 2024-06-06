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
- OpenAI
- Stripe
- Google Maps AI
- Skyscanner API
- Uber API

#### OAuth 2.0 Usage
This authorization mechanism will be used to create new users and handle user logins and logouts to the platform.

#### Fulfillment of Additional Requirements:
- **Webhook Integration**: TBD When a user confirms basic travel information, it will make an external API call to OpenAI’s API to retrieve recommended travel areas and activities to do.
- **Google Calendar Integration**
- **Real-Time Collaboration**: When multiple users edit the same itinerary, those changes are reflected in real-time without the need of refreshing the webpage.
- **Long-Running Task**: Using OpenAI API to provide recommendations based on user preferences on activities and sites to see.

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
