import { Component, HostListener } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranslateModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  navOpen = false;
  scrolled = false;

  constructor(private translate: TranslateService) {
    translate.addLangs(['hu', 'en']);
    translate.setDefaultLang('hu');
    translate.use('hu');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.closeNav();
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  closeNav() {
    this.navOpen = false;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }



  onSubmit(e: Event) {
  e.preventDefault();
  alert('Köszönjük! Hamarosan jelentkezünk.');
}
}
