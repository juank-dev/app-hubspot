const ICON = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  QUESTION: 'question',
};

const AlertForm = (title = '', text = '', icon = ICON.INFO, position = 'center', timer = 7000) => {
  const Toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: icon === ICON.SUCCESS ? false : true,
    timer,
    timerProgressBar: true,
  });

  Toast.fire({
    icon,
    title,
    text,
  });
};

const AlertFormLarge = (title = '', text = '', icon = ICON.INFO, footer = null) => {
  Swal.fire({
    icon,
    title,
    text,
    footer,
  });
};

const AlertConfirm = (
  title = '',
  text = '',
  icon = ICON.WARNING,
  callback = () => {},
  textButton = 'Yes',
  textCancel = 'No'
) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: textButton,
    cancelButtonText: textCancel,
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};

const AlertConfirmThree = (
  title = '',
  html = '',
  callback = () => {},
  fallback = () => {},
  textButton = 'Yes',
  textDeny = 'No'
) => {
  Swal.fire({
    title,
    html,
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: textButton,
    denyButtonText: textDeny,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      callback();
    } else if (result.isDenied) {
      fallback();
    }
  });
};

const AlertHTML = (title = '', html = '', icon = ICON.INFO, footer = null) => {
  Swal.fire({
    icon,
    title,
    html,
    footer,
  });
};

const AlertConfirmHTML = (
  title = '',
  html = '',
  icon = ICON.WARNING,
  callback = () => {},
  fallback = () => {},
  textButton = 'Yes'
) => {
  Swal.fire({
    title,
    html,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: textButton,
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    } else if (result.dismiss === 'cancel') {
      fallback();
    }
  });
};

const AlertLoading = (title = 'Guardando...', text = '', allowOutsideClick = false) => {
  Swal.fire({
    title,
    text,
    allowOutsideClick,
  });
  Swal.showLoading();
};

const AlertClose = () => {
  Swal.close();
};

const AlertTemplate = (template = '#', width = '50rem', didClose = () => {}) => {
  Swal.fire({
    template,
    width,
    showCloseButton: true,
    iconColor: 'var(--primary-color)',
    confirmButtonColor: 'var(--primary-color)',
    didClose,
  });
};


const StepAlert = async ({title1 = "", htmlStep1 ="",
title2 = "", htmlStep2 ="", title3 = "", htmlStep3 ="", title4 = "", htmlStep4 ="",
title5 = "", htmlStep5 ="", title6 = "", htmlStep6 ="", title7 = "", htmlStep7 ="",
title8 = "", htmlStep8 =""  }) => {
  const steps = ['1', '2', '3', '4', '5', '6', '7', '8']
  const Queue = Swal.mixin({
    progressSteps: steps,
    width: '50rem',
    confirmButtonText: 'Siguiente >',
    confirmButtonColor: 'var(--primary-color)',
    
    // optional classes to avoid backdrop blinking between steps
    showClass: { backdrop: 'swal2-noanimation' },
    hideClass: { backdrop: 'swal2-noanimation' },
    customClass: {
      htmlContainer: 'container-step',
    }
  })

  await Queue.fire({
    title: title1,
    html: htmlStep1,
    currentProgressStep: 0,
    // optional class to show fade-in backdrop animation which was disabled in Queue mixin
    showClass: { backdrop: 'swal2-noanimation' },
  })
  await Queue.fire({
    title: title2,
    html: htmlStep2,
    currentProgressStep: 1,

  })
  await Queue.fire({
    title: title3,
    html: htmlStep3,
    currentProgressStep: 2
  })
  await Queue.fire({
    title: title4,
    html: htmlStep4,
    currentProgressStep: 3
  })
  await Queue.fire({
    title: title5,
    html: htmlStep5,
    currentProgressStep: 4
  })
  await Queue.fire({
    title: title6,
    html: htmlStep6,
    currentProgressStep: 5
  })
  await Queue.fire({
    title: title7,
    html: htmlStep7,
    currentProgressStep: 6
  })
  await Queue.fire({
    title: title8,
    html: htmlStep8,
    currentProgressStep: 7,
    confirmButtonText: 'Finalizar',
    // optional class to show fade-out backdrop animation which was disabled in Queue mixin
    showClass: { backdrop: 'swal2-noanimation' },
  })
}
const StepAlertV2 = async (items) => {
  let count = 1;
  let steps = []
  for (const item of items) {
    steps.push(count.toString());
    count++;
  }

  const swalQueueStep = Swal.mixin({
    cancelButtonText: '< Atras',
    progressSteps: steps,
    width: '60rem',
    confirmButtonColor: 'var(--primary-color)',
    reverseButtons: true,
    focusConfirm: false,
    showCloseButton: true,
    focusCancel: false,
    // optional classes to avoid backdrop blinking between steps
    showClass: { backdrop: 'swal2-noanimation' },
    hideClass: { backdrop: 'swal2-noanimation' },
    customClass: {
      htmlContainer: 'container-step',
    }
  })

let currentStep;

for (currentStep = 0; currentStep < steps.length;) {
  let item = items[currentStep];
  const result = await swalQueueStep.fire({
    title: item.title,
    html: item.html,
    showCancelButton: currentStep > 0,
    currentProgressStep: currentStep,
    confirmButtonText: steps.length - 1 === currentStep ? 'Finalizar':'Siguiente >',
  })

  if (result.isConfirmed) {
    currentStep++
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    currentStep--
  } else {
    break
  }
}
}
