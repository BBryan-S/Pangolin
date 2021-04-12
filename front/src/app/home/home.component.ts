import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, TOKEN } from '../Constant.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  signIn: Boolean = true;
  login: String = "";
  password: String = "";
  age: Number;
  famille: String = "";
  race: String = "";
  nourriture: String = "";


  constructor(private router: Router, private http: HttpClient) { }

  async ngOnInit() {
    const token = localStorage.getItem(TOKEN);
    if (!token)
      return;
    await axios.get(API_BASE_URL + '/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => { this.router.navigate(['Carnet'])})
    .catch(() => {})
  }

  Change() {
    this.signIn = !this.signIn;
  }

  async Connexion(e) {
    if (this.login === "" || this.password === "") {
      e.preventDefault();
      return;
    }
    
    this.http.post(API_BASE_URL + '/login', {
      login: this.login,
      password: this.password,
    }, {observe: 'response'}).subscribe(
      (result: any) => {
        localStorage.setItem(TOKEN, result.body.data.token);
        this.router.navigate(['Carnet']);
      },
      (error: any) => {
        console.log(error);
      })
  }

  Inscription(e) {
    if (this.login === "" || this.password === "") {
      e.preventDefault();
      alert("Vous devez remplir au moins les champs de login et de mot de passe")
      return;
    }

    axios.post(API_BASE_URL + '/signup', {
      login: this.login,
      password: this.password,
      age: this.age,
      famille: this.famille,
      race: this.race,
      nourriture: this.nourriture,
    }).then(() => {
      this.login = "";
      this.password = "";
      this.race = "";
      this.age = undefined;
      this.famille = "";
      this.nourriture = "";
      this.signIn = true;
    }).catch(err => {
      console.log(err);
      alert("Nous sommes désolé, il y a eu une erreur, nous n'avons pas pu créer votre compte");
    })
  }
}
