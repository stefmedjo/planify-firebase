import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  constructor(
    private titleService : Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("Pricing | Planify")
  }

}
