import qrcode from 'qrcode';
import { Input, Renderer2, ElementRef, Component, OnChanges, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'mat-qrcode',
    styleUrls: ['./mat-qrcode.component.scss'],
    templateUrl: './mat-qrcode.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MatQrcodeComponent implements OnChanges {

    @Input('value') public value: string = '';
    @Input('width') public width: number = 400;
    @Input('height') public height: number = 400;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    private async redraw() {
        const image = await qrcode.toDataURL(this.value, {
            'width': this.width,
            'height': this.height
        });
        this.renderer.setStyle(this.element, 'background-image', ['url(', image, ')'].join(''));
    };

    ngOnChanges(): void {
        this.redraw();
    };

}