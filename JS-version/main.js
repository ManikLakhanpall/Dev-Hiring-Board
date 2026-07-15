class Button {
  constructor(label) {
    this.label = label;
    // this.click = this.click.bind(this); 
  }
  click = () => { console.log(this.label); }
}

const mb = new Button('Click me');
mb.click(); // Click me