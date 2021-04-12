import { Component, OnInit } from '@angular/core';
import { TOKEN, API_BASE_URL } from '../Constant.js';
import axios from 'axios';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.component.html',
  styleUrls: ['./carnet.component.scss']
})
export class CarnetComponent implements OnInit {
  data: any = [];
  users: any = [];

  constructor(private router: Router) { }

    async ngOnInit() {
        await this.GetInfos();
    }

    Deconnexion() {
        localStorage.removeItem(TOKEN)
        this.router.navigate([''])
    }

    async GetInfos() {
        const token = localStorage.getItem(TOKEN);
        if (!token)
            return;
        await axios.get(API_BASE_URL + '/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            this.data = res.data;
        })
        .catch((err) => {
            console.log(err);
            this.router.navigate(['']);
            return;
        })

        await axios.get(API_BASE_URL + '/list')
        .then((result) => {
            let list = result.data.list;
            list.splice(list.findIndex(item => { return item.login === this.data.login}), 1)
            list.forEach(it => {
                const test = this.data.amis.find(t => { return t === it.login})
                if (test) {
                    it.friend = true;
                } else
                    it.friend = false;
            })
            this.users = list;
        }).catch(err => {
            console.log(err);
            return;
        });
        return;
    }

    AddFriend(log) {
        const token = localStorage.getItem(TOKEN);
        axios.post(API_BASE_URL + "/addFriend", {
            login: log,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((res) => {
            console.log(res);
            this.GetInfos();
        })

    }

    RemoveFriend(log) {
        const token = localStorage.getItem(TOKEN);
        axios.post(API_BASE_URL + "/removeFriend", {
            login: log,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
            this.GetInfos();
        })

    }

}
