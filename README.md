# Smart Pantry

Smart Pantry is a full-stack application that uses React + Flask + Roboflow to detect items in your fridge, pantry, or any other food-storing place. The motivation for this app is to keep track of the food you have access to in order to prevent waste, and plan ahead. In future versions, this app could use a recipe book to plan meals automatically ahead of time, and have the ability to run inference on shopping tickets for easier uploads. 

# Front End
The front end is built using React with the MaterialUI component library. This is meant to be a single page application, and eventually a mobile application.

# Back End
The Back end is built using Flask + SQLAlchemy + Roboflow (inference).

# CV Model
As this is a proof of concept and MVP, the current model used is overfitted. 