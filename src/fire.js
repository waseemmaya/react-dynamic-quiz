import firebase from "firebase";

var config = {
  apiKey: "AIzaSyBwsvUi092vuey7Ba9JGlR2vefhM0qC6fc",
  authDomain: "react-dynamic-quiz.firebaseapp.com",
  databaseURL: "https://react-dynamic-quiz.firebaseio.com",
  projectId: "react-dynamic-quiz",
  storageBucket: "react-dynamic-quiz.appspot.com",
  messagingSenderId: "636897309007"
};

var fire = firebase.initializeApp(config);
export default fire;
