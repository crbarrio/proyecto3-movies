import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../components/shared/navbar/navbar";
import { Footer } from "../components/shared/footer/footer";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export default class Layout {}
