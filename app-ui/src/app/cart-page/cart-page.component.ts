import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { Cart } from '../shared/models/Cart';
import { RouterLink } from '@angular/router';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScreenshotService } from '../services/screenshot.service';
import { Init } from 'v8';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent {
  cart!: Cart;
  @ViewChild('captureElement', { static: false }) captureElement!: ElementRef;
  
  constructor(private cartservice: CartService,  private screenshotService: ScreenshotService) {
    this.setCart();
    window.scrollTo(0, 0);
  }

  setCart() {
    this.cart = this.cartservice.getCart();
  }

  updateQuantitiy(cartItemId: number,quantity:string) {
    this.cart = this.cartservice.updateQuantitiy(cartItemId,Number(quantity));
  }

  deleteCartItemById(cartItemId: number){
    this.cart = this.cartservice.deleteCartItemById(cartItemId);
  }
}
