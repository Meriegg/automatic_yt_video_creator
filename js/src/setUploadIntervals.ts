import { setUploadTimer } from "./index";

(() => {
  setUploadTimer();

  setInterval(() => {
    console.log(
      "Intervalul de 24 de ore a inceput. Acum, in fiecare 24 de ore, intervalul de 5 ore va fii activat."
    );
    setUploadTimer();
  }, 10000 * 6 * 60 * 12 * 2 + 10000 * 6 * 60 * 6 /* 24 de ore + 6 ore */);
})();
