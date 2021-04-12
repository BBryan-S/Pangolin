import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { TOKEN, API_BASE_URL } from '../Constant.js';



@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: any = [];

  constructor(private router: Router) { }

  async ngOnInit() {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      this.router.navigate(['']);
      return;
    }

    await axios.get(API_BASE_URL + '/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((res) => {
      this.user = res.data;
    })
    .catch((err) => {
      console.log(err);
      this.router.navigate(['']);
      return false;
    });
  }

  async Update(e) {
    const token = localStorage.getItem(TOKEN)

    if (!token) {
      this.router.navigate(['']);
      return;
    }

    await axios.post(API_BASE_URL + '/update', {
      age: this.user.age,
      famille: this.user.famille,
      race: this.user.race,
      nourriture: this.user.nourriture,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}
