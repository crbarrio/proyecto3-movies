import { Component, model } from '@angular/core';
import { Debounce } from './search-input.directive';


@Component({
  selector: 'app-search-input',
  imports: [Debounce],
  templateUrl: './search-input.html',
})
export class SearchInput {

  readonly query = model('');



}
