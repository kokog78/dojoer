import {computedFrom} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

interface Counter {
  key: string;
  value: number;
  max: number;
  percent: number;
  style: string;
  class: string
}

export class App {

  name: string;
  maxValue: number = 0;
  counters: Counter[];
  client: HttpClient = new HttpClient();

  @computedFrom('name')
  get isNormalUser(): boolean {
    return this.name && this.name !== 'admin';
  }

  @computedFrom('name')
  get isAdminUser(): boolean {
    return this.name === 'admin';
  }

  attached() {
    this.getMaxValue();
    this.reload();
  }

  increment() {
    this.client.fetch(`/api/counters/${this.name}`, {
      method: 'put'
    }).then(response => this.reload());
  }

  decrement() {
    this.client.fetch(`/api/counters/${this.name}`, {
      method: 'delete'
    }).then(response => this.reload());
  }

  setMaxValue() {
    this.client.fetch(`/api/max-counter/${this.maxValue ? this.maxValue : 0}`, {
      method: 'post'
    }).then(response => this.reload());
  }

  getMaxValue() {
    this.client.fetch('/api/max-counter', {
      method: 'get'
    })
      .then(response => response.json())
      .then(response => this.maxValue = response);
  }

  reload() {
    this.client.fetch('/api/counters', {
      method: 'get'
    })
      .then(response => response.json())
      .then(response => {
      this.counters = response;
      let max: number = 0;
      for (let counter of this.counters) {
        if (counter.value > max) {
          max = counter.value;
        }
        if (counter.max > max) {
          max = counter.max;
        }
        if (counter.max <= 0) {
          counter.class = 'success';
        } else if (counter.value < counter.max) {
          counter.class = 'danger';
        } else if (counter.value === counter.max) {
          counter.class = 'success';
        } else if (counter.value > counter.max) {
          counter.class = 'warning';
        }
      }
      for (let counter of this.counters) {
        counter.percent = 100.0 * counter.value / max;
        counter.style = `width: ${counter.percent}%`;
      }
    });
  }

  clear() {
    this.client.fetch('/api/counters', {
      method: 'delete'
    }).then(response => this.reload());
  }
}
