import '@babel/polyfill';

/* eslint-disable import/prefer-default-export */
export const sleep = async ms =>
  new Promise(resolve => setTimeout(resolve, ms));
