# Language correction messenger

## Summary

With more and more learning taking place online, I wanted to create a way for language learners to have conversations with teachers online through a messenger which was specifically designed to enable corrections and learning opportunities which could be seamlessly integrated into the conversation.

## Technology

I chose to use Tailwind primarily with the aim of spending less time on the design process and responsiveness in order to prioritise time spent on the functionality of the app. React was used because of the number of reusable components there would be in the app, from dynamically created tab components, to the messages themselves. Firebase was used on the back-end as the project required authentication, a database, as well as storage for audio files. Firebase allowed for easy integration of all these features, as well as hosting.

## Challenges and Improvements

One of the biggest challenges I had with this project was working with audio. One such challenge was in regard to appending audio to messages which had already been created and rendered in the messenger. Ultimately the solution was simply to store the audio files in folders which served as references to individual messages. I did however encounter some stumbling blocks related to audio blobs and audio URLs which took longer than they should have to resolve. Sometimes it is easy to get caught up in the enthusiasm to just get things to work, where in fact it is often a better use of time to take a step back and learn a little more about the technology you are using before getting started with it.

I consider the application very much a work in progress and I intend to keep coming back to it to make improvements and add new features. Firstly, my solution to dynamically creating tabbed components does not use dynamic routing, which I’m now quite sure would be a better way of implementing such a feature. In terms of UX, clicking elsewhere in the messenger should deselect previously selected messages, and student users should receive clear feedback that words they have selected have been highlighted for the teacher. There are also a number of other features which I feel would benefit the application, but for now will be focussing on polishing it up and getting some feedback from potential users.

## Lessons learned

This project has further highlighted to me the importance of organisation and planning ahead where possible. This may be especially true of React apps where consideration must be given to the flow of information between components. No doubt being able to adapt to the evolution of a project is an important skill, but looking back on the project, I feel as though I could have saved quite a lot of time if I had started with a clearer vision of exactly how the project should have been organised.
