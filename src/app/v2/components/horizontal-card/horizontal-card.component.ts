import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss'],
})
export class HorizontalCardComponent implements OnInit {
  // @ts-ignore
  @Input() icon: string;
  // @ts-ignore
  @Input() title: string;
  // @ts-ignore
  @Input() text: string;

  constructor() { }

  ngOnInit() { }
}
