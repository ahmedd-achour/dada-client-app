import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { Fleet } from './components/fleet/fleet';
import { Pricing } from './components/pricing/pricing';
import { AirportTransfer } from './components/airport-transfer/airport-transfer';
import { WhyUs } from './components/why-us/why-us';
import { CtaBanner } from './components/cta-banner/cta-banner';
import { LocationMap } from './components/location-map/location-map';
import { Footer } from './components/footer/footer';
import { FloatingChat } from './components/floating-chat/floating-chat';
import { BookingModal } from './components/booking-modal/booking-modal';

@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    Hero,
    HowItWorks,
    Fleet,
    Pricing,
    AirportTransfer,
    WhyUs,
    CtaBanner,
    LocationMap,
    Footer,
    FloatingChat,
    BookingModal,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
