import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'planify';

  constructor(){
    const firebaseConfig = {
      apiKey: "AIzaSyCfzDwOdtLc-DFifo2wE1UI3Wxl_oVQiVI",
      authDomain: "planify8.firebaseapp.com",
      databaseURL: "https://planify8.firebaseio.com",
      projectId: "planify8",
      storageBucket: "planify8.appspot.com",
      messagingSenderId: "840712621772",
      appId: "1:840712621772:web:635bb9459d547db1497c69"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }


}
