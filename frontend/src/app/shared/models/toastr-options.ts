export class ToastrOptions {
    // toastComponent:	Component = Toast                               // Angular component that will be used
    closeButton: boolean = false;                                       // Show close button
    timeOut: number = 5000;                                             // Time to live in milliseconds
    extendedTimeOut: number = 1000;                                     // Time to close after a user hovers over toast
    disableTimeOut:	boolean | 'timeOut' | 'extendedTimeOut'	= false;
    easing:	string = 'ease-in';                                          // Toast component easing
    easeTime: string | number = 300;                                     // Time spent easing
    enableHtml:	boolean = false;                                         // Allow html in message
    progressBar: boolean = false;                                        // Show progress bar
    progressAnimation: string = 'decreasing'; // 'decreasing' \| 'increasing' = 'decreasing';// Changes the animation of the progress bar.
    toastClass:	string = 'ngx-toastr';                                   // Class on toast
    positionClass: string = 'toast-top-right';                           // Class on toast container
    titleClass: string = 'toast-title';                                  // Class inside toast on title
    messageClass: string = 'toast-message';                              // Class inside toast on message
    tapToDismiss: boolean = true;                                        // Close on click
    onActivateTick:	boolean = false;    // Fires changeDetectorRef.detectChanges() when activated.
}                                       // Helps show toast from asynchronous events outside of Angular's change detection
