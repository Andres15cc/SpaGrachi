export const createNotification = (isError, message) => {
 const div = document.querySelector('#notification')
 
  if (isError) {
    div.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 flex justify-end">
        <p class="bg-red-500 text-white p-4 w-fit min-w-[200px] rounded-lg font-bold shadow-lg animate-bounce">${message}</p>
      </div>
    `;
  } else {
    div.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 flex justify-end">
        <p class="bg-green-500 text-white p-4 w-fit min-w-[200px] rounded-lg font-bold shadow-lg">${message}</p>
      </div>
    `;
  }

  // Limpiar la notificación después de 5 segundos
  setTimeout(() => {
    div.innerHTML = '';
  }, 5000);
};