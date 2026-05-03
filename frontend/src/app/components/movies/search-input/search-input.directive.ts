import { Directive, input, model, numberAttribute } from "@angular/core";

@Directive({  
  selector: 'input[debounceTime]',  
  host: {  
    '[value]': 'value()',  
    '(input)': 'handleInput($event)',  
  },  
})  
export class Debounce {  
  #debounceTimer?: ReturnType<typeof setTimeout>;  

  readonly debounceTime = input(0, { transform: numberAttribute });  
  readonly value = model<string>();  

  handleInput(event: Event): void {  
    const value =
      (event.target as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';

    clearTimeout(this.#debounceTimer);

    if (!value || !this.debounceTime()) {  
      this.value.set(value);  
    } else {  
      this.#debounceTimer = setTimeout(() => this.value.set(value), this.debounceTime());
    }  
  }  
}