import { NgModule } from '@angular/core';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { OnboardingSliderComponent } from './onboarding-slider/onboarding-slider.component';

const COMPONENTS = [LocationPickerComponent, OnboardingSliderComponent];

@NgModule({
    imports: [AutoCompleteModule, CommonModule, FormsModule, IonicModule],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    entryComponents: COMPONENTS,
})
export class V2ComponentsModule {}
