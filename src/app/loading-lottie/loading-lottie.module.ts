import { ApplicationConfig, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import player from 'lottie-web';
import { provideLottieOptions } from 'ngx-lottie';

export function playerFactory() {
  return player;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ],
}; 
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
        .forRoot({ player: playerFactory })
  ]
})
export class LoadingLottieModule { }
