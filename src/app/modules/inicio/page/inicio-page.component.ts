import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.component.html',
  styleUrls: ['./inicio-page.component.scss']
})
export class InicioPageComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  private initCarousel() {
    const myCarouselElement = document.querySelector('#imageCarousel');
    if (myCarouselElement) {
      const carousel = new Carousel(myCarouselElement, {
        interval: 5000, 
        wrap: true
      });
      carousel.cycle(); 
    }
  }
}