import { Component, HostListener, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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

  private translate = inject(TranslateService);
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  // + állapot
langOpen = false;

// + aktuális nyelv (ngx-translate)
get currentLang(): string {
  return this.translate.currentLang || this.translate.defaultLang || 'hu';
}

// + kis emoji zászló a fülre
flagFor(lang: string): string {
  return lang === 'hu' ? '🇭🇺' : '🇬🇧';
}

toggleLangFab(e?: Event) {
  e?.stopPropagation();
  this.langOpen = !this.langOpen;
}

setLangAndClose(lang: 'hu' | 'en', e?: Event) {
  e?.stopPropagation();
  this.switchLang(lang);     // a meglévő függvényedet használjuk
  this.langOpen = false;
}

// kattintás “kívül” => zár
@HostListener('document:click', ['$event'])
onDocClick(ev: MouseEvent) {
  if (!this.langOpen) return;
  const t = ev.target as HTMLElement | null;
  if (!t?.closest('.lang-fab')) this.langOpen = false;
}

// ESC => zár
@HostListener('document:keydown', ['$event'])
onDocKey(ev: KeyboardEvent) {
  if (ev.key === 'Escape') this.langOpen = false;
}

  constructor() {
    this.translate.addLangs(['hu', 'en']);
    this.translate.setDefaultLang('hu');
    this.translate.use('hu');

    // első betöltés + minden nyelvváltás után frissítjük a head-et
    this.applySeoForCurrentLang();
    this.translate.onLangChange.subscribe(() => this.applySeoForCurrentLang());
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    this.closeNav();
  }

  private applySeoForCurrentLang() {
    const lang = this.translate.currentLang || this.translate.defaultLang || 'hu';

    // <html lang="">
    this.doc.documentElement.lang = lang;

    // Title + meta description a fordításból
    const seoTitle = this.translate.instant('seoTitle');
    const seoDescription = this.translate.instant('seoDescription');

    if (seoTitle) this.title.setTitle(seoTitle);

    if (seoDescription) {
      this.meta.updateTag({ name: 'description', content: seoDescription });
      this.meta.updateTag({ property: 'og:description', content: seoDescription });
      this.meta.updateTag({ name: 'twitter:description', content: seoDescription });
    }

    if (seoTitle) {
      this.meta.updateTag({ property: 'og:title', content: seoTitle });
      this.meta.updateTag({ name: 'twitter:title', content: seoTitle });
    }

    // canonical – maradhat fix, de legalább legyen konzisztens
    const canonicalUrl = this.doc.location?.origin ? `${this.doc.location.origin}/` : 'https://autorobottech.hu/';
    this.setCanonical(canonicalUrl);
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  private setCanonical(url: string) {
    let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  toggleNav() { this.navOpen = !this.navOpen; }
  closeNav() { this.navOpen = false; }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 10;
  }

  onSubmit(e: Event) {
    e.preventDefault();
    alert('Köszönjük! Hamarosan jelentkezünk.');
  }
}