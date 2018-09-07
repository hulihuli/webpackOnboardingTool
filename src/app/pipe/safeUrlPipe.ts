import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) { }

  transform(url: string) {
    if (url) {
        let upperCasedUrl = url.toUpperCase();
        if (!upperCasedUrl.startsWith("HTTP")) {
            let pos = upperCasedUrl.indexOf("HTTP");
            url = url.substr(pos);
        }
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}