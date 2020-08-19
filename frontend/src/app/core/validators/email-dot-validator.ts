import { FormControl } from '@angular/forms';

export const emailDotValidator = () => {
  return(input: FormControl) => {
    const email = input.value;
    if (email != null){
      const domain = email.split('@')[1];
      console.log(domain);
      const index = domain.indexOf('.');
      if (index < 1){
          console.log(index);
          return { notValid: true };
        }
      return null;
      }
  };
};
