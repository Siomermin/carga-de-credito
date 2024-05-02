import { Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  public router = inject(Router);
  public renderer = inject(Renderer2);

  @ViewChild('h1Element') h1Element!: ElementRef;
  @ViewChild('h3Element') h3Element!: ElementRef;
  @ViewChild('imgElement') imgElement!: ElementRef;

  ngOnInit(): void {

    setTimeout(() => {
      // this.renderer.addClass(this.h1Element.nativeElement, 'tracking-in-expand');
      // this.renderer.addClass(this.h3Element.nativeElement, 'tracking-in-expand');
      this.renderer.addClass(this.imgElement.nativeElement, 'rotate-horizontal-center');
    }, 1000); // Add classes after 1 second (1000 milliseconds)

    setTimeout(() => {
      this.router.navigateByUrl('auth/login');
    }, 3000);


  }

}
