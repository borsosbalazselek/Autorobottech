import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

import { Observable } from 'rxjs';

class JsonTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

export function loaderFactory(http: HttpClient) {
  return new JsonTranslateLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: loaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
});