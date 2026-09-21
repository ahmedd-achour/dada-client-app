import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { PromoBanner } from '../../components/promo-banner/promo-banner';
import { Hero } from '../../components/hero/hero';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { Fleet } from '../../components/fleet/fleet';
import { Pricing } from '../../components/pricing/pricing';
import { AirportTransfer } from '../../components/airport-transfer/airport-transfer';
import { WhyUs } from '../../components/why-us/why-us';
import { CtaBanner } from '../../components/cta-banner/cta-banner';
import { LocationMap } from '../../components/location-map/location-map';
import { Footer } from '../../components/footer/footer';
import { FloatingChat } from '../../components/floating-chat/floating-chat';
import { BookingModal } from '../../components/booking-modal/booking-modal';

@Component({
  selector: 'app-landing',
  imports: [
    Navbar,
    PromoBanner,
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
  templateUrl: './landing.html',
})
export class Landing {}
