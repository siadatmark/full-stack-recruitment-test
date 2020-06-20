import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export class IFlight {
  itineraries: IItinerarie[];
  legs: ILeg[];
}

export interface IItinerarie {
  id: string;
  price: string;
  agent: string;
  agent_rating: number;
  legs: string[];
}

export class ItinerarieModel implements IItinerarie {
  id: string;
  price: string;
  agent: string;
  agent_rating: number;
  legs: string[];
  legModellist: LegModel[];

  set(model: IItinerarie) {
    this.id = model.id;
    this.price = model.price;
    this.agent = model.agent;
    this.agent_rating = model.agent_rating;
    this.legs = model.legs;
  }

  createLegModels(list: LegModel[]): void {
    this.legModellist = list.filter(x => this.legs.includes(x.id));
  }
}

export interface ILeg {
  id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  stops: number;
  airline_name: string;
  airline_id: string;
  duration_mins: string;
}

export class LegModel implements ILeg {
  id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  stops: number;
  airline_name: string;
  airline_id: string;
  duration_mins: string;

  set(mode: ILeg) {
    this.id = mode.id;
    this.departure_airport = mode.departure_airport;
    this.arrival_airport = mode.arrival_airport;
    this.departure_time = mode.departure_time;
    this.arrival_time = mode.arrival_time;
    this.stops = mode.stops;
    this.arrival_time = mode.arrival_time;
    this.airline_id = mode.airline_id;
    this.duration_mins = mode.duration_mins;
  }

  airLineImageUrl(): string {
    const value = "https://logos.skyscnr.com/images/airlines/favicon/"+ this.airline_id +".png"
    return value;
  }

  departureDisplayTime(): string {
    const value = this.departure_time.split("T")[1];
    return value;
  }

  arrivalDisplayTime(): string {
    const value = this.arrival_time.split("T")[1];
    return value;  
  }

  tripDisplayTime(): string {
    // https://stackoverflow.com/a/37096512
    const d = Number(this.duration_mins)*60;
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "" : "") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  isDirect(): boolean {
    var value = this.stops === 0;
    return value;
  }

  stopsDisplay(): string {
    var value = this.isDirect() ? "Direct" : this.stops.toString() + " stop";
    return value;
  }
}

export class FlightDetailService {

  constructor(private http: HttpClient) { }

  flightDetails() : Observable<IFlight> {
    return this.http.get<IFlight>('/datas/flights.json');
  }
}

@Component({
  templateUrl: 'flightDashboard.component.html'
})
export class FlightDashboardComponent implements OnInit {

  service: FlightDetailService;
  list: ItinerarieModel[] = [];

  constructor(private http: HttpClient) { 
    this.service = new FlightDetailService(http);
  }

  ngOnInit(): void {
    // this.notify.blockUi(false);
    this.service.flightDetails().subscribe((data) => {
      const legs: LegModel[] = [];
      const itineraries: ItinerarieModel[] = [];
      data.legs.forEach(x => { 
        const model = new LegModel();
        model.set(x);
        legs.push(model);
      })
      data.itineraries.forEach(x => { 
        const model = new ItinerarieModel();
        model.set(x);
        model.createLegModels(legs);
        itineraries.push(model);
      });
      this.list = itineraries;
      // this.notify.blockUi(false);
    },
    error => {
      // this.notify.error("Unable to load roles.");
      // this.notify.blockUi(false);
    });
  }
}
